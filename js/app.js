// Lógica de la tienda. Normalmente no necesitas tocar este archivo:
// los datos se editan en js/datos.js
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  const CLAVE_CARRITO = "tienda-carrito-v2";
  const CLAVE_VISTA = "tienda-vista";
  const NUMERO_EJEMPLO = "56900000000";
  const MAX_CANTIDAD = 99;
  const TONO_DEFECTO = "#d6cfc4";
  const SEP = "::"; // separa producto y opción en el carrito: "patitas::100g"

  const dinero = new Intl.NumberFormat(TIENDA.locale, { style: "currency", currency: TIENDA.moneda });
  // Cada producto puede tener "opciones" (tamaños/pesos con su precio) o un "precio" único.
  const porId = new Map(PRODUCTOS.map((p, i) => {
    const opciones = Array.isArray(p.opciones) && p.opciones.length
      ? p.opciones.map((o) => ({ nombre: String(o.nombre), precio: Number(o.precio), agotado: o.agotado === true }))
      : [{ nombre: "", precio: Number(p.precio), agotado: false }];
    return [p.id, { ...p, numero: i + 1, opciones, desde: Math.min(...opciones.map((o) => o.precio)) }];
  }));
  const productos = [...porId.values()];
  const $ = (id) => document.getElementById(id);
  const sinMovimiento = matchMedia("(prefers-reduced-motion: reduce)").matches;

  let carrito = cargarCarrito(); // { "idProducto::opción": cantidad }
  let categoria = "Todas";
  let busqueda = "";
  let vista = leer(CLAVE_VISTA) === "indice" ? "indice" : "grilla";
  let ultimoFoco = null;
  let temporizadorAviso = null;

  // ---------- utilidades ----------

  // Crea elementos con texto seguro (los strings se agregan como texto, nunca como HTML).
  function el(tag, attrs = {}, ...hijos) {
    const nodo = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") nodo.className = v;
      else if (k.startsWith("on")) nodo.addEventListener(k.slice(2), v);
      else if (v === true) nodo.setAttribute(k, "");
      else if (v !== false && v != null) nodo.setAttribute(k, v);
    }
    for (const h of hijos) if (h != null) nodo.append(h);
    return nodo;
  }

  function svg(tag, attrs = {}) {
    const nodo = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const [k, v] of Object.entries(attrs)) nodo.setAttribute(k, v);
    return nodo;
  }

  const normalizar = (t) => String(t).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const numero = (p) => "N°" + String(p.numero).padStart(2, "0");
  const precioTexto = (p) => (p.opciones.length > 1 ? "Desde " : "") + dinero.format(p.desde);
  // Solo se aceptan colores hex: evita que un dato mal escrito rompa los estilos.
  const tonoSeguro = (t) => (/^#[0-9a-f]{3,8}$/i.test(t || "") ? t : TONO_DEFECTO);

  function leer(clave) { try { return localStorage.getItem(clave); } catch { return null; } }
  function escribir(clave, valor) { try { localStorage.setItem(clave, valor); } catch { /* modo privado */ } }

  const claveLinea = (id, opcion) => id + SEP + (opcion || "");
  // Devuelve { p, o } para una línea del carrito, o null si ya no existe.
  function linea(clave) {
    const i = clave.indexOf(SEP);
    const id = i < 0 ? clave : clave.slice(0, i);
    const op = i < 0 ? "" : clave.slice(i + SEP.length);
    const p = porId.get(id);
    const o = p && p.opciones.find((x) => x.nombre === op);
    return o ? { p, o } : null;
  }
  const nombreLinea = (p, o) => (o.nombre ? `${p.nombre} (${o.nombre})` : p.nombre);

  function cargarCarrito() {
    try {
      const datos = JSON.parse(leer(CLAVE_CARRITO) || "{}");
      const limpio = {};
      // Descarta productos u opciones que ya no existen, agotados o cantidades inválidas.
      for (const [k, n] of Object.entries(datos)) {
        const l = linea(k);
        if (l && l.p.stock !== false && !l.o.agotado && Number.isInteger(n) && n > 0) limpio[k] = Math.min(n, MAX_CANTIDAD);
      }
      return limpio;
    } catch {
      return {};
    }
  }
  const guardarCarrito = () => escribir(CLAVE_CARRITO, JSON.stringify(carrito));

  function totalCarrito() {
    let total = 0, unidades = 0;
    for (const [k, n] of Object.entries(carrito)) {
      total += linea(k).o.precio * n;
      unidades += n;
    }
    return { total, unidades };
  }

  function resumenCarrito() {
    return Object.entries(carrito).map(([k, n]) => {
      const { p, o } = linea(k);
      return `• ${n} x ${nombreLinea(p, o)} — ${dinero.format(o.precio * n)}`;
    });
  }

  function aviso(texto) {
    const caja = $("aviso");
    caja.textContent = texto;
    caja.classList.add("visible");
    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(() => caja.classList.remove("visible"), 2400);
  }

  // Devuelve el link de WhatsApp, o null si el número sigue siendo el de ejemplo.
  function enlaceWhatsApp(mensaje) {
    const num = String(TIENDA.whatsapp || "").replace(/\D/g, "");
    if (!num || num === NUMERO_EJEMPLO) return null;
    return `https://wa.me/${num}?text=${encodeURIComponent(mensaje)}`;
  }

  function abrirWhatsApp(mensaje) {
    const url = enlaceWhatsApp(mensaje);
    if (!url) {
      console.info("Mensaje que se enviaría por WhatsApp:\n" + mensaje);
      aviso("Falta configurar el número de WhatsApp en js/datos.js");
      return false;
    }
    window.open(url, "_blank", "noopener");
    return true;
  }

  // Texto con *cursivas*. Si animar = true, cada palabra entra con una animación.
  function textoConCursiva(nodo, texto, animar) {
    nodo.replaceChildren();
    let i = 0;
    String(texto).split("*").forEach((trozo, idx) => {
      if (!trozo) return;
      const destino = idx % 2 ? el("em") : nodo;
      if (animar) {
        for (const w of trozo.split(/(\s+)/)) {
          if (!w) continue;
          if (/^\s+$/.test(w)) destino.append(" ");
          else destino.append(el("span", { class: "palabra" }, el("span", { class: "palabra__in", style: `--i:${i++}` }, w)));
        }
      } else {
        destino.append(trozo);
      }
      if (destino !== nodo) nodo.append(destino);
    });
  }

  // ---------- láminas: composiciones geométricas cuando no hay foto ----------
  // Un producto puede elegir su forma con  forma: "hueso"  (si no, se asigna una por turno).

  const FORMAS = {
    arco: () => [
      svg("rect", { x: 0, y: 220, width: 400, height: 80, opacity: 0.18 }),
      svg("path", { d: "M140 228V128a60 60 0 0 1 120 0v100z", opacity: 0.6 }),
      svg("rect", { x: 260, y: 128, width: 22, height: 100, opacity: 0.28 }),
    ],
    sol: () => [
      svg("circle", { cx: 252, cy: 118, r: 56, opacity: 0.5 }),
      svg("rect", { x: 0, y: 190, width: 400, height: 110, opacity: 0.22 }),
      svg("rect", { x: 70, y: 146, width: 74, height: 44, opacity: 0.45 }),
    ],
    bloques: () => [
      svg("rect", { x: 0, y: 240, width: 400, height: 60, opacity: 0.15 }),
      svg("rect", { x: 110, y: 172, width: 180, height: 68, opacity: 0.5 }),
      svg("rect", { x: 150, y: 112, width: 130, height: 60, opacity: 0.32 }),
      svg("rect", { x: 190, y: 62, width: 60, height: 50, opacity: 0.62 }),
    ],
    escalera: () => [
      svg("path", { d: "M80 240h60v-40h60v-40h60v-40h60v120z", opacity: 0.5 }),
      svg("rect", { x: 0, y: 240, width: 400, height: 60, opacity: 0.18 }),
      svg("circle", { cx: 112, cy: 92, r: 22, opacity: 0.35 }),
    ],
    columnata: () => [
      svg("rect", { x: 0, y: 240, width: 400, height: 60, opacity: 0.15 }),
      svg("rect", { x: 70, y: 68, width: 260, height: 12, opacity: 0.6 }),
      ...[0, 1, 2, 3, 4].map((i) => svg("rect", { x: 92 + i * 48, y: 80, width: 20, height: 160, opacity: 0.25 + i * 0.08 })),
    ],
    cupula: () => [
      svg("rect", { x: 0, y: 230, width: 400, height: 70, opacity: 0.2 }),
      svg("path", { d: "M100 230a100 100 0 0 1 200 0z", opacity: 0.5 }),
      svg("rect", { x: 190, y: 58, width: 20, height: 72, opacity: 0.35 }),
    ],
    hueso: () => {
      const hueso = svg("g", { opacity: 0.58, transform: "rotate(-14 200 150)" });
      hueso.append(
        svg("rect", { x: 128, y: 136, width: 144, height: 30, rx: 8 }),
        svg("circle", { cx: 126, cy: 132, r: 24 }), svg("circle", { cx: 126, cy: 170, r: 24 }),
        svg("circle", { cx: 274, cy: 132, r: 24 }), svg("circle", { cx: 274, cy: 170, r: 24 }));
      return [svg("rect", { x: 0, y: 228, width: 400, height: 72, opacity: 0.18 }), hueso];
    },
    patita: () => [
      svg("rect", { x: 0, y: 236, width: 400, height: 64, opacity: 0.18 }),
      svg("ellipse", { cx: 200, cy: 172, rx: 50, ry: 40, opacity: 0.58 }),
      svg("ellipse", { cx: 136, cy: 116, rx: 19, ry: 24, opacity: 0.5, transform: "rotate(-20 136 116)" }),
      svg("ellipse", { cx: 178, cy: 86, rx: 19, ry: 25, opacity: 0.5 }),
      svg("ellipse", { cx: 222, cy: 86, rx: 19, ry: 25, opacity: 0.5 }),
      svg("ellipse", { cx: 264, cy: 116, rx: 19, ry: 24, opacity: 0.5, transform: "rotate(20 264 116)" }),
    ],
  };
  const TURNO = ["arco", "sol", "bloques", "escalera", "columnata", "cupula"];

  function lamina(p) {
    const caja = el("div", { class: "lamina", style: `--tono:${tonoSeguro(p.tono)}` });
    const dibujo = () => {
      const s = svg("svg", { viewBox: "0 0 400 300", preserveAspectRatio: "xMidYMid slice", "aria-hidden": "true" });
      const g = svg("g", { fill: "currentColor" });
      const forma = FORMAS[p.forma] || FORMAS[TURNO[(p.numero - 1) % TURNO.length]];
      for (const n of forma()) g.append(n);
      s.append(g);
      return s;
    };
    if (p.imagen) {
      const img = el("img", { src: p.imagen, alt: p.nombre, loading: "lazy" });
      img.addEventListener("error", () => img.replaceWith(dibujo())); // foto rota → composición
      caja.append(img);
    } else {
      caja.append(dibujo());
    }
    return caja;
  }

  // ---------- animación al hacer scroll ----------

  const observador = "IntersectionObserver" in window && !sinMovimiento
    ? new IntersectionObserver((entradas) => {
        for (const e of entradas) if (e.isIntersecting) { e.target.classList.add("visible"); observador.unobserve(e.target); }
      }, { rootMargin: "0px 0px -6% 0px" })
    : null;

  function revelar(nodos) {
    for (const n of nodos) {
      n.classList.add("revelar");
      if (observador) observador.observe(n);
      else n.classList.add("visible");
    }
  }

  // ---------- secciones fijas ----------

  function pintarDatosTienda() {
    document.title = TIENDA.nombre;
    $("marca").textContent = TIENDA.nombre;
    textoConCursiva($("titular"), TIENDA.titular, !sinMovimiento);
    $("bajada").textContent = TIENDA.bajada;
    $("hero-ciudad").textContent = TIENDA.ciudad || "";
    $("hero-envio").textContent = TIENDA.envio || "";
    if (TIENDA.etiquetaInicio) $("hero-etiqueta").textContent = TIENDA.etiquetaInicio;

    // Producto destacado en la portada: el indicado en TIENDA.destacado, o el primero con stock
    const destacado = porId.get(TIENDA.destacado) || productos.find((p) => p.stock !== false) || productos[0];
    if (destacado) {
      $("hero-figura").replaceChildren(
        lamina(destacado),
        el("figcaption", { class: "etiqueta-texto" },
          el("span", {}, `${numero(destacado)} — ${destacado.nombre}`),
          el("span", {}, precioTexto(destacado)))
      );
    }

    // Cinta en movimiento (se duplica para que el loop no tenga cortes)
    const frases = TIENDA.cinta || [];
    $("cinta").parentElement.hidden = frases.length === 0;
    const grupo = () => el("div", { class: "cinta__grupo" },
      ...frases.flatMap((t) => [el("span", {}, t), el("span", { class: "cinta__sep" }, "✳")]));
    $("cinta").replaceChildren(grupo(), grupo());

    // Nosotros (se oculta si no hay datos)
    const hayNosotros = typeof NOSOTROS !== "undefined" && NOSOTROS && NOSOTROS.frase;
    $("nosotros").hidden = !hayNosotros;
    if (hayNosotros) {
      textoConCursiva($("nosotros-frase"), NOSOTROS.frase, false);
      $("valores").replaceChildren(...(NOSOTROS.valores || []).map((v, i) =>
        el("li", { class: "valor" },
          el("span", { class: "etiqueta-texto" }, String(i + 1).padStart(2, "0")),
          el("h3", { class: "valor__titulo" }, v.titulo),
          el("p", {}, v.texto))
      ));
    }

    // Preguntas frecuentes: solo las que tienen respuesta publicada (no las "derivar")
    const conRespuesta = (typeof PREGUNTAS !== "undefined" ? PREGUNTAS : []).filter((q) => !q.derivar);
    $("acordeon").replaceChildren(...conRespuesta.map((q, i) =>
      el("details", { class: "pregunta" },
        el("summary", {},
          el("span", { class: "etiqueta-texto" }, String(i + 1).padStart(2, "0")),
          el("span", { class: "pregunta__texto" }, q.pregunta),
          el("span", { class: "pregunta__icono", "aria-hidden": "true" }, "+")),
        el("p", { class: "pregunta__respuesta" }, q.respuesta))
    ));

    $("pie-ciudad").textContent = TIENDA.ciudad || "";
    $("pie-correo").hidden = !TIENDA.correo;
    if (TIENDA.correo) {
      $("pie-correo").textContent = TIENDA.correo;
      $("pie-correo").href = "mailto:" + TIENDA.correo;
    }
    $("pie-descripcion").textContent = TIENDA.descripcionPie || "";
    $("pie-marca").textContent = TIENDA.nombre;
    $("pie-nombre").textContent = TIENDA.nombre;
    $("anio").textContent = new Date().getFullYear();

    revelar(document.querySelectorAll(".seccion__cabecera, .declaracion, .valor, .pregunta, .hero__figura, .pie__marca"));
  }

  // ---------- catálogo ----------

  function pintarFiltros() {
    const categorias = ["Todas", ...new Set(productos.map((p) => p.categoria))];
    $("filtros").hidden = categorias.length <= 2; // con una sola categoría no hace falta filtrar
    $("filtros").replaceChildren(...categorias.map((c) => {
      const cantidad = c === "Todas" ? productos.length : productos.filter((p) => p.categoria === c).length;
      return el("button", {
        type: "button",
        class: "filtro",
        "aria-pressed": String(c === categoria),
        onclick: () => { categoria = c; pintarFiltros(); pintarProductos(); },
      }, c, el("sup", {}, String(cantidad)));
    }));
  }

  // Botones de tamaño/peso. Llama alCambiar(opción) cuando se elige otra.
  // Primer tamaño con unidades (el que aparece elegido al cargar)
  const primeraDisponible = (p) => p.opciones.find((o) => !o.agotado) || p.opciones[0];

  function selectorOpciones(p, alCambiar) {
    if (!p.opciones[0].nombre) return null;
    const grupo = el("div", { class: "opciones-producto", role: "group", "aria-label": `Opciones de ${p.nombre}` });
    const inicial = primeraDisponible(p);
    p.opciones.forEach((o) => {
      grupo.append(el("button", {
        type: "button",
        class: "opcion-producto" + (o.agotado ? " opcion-producto--agotada" : ""),
        "aria-pressed": String(o === inicial),
        "aria-label": o.agotado ? `${o.nombre} (agotado)` : null,
        onclick: (e) => {
          for (const b of grupo.children) b.setAttribute("aria-pressed", String(b === e.currentTarget));
          alCambiar(o);
        },
      }, o.nombre));
    });
    return grupo;
  }

  // Devuelve el botón y una función para actualizarlo cuando se elige otro tamaño.
  function botonAgregar(p, corto, opcionElegida) {
    const boton = el("button", { type: "button", class: "enlace", onclick: () => agregar(p.id, opcionElegida().nombre) });
    const actualizar = () => {
      const agotado = p.stock === false || opcionElegida().agotado;
      boton.disabled = agotado;
      boton.setAttribute("aria-label", agotado ? `${p.nombre} agotado` : `Agregar ${p.nombre} al carrito`);
      boton.textContent = agotado ? "Agotado" : corto ? "Agregar +" : "Agregar al carrito +";
    };
    actualizar();
    return [boton, actualizar];
  }

  function tarjeta(p) {
    const agotado = p.stock === false;
    let elegida = primeraDisponible(p);
    const precio = el("span", { class: "producto__precio" }, dinero.format(elegida.precio));
    const [boton, actualizarBoton] = botonAgregar(p, false, () => elegida);
    const selector = selectorOpciones(p, (o) => { elegida = o; precio.textContent = dinero.format(o.precio); actualizarBoton(); });
    // Si el producto tiene ficha propia ("pagina" en productos.json), la foto y el nombre llevan a ella
    const marco = p.pagina
      ? el("a", { class: "producto__marco producto__marco--enlace", href: p.pagina, "aria-label": `Ver ${p.nombre} en detalle` },
          lamina(p), el("span", { class: "sello sello--ver" }, "Ver en 3D"), agotado ? el("span", { class: "sello" }, "Agotado") : null)
      : el("div", { class: "producto__marco" }, lamina(p), agotado ? el("span", { class: "sello" }, "Agotado") : null);
    return el("article", { class: "producto" + (agotado ? " producto--agotado" : "") },
      marco,
      el("div", { class: "producto__fila" },
        el("span", { class: "etiqueta-texto" }, numero(p)),
        el("h3", { class: "producto__nombre" }, p.pagina ? el("a", { href: p.pagina, class: "producto__enlace" }, p.nombre) : p.nombre),
        precio),
      el("p", { class: "producto__desc" }, p.descripcion || ""),
      el("div", { class: "producto__fila producto__fila--sec" },
        selector || el("span"),
        boton)
    );
  }

  function fila(p) {
    let elegida = primeraDisponible(p);
    const precio = el("span", { class: "fila__precio" }, dinero.format(elegida.precio));
    const [boton, actualizarBoton] = botonAgregar(p, true, () => elegida);
    const selector = selectorOpciones(p, (o) => { elegida = o; precio.textContent = dinero.format(o.precio); actualizarBoton(); });
    return el("div", { class: "fila" + (p.stock === false ? " producto--agotado" : "") },
      el("span", { class: "etiqueta-texto fila__num" }, numero(p)),
      p.pagina ? el("a", { class: "fila__miniatura", href: p.pagina, "aria-label": `Ver ${p.nombre} en detalle` }, lamina(p)) : el("div", { class: "fila__miniatura" }, lamina(p)),
      el("h3", { class: "fila__nombre" }, p.pagina ? el("a", { href: p.pagina, class: "producto__enlace" }, p.nombre) : p.nombre),
      el("div", { class: "fila__opciones" }, selector),
      precio,
      boton);
  }

  function pintarProductos() {
    const q = normalizar(busqueda.trim());
    const visibles = productos.filter((p) =>
      (categoria === "Todas" || p.categoria === categoria) &&
      (!q || normalizar(`${p.nombre} ${p.descripcion} ${p.categoria}`).includes(q))
    );
    const caja = $("productos");
    caja.dataset.vista = vista;
    const nodos = visibles.map(vista === "indice" ? fila : tarjeta);
    caja.replaceChildren(...nodos);
    nodos.forEach((n, i) => n.style.setProperty("--d", `${(i % 3) * 90}ms`));
    revelar(nodos);
    $("sin-resultados").hidden = visibles.length > 0;
    $("conteo").textContent = `(${String(visibles.length).padStart(2, "0")})`;
  }

  function cambiarVista(nueva) {
    vista = nueva;
    escribir(CLAVE_VISTA, nueva);
    $("vista-grilla").setAttribute("aria-pressed", String(nueva === "grilla"));
    $("vista-indice").setAttribute("aria-pressed", String(nueva === "indice"));
    pintarProductos();
  }

  // ---------- carrito ----------

  function agregar(id, opcion) {
    const p = porId.get(id);
    if (!p || p.stock === false) return false;
    const o = p.opciones.find((x) => x.nombre === opcion) || primeraDisponible(p);
    if (o.agotado) { aviso(`${nombreLinea(p, o)} está agotado`); return false; }
    const k = claveLinea(id, o.nombre);
    if ((carrito[k] || 0) >= MAX_CANTIDAD) { aviso(`Máximo ${MAX_CANTIDAD} unidades`); return false; }
    carrito[k] = (carrito[k] || 0) + 1;
    guardarCarrito();
    pintarCarrito();
    aviso(`${nombreLinea(p, o)} agregado al carrito`);
    const c = $("contador");
    c.classList.remove("salto"); void c.offsetWidth; c.classList.add("salto");
    return true;
  }

  function cambiar(k, delta) {
    const n = (carrito[k] || 0) + delta;
    if (n <= 0) delete carrito[k];
    else carrito[k] = Math.min(n, MAX_CANTIDAD);
    guardarCarrito();
    pintarCarrito();
  }

  function pintarEnvioGratis(total, unidades) {
    const caja = $("envio-gratis");
    const meta = Number(TIENDA.envioGratisDesde) || 0;
    caja.hidden = !meta || unidades === 0;
    if (caja.hidden) return;
    const falta = meta - total;
    $("envio-gratis-texto").textContent = falta > 0
      ? `Te faltan ${dinero.format(falta)} para el envío gratis`
      : "¡Tu pedido tiene envío gratis!";
    $("envio-gratis-barra").style.width = `${Math.min(100, (total / meta) * 100)}%`;
    caja.classList.toggle("logrado", falta <= 0);
  }

  function pintarCarrito() {
    const claves = Object.keys(carrito);
    const lista = $("items");
    if (claves.length === 0) {
      lista.replaceChildren(el("p", { class: "carrito__vacio" }, "Tu carrito está vacío."));
    } else {
      lista.replaceChildren(...claves.map((k) => {
        const { p, o } = linea(k), n = carrito[k];
        return el("div", { class: "item" },
          el("div", { class: "item__miniatura" }, lamina(p)),
          el("div", { class: "item__info" },
            el("p", { class: "item__nombre" }, p.nombre),
            el("p", { class: "etiqueta-texto" }, `${o.nombre ? o.nombre + " · " : ""}${dinero.format(o.precio)} c/u`)),
          el("div", { class: "cantidad" },
            el("button", { type: "button", class: "btn-icono", "aria-label": `Quitar uno de ${nombreLinea(p, o)}`, onclick: () => cambiar(k, -1) }, "−"),
            el("span", { "aria-label": `Cantidad ${n}` }, String(n)),
            el("button", { type: "button", class: "btn-icono", "aria-label": `Agregar uno de ${nombreLinea(p, o)}`, onclick: () => cambiar(k, 1) }, "+")));
      }));
    }
    const { total, unidades } = totalCarrito();
    $("total").textContent = dinero.format(total);
    $("contador").textContent = unidades;
    $("pedir").disabled = unidades === 0;
    $("vaciar").hidden = unidades === 0;
    pintarEnvioGratis(total, unidades);
  }

  function abrirCarrito() {
    document.dispatchEvent(new CustomEvent("tienda:abre-carrito"));
    ultimoFoco = document.activeElement;
    const panel = $("carrito");
    panel.inert = false;
    panel.classList.add("abierto");
    $("fondo").hidden = false;
    document.body.classList.add("sin-scroll");
    $("cerrar-carrito").focus();
  }

  function cerrarCarrito() {
    const panel = $("carrito");
    panel.classList.remove("abierto");
    panel.inert = true;
    $("fondo").hidden = true;
    document.body.classList.remove("sin-scroll");
    if (ultimoFoco) ultimoFoco.focus();
  }

  function pedir() {
    if (totalCarrito().unidades === 0) return;
    const nombre = $("cliente-nombre").value.trim();
    const notas = $("cliente-notas").value.trim();
    const mensaje = [
      `¡Hola! Quiero hacer este pedido en ${TIENDA.nombre}:`,
      "",
      ...resumenCarrito(),
      "",
      `Total: ${dinero.format(totalCarrito().total)}`,
      nombre ? `Nombre: ${nombre}` : null,
      notas ? `Notas: ${notas}` : null,
    ].filter((l) => l !== null).join("\n");
    abrirWhatsApp(mensaje);
  }

  // ---------- inicio ----------

  pintarDatosTienda();
  pintarFiltros();
  cambiarVista(vista);
  pintarCarrito();

  $("buscar").addEventListener("input", (e) => { busqueda = e.target.value; pintarProductos(); });
  $("vista-grilla").addEventListener("click", () => cambiarVista("grilla"));
  $("vista-indice").addEventListener("click", () => cambiarVista("indice"));
  $("abrir-carrito").addEventListener("click", abrirCarrito);
  $("cerrar-carrito").addEventListener("click", cerrarCarrito);
  $("fondo").addEventListener("click", cerrarCarrito);
  $("pedir").addEventListener("click", pedir);
  $("vaciar").addEventListener("click", () => { carrito = {}; guardarCarrito(); pintarCarrito(); });
  $("pie-whatsapp").addEventListener("click", () => abrirWhatsApp(`Hola, tengo una consulta sobre ${TIENDA.nombre}.`));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && $("carrito").classList.contains("abierto")) cerrarCarrito();
  });
  // Desde la ficha de un producto: /#carrito abre el carrito al llegar
  const abrirSiPide = () => { if (location.hash === "#carrito") { pintarCarrito(); abrirCarrito(); } };
  window.addEventListener("hashchange", abrirSiPide);
  abrirSiPide();
  const cabecera = $("cabecera");
  const marcarScroll = () => cabecera.classList.toggle("con-borde", window.scrollY > 8);
  window.addEventListener("scroll", marcarScroll, { passive: true });
  marcarScroll();

  // Para el pago en línea (js/compra.js): líneas del carrito como { id, opcion, cantidad, nombre, precio }
  function carritoItems() {
    return Object.entries(carrito).map(([k, n]) => {
      const { p, o } = linea(k);
      return { id: p.id, opcion: o.nombre, cantidad: n, nombre: nombreLinea(p, o), precio: o.precio, producto: p };
    });
  }
  function vaciarCarrito() { carrito = {}; guardarCarrito(); pintarCarrito(); }

  // Funciones que usan el asistente (js/asistente.js) y el pago (js/compra.js)
  window.Tienda = {
    productos, porId, dinero, normalizar, numero, precioTexto, lamina, el,
    agregar, abrirCarrito, cerrarCarrito, aviso, resumenCarrito, enlaceWhatsApp, abrirWhatsApp,
    carritoItems, totalCarrito, vaciarCarrito,
  };
})();
