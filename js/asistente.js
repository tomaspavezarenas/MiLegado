// Asistente de ayuda. Funciona sin internet ni IA: entiende por palabras clave.
// Las preguntas y respuestas se editan en js/datos.js (PREGUNTAS y ASISTENTE).
// Si no logra resolver el problema, deriva a una persona por WhatsApp con la consulta ya escrita.
(function () {
  "use strict";
  const T = window.Tienda;
  if (!T) return;
  const { el, normalizar } = T;
  const $ = (id) => document.getElementById(id);

  const chat = $("chat");
  const boton = $("chat-boton");
  const caja = $("chat-mensajes");
  const form = $("chat-form");
  const input = $("chat-input");

  const historial = []; // lo que escribió el cliente, para pasárselo a la persona que atienda
  let fallos = 0;
  let iniciado = false;
  let cola = Promise.resolve();

  // Palabras que no aportan para buscar productos
  const VACIAS = new Set(("el la los las un una unos unas de del que y o a en por para con me mi mis se es son hay " +
    "tienen tiene tienes quiero queria quisiera como cual cuales cuanto cuanta cuesta cuestan vale valen precio precios " +
    "hola buenas algo lo le su sus al no si ya esta estan este esto ese eso tu te muy mas menos hacer puedo puede necesito busco").split(" "));
  const SALUDOS = ["hola", "buenas", "buen dia", "buenos dias", "buenas tardes", "buenas noches", "hey", "alo"];
  const GRACIAS = ["gracias", "genial", "perfecto", "excelente", "listo", "vale"];
  const CATALOGO = ["que venden", "catalogo", "productos", "que tienen", "que hay", "que ofrecen"];

  const tokens = (texto) => normalizar(texto).replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  // "envio" ≈ "envios", "pago" ≈ "pagos", "polera" ≈ "poleras"
  const parecidas = (a, b) => a === b || (Math.min(a.length, b.length) >= 4 && (a.startsWith(b) || b.startsWith(a)));

  function contiene(toks, clave) {
    const k = tokens(clave).join(" ");
    if (!k) return false;
    if (k.includes(" ")) return (" " + toks.join(" ") + " ").includes(" " + k + " ");
    return toks.some((t) => parecidas(t, k));
  }

  // Devuelve las preguntas con más coincidencias (hasta 2 si hay empate).
  function mejoresPreguntas(toks) {
    const puntuadas = PREGUNTAS.map((q) => {
      // Cada palabra del cliente suma una sola vez por pregunta
      // (así "envio" y "envios" en la lista no cuentan doble). Las frases suman 2.
      let s = 0;
      const usadas = new Set();
      for (const k of q.palabras) {
        const kt = tokens(k);
        if (kt.length > 1) { if (contiene(toks, k)) s += 2; continue; }
        toks.forEach((t, i) => { if (kt[0] && !usadas.has(i) && parecidas(t, kt[0])) { usadas.add(i); s++; } });
      }
      return { q, s };
    }).filter((x) => x.s > 0);
    const max = Math.max(0, ...puntuadas.map((x) => x.s));
    return puntuadas.filter((x) => x.s === max).slice(0, 2).map((x) => x.q);
  }

  function buscarProductos(toks) {
    const utiles = toks.filter((t) => t.length >= 3 && !VACIAS.has(t));
    if (!utiles.length) return [];
    const puntuados = T.productos
      .map((p) => {
        const nombre = tokens(p.nombre);
        return { p, s: utiles.filter((u) => nombre.some((n) => parecidas(n, u))).length };
      })
      .filter((x) => x.s > 0);
    const max = Math.max(0, ...puntuados.map((x) => x.s));
    return puntuados.filter((x) => x.s === max).map((x) => x.p);
  }

  function buscarCategoria(toks) {
    const cats = [...new Set(T.productos.map((p) => p.categoria))];
    return cats.find((c) => tokens(c).some((ct) => toks.some((t) => parecidas(t, ct)))) || null;
  }

  // ---------- piezas del chat ----------

  const burbuja = (texto, de) => el("div", { class: `burbuja burbuja--${de}` }, texto);

  function opciones(lista) {
    const grupo = el("div", { class: "opciones" });
    for (const o of lista) {
      grupo.append(el("button", {
        type: "button",
        class: "opcion" + (o.fuerte ? " opcion--fuerte" : ""),
        onclick: () => { grupo.remove(); o.fn(); },
      }, o.texto));
    }
    return grupo;
  }

  function ficha(p) {
    const agotado = p.stock === false;
    const detalle = p.opciones.length > 1
      ? p.opciones.map((o) => `${o.nombre}: ${o.agotado ? "agotado" : T.dinero.format(o.precio)}`).join(" · ")
      : `${p.opciones[0].nombre ? p.opciones[0].nombre + ": " : ""}${T.dinero.format(p.desde)}`;
    return el("div", { class: "ficha" },
      T.lamina(p),
      el("div", {},
        el("p", { class: "ficha__nombre" }, p.nombre),
        el("p", { class: "ficha__datos" }, agotado ? `${detalle} · Agotado` : detalle),
        agotado
          ? el("p", { class: "ficha__datos" }, "Pregúntanos cuándo vuelve.")
          : el("div", { class: "ficha__botones" }, ...p.opciones.filter((o) => !o.agotado).map((o) =>
              el("button", { type: "button", class: "enlace", onclick: () => agregarDesdeChat(p, o) },
                o.nombre && p.opciones.length > 1 ? `Agregar ${o.nombre} +` : "Agregar al carrito +")))));
  }

  // Preguntas con respuesta publicada (las "derivar" van directo a una persona)
  const conRespuesta = () => PREGUNTAS.filter((q) => !q.derivar);

  function temas() {
    return opciones([
      ...conRespuesta().slice(0, 4).map((q) => ({ texto: q.pregunta, fn: () => { cliente(q.pregunta); decir(respuestaPregunta(q)); } })),
      { texto: "Hablar con una persona", fuerte: true, fn: () => { cliente("Quiero hablar con una persona"); decir(derivar("Claro, te comunico con el equipo.")); } },
    ]);
  }

  function preguntaSiSirvio() {
    return opciones([
      { texto: "Sí, gracias", fn: () => { cliente("Sí, gracias"); decir([burbuja("¡Genial! Si necesitas algo más, aquí estoy.", "bot")]); } },
      { texto: "No, necesito más ayuda", fuerte: true, fn: () => { cliente("No, necesito más ayuda"); decir(derivar("Entiendo. Te comunico con una persona del equipo para que lo resuelva contigo.")); } },
    ]);
  }

  function respuestaPregunta(q) {
    fallos = 0;
    // Temas sin información publicada: no se inventa, se pasa a una persona
    if (q.derivar) return derivar(q.respuesta || "Eso te lo confirma directamente el equipo.");
    return [burbuja(q.respuesta, "bot"), preguntaSiSirvio()];
  }

  // Tarjeta para pasar la conversación a una persona por WhatsApp
  function derivar(intro) {
    fallos = 0;
    const consultas = historial.slice(-3).map((h) => `• ${h}`);
    const carrito = T.resumenCarrito();
    const mensaje = [
      `Hola, vengo del asistente de la web de ${TIENDA.nombre} y necesito ayuda.`,
      "",
      "Mi consulta:",
      ...(consultas.length ? consultas : ["• (sin detalle)"]),
      ...(carrito.length ? ["", "Tengo en el carrito:", ...carrito] : []),
    ].join("\n");
    const url = T.enlaceWhatsApp(mensaje);

    const tarjeta = el("div", { class: "contacto-humano" },
      el("strong", {}, "Atención personalizada"),
      el("span", {}, "Se abrirá WhatsApp con tu consulta ya escrita. Solo tienes que enviarla."),
      url
        ? el("a", { class: "btn btn--solido", href: url, target: "_blank", rel: "noopener" }, "Continuar en WhatsApp →")
        : el("button", { type: "button", class: "btn btn--solido", onclick: () => T.abrirWhatsApp(mensaje) }, "Continuar en WhatsApp →"),
      TIENDA.correo ? el("small", {}, `También puedes escribirnos a ${TIENDA.correo}`) : null);
    return [burbuja(intro, "bot"), tarjeta];
  }

  function agregarDesdeChat(p, o) {
    if (!T.agregar(p.id, o.nombre)) return;
    const nombre = o.nombre ? `${p.nombre} (${o.nombre})` : p.nombre;
    cliente(`Agregar ${nombre}`);
    decir([
      burbuja(`Listo, agregué ${nombre} a tu carrito.`, "bot"),
      opciones([
        { texto: "Ver carrito", fuerte: true, fn: () => T.abrirCarrito() },
        { texto: "Tengo otra consulta", fn: () => { cliente("Tengo otra consulta"); decir([burbuja("Claro, cuéntame.", "bot"), temas()]); } },
      ]),
    ]);
  }

  // ---------- cerebro ----------

  function responder(texto) {
    const toks = tokens(texto);
    if (!toks.length) return [burbuja("¿Me cuentas un poco más?", "bot")];

    // 1) Pide una persona o es un problema que el bot no puede ver (estado del pedido, reclamo)
    if (ASISTENTE.palabrasHumano.some((k) => contiene(toks, k))) {
      return derivar("Entiendo. Esto lo resuelve mejor una persona del equipo, que puede revisar tu caso.");
    }

    const preguntas = mejoresPreguntas(toks);
    // Las palabras que ya activaron una pregunta no se usan para buscar productos
    // (ej: "¿son naturales?" no debe mostrar "Fémur Natural").
    const claves = preguntas.flatMap((q) => q.palabras);
    const resto = toks.filter((t) => !claves.some((k) => contiene([t], k)));
    const encontrados = buscarProductos(resto);
    const cat = encontrados.length ? null : buscarCategoria(toks);

    // 2) Pregunta frecuente (y si menciona un producto, también lo muestra)
    if (preguntas.length) {
      const aDerivar = preguntas.find((q) => q.derivar);
      if (aDerivar) return respuestaPregunta(aDerivar);
      fallos = 0;
      return [
        ...preguntas.map((q) => burbuja(q.respuesta, "bot")),
        ...encontrados.slice(0, 2).map(ficha),
        preguntaSiSirvio(),
      ];
    }
    // 3) Producto o categoría
    if (encontrados.length) {
      fallos = 0;
      return [burbuja(encontrados.length > 1 ? "Encontré estos productos:" : "Esto es lo que encontré:", "bot"), ...encontrados.slice(0, 3).map(ficha)];
    }
    if (cat) {
      fallos = 0;
      return [burbuja(`En ${cat} tenemos:`, "bot"), ...T.productos.filter((p) => p.categoria === cat).slice(0, 4).map(ficha)];
    }
    // 4) Conversación general
    if (CATALOGO.some((k) => contiene(toks, k))) {
      fallos = 0;
      const cats = [...new Set(T.productos.map((p) => p.categoria))];
      return [
        burbuja(`Tenemos ${T.productos.length} productos en: ${cats.join(", ")}. ¿Cuál te interesa?`, "bot"),
        opciones(cats.map((c) => ({ texto: c, fn: () => enviar(c) }))),
      ];
    }
    if (GRACIAS.some((k) => contiene(toks, k))) return [burbuja("¡De nada! Si necesitas algo más, aquí estoy.", "bot")];
    if (toks.length <= 3 && SALUDOS.some((k) => contiene(toks, k))) return [burbuja("¡Hola! ¿En qué te puedo ayudar?", "bot"), temas()];

    // 5) No entendió: a los N intentos, ofrece una persona
    fallos++;
    if (fallos >= ASISTENTE.intentosAntesDeDerivar) {
      return derivar("Disculpa, no logro resolver tu consulta. Lo mejor es que te atienda una persona del equipo.");
    }
    return [burbuja("No estoy seguro de haberte entendido. ¿Tu consulta es sobre alguno de estos temas?", "bot"), temas()];
  }

  // ---------- mostrar mensajes ----------

  function bajar() { caja.scrollTop = caja.scrollHeight; }

  // El mensaje del cliente también entra a la cola, para que nunca aparezca
  // antes de que el bot termine de responder lo anterior.
  function cliente(texto) {
    historial.push(texto);
    const nodo = burbuja(texto, "cliente");
    cola = cola.then(() => { caja.append(nodo); bajar(); });
  }

  const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

  // Muestra "escribiendo…" y luego las respuestas, en orden.
  function decir(nodos) {
    cola = cola.then(async () => {
      const escribiendo = el("div", { class: "burbuja burbuja--bot escribiendo", "aria-label": "Escribiendo" },
        el("span"), el("span"), el("span"));
      caja.append(escribiendo);
      bajar();
      await esperar(550);
      escribiendo.remove();
      for (const n of nodos) {
        caja.append(n);
        bajar();
        await esperar(140);
      }
    });
    return cola;
  }

  function enviar(texto) {
    const limpio = String(texto).trim().slice(0, 300);
    if (!limpio) return;
    cliente(limpio);
    decir(responder(limpio));
  }

  // ---------- abrir / cerrar ----------

  function abrir() {
    chat.inert = false;
    chat.classList.add("abierto");
    boton.setAttribute("aria-expanded", "true");
    if (!iniciado) {
      iniciado = true;
      decir([burbuja(ASISTENTE.saludo, "bot"), temas()]);
    }
    setTimeout(() => input.focus(), 60);
  }

  function cerrar(devolverFoco) {
    chat.classList.remove("abierto");
    chat.inert = true;
    boton.setAttribute("aria-expanded", "false");
    if (devolverFoco) boton.focus();
  }

  $("chat-titulo").textContent = ASISTENTE.nombre;
  boton.addEventListener("click", abrir);
  $("abrir-asistente").addEventListener("click", abrir);
  $("chat-cerrar").addEventListener("click", () => cerrar(true));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    enviar(input.value);
    input.value = "";
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && chat.classList.contains("abierto")) cerrar(true);
  });
  document.addEventListener("tienda:abre-carrito", () => {
    if (chat.classList.contains("abierto")) cerrar(false);
  });

  // Para probar desde la consola del navegador: Asistente.enviar("hola")
  window.Asistente = { abrir, cerrar, enviar };
})();
