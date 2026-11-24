// Pago en línea y "Mi cuenta". Habla con el servidor (servidor/servidor.py).
// Los precios que se cobran los calcula SIEMPRE el servidor; aquí solo se muestran.
(function () {
  "use strict";
  const T = window.Tienda;
  if (!T) return;
  const { el } = T;
  const $ = (id) => document.getElementById(id);

  const REGIONES = [
    "Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo", "Valparaíso",
    "Metropolitana de Santiago", "Libertador General Bernardo O'Higgins", "Maule", "Ñuble", "Biobío",
    "La Araucanía", "Los Ríos", "Los Lagos", "Aysén del General Carlos Ibáñez del Campo",
    "Magallanes y de la Antártica Chilena",
  ];
  const ONLINE = new Set(["flow", "mercadopago"]);

  let config = null;
  let cuenta = null;
  let esAdmin = false;
  let panelAbierto = null;
  let ultimoFoco = null;
  let modo = "entrar"; // sin sesión: entrar | crear | recuperar | restablecer
  let emailRecuperar = "";
  let volverAPago = false;

  // ---------------------------------------------------------- utilidades

  async function api(ruta, { metodo = "GET", cuerpo } = {}) {
    let r;
    try {
      r = await fetch(ruta, {
        method: metodo,
        headers: cuerpo ? { "Content-Type": "application/json" } : {},
        body: cuerpo ? JSON.stringify(cuerpo) : undefined,
        credentials: "same-origin",
      });
    } catch {
      throw new Error("No hay conexión. Revisa tu internet e intenta de nuevo.");
    }
    let datos = {};
    try { datos = await r.json(); } catch { /* respuesta vacía */ }
    if (!r.ok) {
      const error = new Error(datos.error || "Ocurrió un error. Intenta de nuevo.");
      error.estado = r.status;
      throw error;
    }
    return datos;
  }

  function error(id, mensaje) {
    const p = $(id);
    p.textContent = mensaje || "";
    p.hidden = !mensaje;
  }

  function llenarRegiones(select) {
    select.replaceChildren(el("option", { value: "" }, "Elige…"), ...REGIONES.map((r) => el("option", { value: r }, r)));
  }

  const fecha = (s) => new Date(s * 1000).toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" });

  // ---------------------------------------------------------- paneles

  function abrirPanel(id) {
    if (panelAbierto && panelAbierto !== id) cerrarPanel(false);
    if ($("carrito").classList.contains("abierto")) T.cerrarCarrito();
    if (!panelAbierto) ultimoFoco = document.activeElement;
    const panel = $(id);
    panel.inert = false;
    panel.classList.add("abierto");
    $("fondo-compra").hidden = false;
    document.body.classList.add("sin-scroll");
    panelAbierto = id;
    setTimeout(() => {
      const primero = panel.querySelector(".panel__cuerpo input:not([type=hidden]):not([disabled]), .panel__cuerpo button");
      (primero || panel.querySelector("[data-cerrar]")).focus();
    }, 80);
  }

  function cerrarPanel(devolverFoco = true) {
    if (!panelAbierto) return;
    const panel = $(panelAbierto);
    panel.classList.remove("abierto");
    panel.inert = true;
    $("fondo-compra").hidden = true;
    document.body.classList.remove("sin-scroll");
    panelAbierto = null;
    if (devolverFoco && ultimoFoco) ultimoFoco.focus();
  }

  // ---------------------------------------------------------- pago

  async function cargarConfig() {
    if (!config) config = await api("/api/config");
    return config;
  }

  async function abrirPago() {
    if (!T.carritoItems().length) return T.aviso("Tu carrito está vacío");
    try {
      await cargarConfig();
    } catch (e) {
      return T.aviso(e.message);
    }
    if (!config.metodos.length) return T.aviso("El pago en línea aún no está disponible. Puedes pedir por WhatsApp.");
    prepararPago();
    abrirPanel("pago");
  }

  function prepararPago() {
    const f = $("form-pago");
    if (cuenta) {
      if (!f.elements.email.value) f.elements.email.value = cuenta.email;
      for (const k of ["nombre", "telefono", "direccion", "comuna", "region"]) {
        if (!f.elements[k].value && cuenta[k]) f.elements[k].value = cuenta[k];
      }
    }
    $("guardar-datos-caja").hidden = !cuenta;
    const sesion = $("pago-sesion");
    if (cuenta) {
      sesion.replaceChildren("Comprando como ", el("b", {}, cuenta.email));
    } else {
      sesion.replaceChildren("¿Ya compraste antes? ",
        el("button", { type: "button", class: "enlace", onclick: () => { volverAPago = true; abrirCuenta(); } }, "Entra a tu cuenta"),
        " y completamos tus datos.");
    }
    $("aviso-pruebas").hidden = !config.metodos.some((m) => m.simulado);
    pintarMetodos();
    actualizarResumen();
  }

  function metodoElegido() {
    const marcado = $("metodos").querySelector("input[name=metodo]:checked");
    return marcado ? marcado.value : "";
  }

  function pintarMetodos() {
    const actual = metodoElegido() || config.metodos[0].id;
    $("metodos").replaceChildren(...config.metodos.map((m) =>
      el("label", { class: "metodo" },
        el("input", { type: "radio", name: "metodo", value: m.id, checked: m.id === actual, onchange: actualizarResumen }),
        el("span", { class: "metodo__texto" },
          el("strong", {}, m.nombre),
          el("small", {}, m.descripcion)))
    ));
  }

  // Misma regla que el servidor (solo para mostrar; el cobro lo calcula el servidor)
  function despacho(subtotal, retiro) {
    const d = config.despacho;
    if (retiro) return { monto: 0, texto: "Retiro" };
    if (d.gratis_desde && subtotal >= d.gratis_desde) return { monto: 0, texto: "Gratis" };
    if (d.costo == null) return { monto: 0, texto: "Por coordinar" };
    return { monto: d.costo, texto: T.dinero.format(d.costo) };
  }

  function actualizarResumen() {
    const metodo = metodoElegido();
    const retiro = metodo === "efectivo";
    // Si retira, no se pide dirección
    $("grupo-despacho").hidden = retiro;
    for (const campo of $("grupo-despacho").querySelectorAll("input, select")) campo.disabled = retiro;

    const items = T.carritoItems();
    const subtotal = T.totalCarrito().total;
    const d = despacho(subtotal, retiro);
    const total = subtotal + d.monto;
    const fila = (a, b, clase) => el("div", { class: "resumen__fila" + (clase ? " " + clase : "") }, el("span", {}, a), el("span", {}, b));
    $("resumen").replaceChildren(
      ...items.map((i) => fila(`${i.cantidad} × ${i.nombre}`, T.dinero.format(i.precio * i.cantidad))),
      fila("Subtotal", T.dinero.format(subtotal), "resumen__fila--linea"),
      fila("Despacho", d.texto),
      fila("Total", T.dinero.format(total), "resumen__fila--total"),
      d.texto === "Por coordinar"
        ? el("p", { class: "resumen__nota" }, "El costo del despacho se coordina después de la compra.")
        : null,
    );
    $("boton-pagar").textContent = ONLINE.has(metodo) ? `Pagar ${T.dinero.format(total)}` : "Confirmar pedido";
  }

  async function enviarPago(e) {
    e.preventDefault();
    error("error-pago", "");
    const f = $("form-pago");
    if (!f.checkValidity()) {
      f.reportValidity();
      return;
    }
    const metodo = metodoElegido();
    if (!metodo) return error("error-pago", "Elige cómo quieres pagar.");
    const items = T.carritoItems();
    if (!items.length) return error("error-pago", "Tu carrito está vacío.");

    const boton = $("boton-pagar");
    boton.disabled = true;
    boton.textContent = ONLINE.has(metodo) ? "Conectando con el medio de pago…" : "Enviando pedido…";
    const v = (k) => (f.elements[k].disabled ? "" : f.elements[k].value);
    try {
      const r = await api("/api/pedidos", {
        metodo: "POST",
        cuerpo: {
          items: items.map(({ id, opcion, cantidad }) => ({ id, opcion, cantidad })),
          cliente: {
            nombre: v("nombre"), email: v("email"), telefono: v("telefono"),
            direccion: v("direccion"), comuna: v("comuna"), region: v("region"),
          },
          notas: v("notas"),
          metodo,
          guardarDatos: Boolean(cuenta && f.elements.guardarDatos.checked),
        },
      });
      T.vaciarCarrito();
      window.location.href = r.redirigir || `/pedido.html?codigo=${encodeURIComponent(r.codigo)}`;
    } catch (err) {
      error("error-pago", err.message);
      boton.disabled = false;
      actualizarResumen();
    }
  }

  // ---------------------------------------------------------- cuenta

  async function cargarCuenta() {
    try {
      const r = await api("/api/cuenta");
      cuenta = r.cuenta;
      esAdmin = r.admin;
    } catch {
      cuenta = null;
      esAdmin = false;
    }
    pintarBotonCuenta();
  }

  function pintarBotonCuenta() {
    const nombre = cuenta && cuenta.nombre ? cuenta.nombre.split(" ")[0] : "";
    $("abrir-cuenta").textContent = cuenta ? (nombre ? `Hola, ${nombre}` : "Mi cuenta") : "Entrar";
  }

  function abrirCuenta() {
    error("error-cuenta", "");
    mostrarVistaCuenta();
    abrirPanel("cuenta");
  }

  function mostrarVistaCuenta() {
    for (const f of document.querySelectorAll("#cuenta form[data-modo]")) f.hidden = Boolean(cuenta) || f.dataset.modo !== modo;
    $("vista-cuenta").hidden = !cuenta;
    if (!cuenta) return;
    $("cuenta-email").textContent = cuenta.email;
    const f = $("form-perfil");
    for (const k of ["nombre", "telefono", "direccion", "comuna", "region"]) f.elements[k].value = cuenta[k] || "";
    $("ir-admin").hidden = !esAdmin;
    cargarMisPedidos();
  }

  async function cargarMisPedidos() {
    const caja = $("mis-pedidos");
    caja.replaceChildren(el("p", { class: "etiqueta-texto" }, "Cargando…"));
    try {
      const { pedidos } = await api("/api/cuenta/pedidos");
      caja.replaceChildren(...(pedidos.length ? pedidos.map((p) =>
        el("a", { class: "mi-pedido", href: `/pedido.html?codigo=${encodeURIComponent(p.codigo)}` },
          el("span", {}, el("strong", {}, p.codigo), el("small", {}, fecha(p.creado))),
          el("span", { class: `estado estado--${p.estado}` }, p.estado_texto),
          el("strong", {}, T.dinero.format(p.total)))
      ) : [el("p", { class: "etiqueta-texto" }, "Aún no tienes pedidos.")]));
    } catch (e) {
      caja.replaceChildren(el("p", { class: "etiqueta-texto" }, e.message));
    }
  }

  function irA(nuevo) {
    // Lleva el correo escrito de un formulario al otro, para no tener que escribirlo de nuevo
    const escrito = document.querySelector(`#cuenta form[data-modo="${modo}"] [name=email]`);
    modo = nuevo;
    error("error-cuenta", "");
    mostrarVistaCuenta();
    const destino = document.querySelector(`#cuenta form[data-modo="${nuevo}"]`);
    if (escrito && destino.elements.email && !destino.elements.email.value) destino.elements.email.value = escrito.value;
    const primero = [...destino.elements].find((x) => x.tagName === "INPUT" && !x.value);
    if (primero) primero.focus();
  }

  // Envía un formulario de la cuenta: valida, bloquea el botón mientras espera y muestra el error.
  function enviarCuenta(accion) {
    return async (e) => {
      e.preventDefault();
      error("error-cuenta", "");
      const f = e.target;
      if (!f.checkValidity()) return f.reportValidity();
      const v = (n) => (f.elements[n] ? f.elements[n].value : "");
      if (f.elements.clave2 && v("clave") !== v("clave2")) return error("error-cuenta", "Las contraseñas no coinciden.");
      if (f.elements.nueva2 && v("nueva") !== v("nueva2")) return error("error-cuenta", "Las contraseñas nuevas no coinciden.");
      const boton = f.querySelector("button[type=submit]");
      boton.disabled = true;
      try {
        await accion(f, v);
      } catch (err) {
        error("error-cuenta", err.message);
      } finally {
        boton.disabled = false;
      }
    };
  }

  function entraste(r, mensaje) {
    cuenta = r.cuenta;
    esAdmin = r.admin;
    modo = "entrar";
    for (const f of document.querySelectorAll("#cuenta form")) f.reset();
    pintarBotonCuenta();
    T.aviso(mensaje);
    if (volverAPago) {
      volverAPago = false;
      prepararPago();
      abrirPanel("pago");
    } else {
      mostrarVistaCuenta();
    }
  }

  const correoDe = (v) => v("email").trim().toLowerCase();

  const entrar = enviarCuenta(async (f, v) => {
    const r = await api("/api/cuenta/entrar", { metodo: "POST", cuerpo: { email: correoDe(v), clave: v("clave") } });
    entraste(r, "¡Listo, entraste a tu cuenta!");
  });

  const crear = enviarCuenta(async (f, v) => {
    const r = await api("/api/cuenta/registro", { metodo: "POST", cuerpo: { email: correoDe(v), clave: v("clave") } });
    entraste(r, "¡Cuenta creada!");
  });

  const recuperar = enviarCuenta(async (f, v) => {
    emailRecuperar = correoDe(v);
    await api("/api/cuenta/recuperar", { metodo: "POST", cuerpo: { email: emailRecuperar } });
    $("restablecer-texto").replaceChildren("Si ", el("b", {}, emailRecuperar),
      " tiene una cuenta, le enviamos un código. Revisa tu bandeja de entrada (y la carpeta de spam).");
    irA("restablecer");
  });

  const restablecer = enviarCuenta(async (f, v) => {
    const r = await api("/api/cuenta/restablecer", { metodo: "POST", cuerpo: { email: emailRecuperar, codigo: v("codigo"), clave: v("clave") } });
    entraste(r, "Contraseña nueva guardada");
  });

  const cambiarClave = enviarCuenta(async (f, v) => {
    await api("/api/cuenta/clave", { metodo: "POST", cuerpo: { actual: v("actual"), nueva: v("nueva") } });
    f.reset();
    f.closest("details").open = false;
    T.aviso("Contraseña cambiada. Se cerró la sesión en tus otros equipos.");
  });

  async function guardarPerfil(e) {
    e.preventDefault();
    error("error-cuenta", "");
    const f = e.target;
    const datos = Object.fromEntries(["nombre", "telefono", "direccion", "comuna", "region"].map((k) => [k, f.elements[k].value]));
    try {
      const r = await api("/api/cuenta", { metodo: "PUT", cuerpo: datos });
      cuenta = r.cuenta;
      pintarBotonCuenta();
      T.aviso("Datos guardados");
    } catch (err) {
      error("error-cuenta", err.message);
    }
  }

  async function salir() {
    try { await api("/api/cuenta/salir", { metodo: "POST", cuerpo: {} }); } catch { /* igual se cierra aquí */ }
    cuenta = null;
    esAdmin = false;
    $("form-pago").reset();
    pintarBotonCuenta();
    mostrarVistaCuenta();
    T.aviso("Cerraste sesión");
  }

  // ---------------------------------------------------------- inicio

  llenarRegiones($("region"));
  llenarRegiones($("region-perfil"));
  $("ir-a-pagar").addEventListener("click", abrirPago);
  $("abrir-cuenta").addEventListener("click", abrirCuenta);
  $("form-pago").addEventListener("submit", enviarPago);
  $("form-entrar").addEventListener("submit", entrar);
  $("form-crear").addEventListener("submit", crear);
  $("form-recuperar").addEventListener("submit", recuperar);
  $("form-restablecer").addEventListener("submit", restablecer);
  $("form-clave").addEventListener("submit", cambiarClave);
  for (const b of document.querySelectorAll("#cuenta [data-ir]")) b.addEventListener("click", () => irA(b.dataset.ir));
  $("form-perfil").addEventListener("submit", guardarPerfil);
  $("salir").addEventListener("click", salir);
  $("fondo-compra").addEventListener("click", () => cerrarPanel());
  for (const b of document.querySelectorAll("[data-cerrar]")) b.addEventListener("click", () => cerrarPanel());
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && panelAbierto) cerrarPanel(); });
  // Si el carrito cambia con el pago abierto (por ejemplo desde el asistente), se actualiza el resumen
  window.addEventListener("storage", () => { if (panelAbierto === "pago") actualizarResumen(); });
  cargarCuenta();
})();
