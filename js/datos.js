// =====================================================================
//  TEXTOS DE MI LEGADO — lo editable de la página.
//  Los PRODUCTOS y precios están en datos/productos.json (los usa también el servidor para cobrar).
//  Fuente: milegadosnack.cl (revisado el 10-11-2026). No hay datos inventados:
//  lo que la tienda no publica se dejó vacío o el asistente lo deriva a una persona.
// =====================================================================

const TIENDA = {
  nombre: "Mi Legado",
  etiquetaInicio: "Snacks para perros",
  // Lo que va entre *asteriscos* se muestra en cursiva y color.
  titular: "Un legado de *cariño* para tu perro",
  bajada: "Snacks y masticables naturales para perros: un solo ingrediente, sin rellenos. Premios de verdad para tu mejor amigo de cuatro patas.",
  descripcionPie: "Snacks naturales para perros y gatos, hechos con cariño en Chile. Premios que se ganan con cada colita feliz.",

  // WhatsApp para pedidos: +56 9 8310 8524.
  // Con código de país (56), sin "+" ni espacios. Cámbialo aquí si los pedidos van a otro número.
  whatsapp: "56983108524",
  correo: "correo@milegadosnack.cl", // ⚠️ revisar: es el que aparece en la página de contacto
  ciudad: "Hecho en Chile",
  envio: "Envío gratis sobre $30.000",
  envioGratisDesde: 30000, // el carrito muestra cuánto falta para el envío gratis
  moneda: "CLP",
  locale: "es-CL",
  destacado: "patitas-de-pollo", // producto que se muestra grande en la portada
  cinta: ["Snacks naturales para perros", "Envío gratis sobre $30.000", "Un solo ingrediente", "Hecho en Chile", "Despacho en 24-48 horas"],
};

const NOSOTROS = {
  frase: "Snacks para perros elaborados con *ingredientes reales* y sin rellenos.",
  valores: [
    { titulo: "Envío gratis", texto: "En pedidos sobre $30.000." },
    { titulo: "100% natural", texto: "Sin aditivos ni rellenos." },
    { titulo: "Despacho rápido", texto: "Listo en 24-48 horas hábiles." },
    { titulo: "Hecho en Chile", texto: "Producción artesanal y local." },
  ],
};

// ---------------------------------------------------------------------
//  ASISTENTE — solo responde con información publicada por la tienda.
//  derivar: true = la tienda no ha publicado esa información, así que el bot
//  NO responde por su cuenta: pasa la consulta a una persona por WhatsApp.
//  Cuando el negocio defina esos datos, se escribe la respuesta y se quita "derivar".
// ---------------------------------------------------------------------
const PREGUNTAS = [
  {
    pregunta: "¿Cómo compro?",
    respuesta: "Elige el snack y su tamaño, agrégalo al carrito y presiona «Ir a pagar». Completas tus datos, eliges cómo pagar y listo: te llega la confirmación a tu correo.",
    palabras: ["comprar", "compro", "como pido", "pedido", "pedir", "carrito", "ordenar", "encargar"],
  },
  {
    pregunta: "¿Cómo puedo pagar?",
    respuesta: "Pagas en línea al finalizar la compra. Los medios disponibles aparecen en el paso de pago.",
    palabras: ["pago", "pagar", "tarjeta", "debito", "credito", "webpay", "mach", "mercado pago", "medios de pago"],
  },
  {
    pregunta: "¿Necesito crear una cuenta?",
    respuesta: "No es obligatorio: puedes comprar como invitado. Si creas una cuenta con tu correo y una contraseña en «Entrar», guardamos tus datos para que tu próxima compra sea más rápida y puedas ver tus pedidos.",
    palabras: ["cuenta", "registrarme", "registro", "crear cuenta", "iniciar sesion", "mis pedidos", "usuario"],
  },
  {
    pregunta: "¿Cuánto cuesta el envío?",
    respuesta: "El envío es gratis en pedidos sobre $30.000.",
    palabras: ["envio", "envios", "costo de envio", "gratis", "delivery", "valor del envio"],
  },
  {
    pregunta: "¿Cuánto demora el despacho?",
    respuesta: "Los pedidos quedan listos para despacho en 24 a 48 horas hábiles.",
    palabras: ["despacho", "demora", "llega", "tarda", "cuando llega", "plazo", "dias"],
  },
  {
    pregunta: "¿Son naturales? ¿Tienen aditivos?",
    respuesta: "Sí. Son snacks 100% naturales, sin aditivos ni rellenos.",
    palabras: ["natural", "naturales", "aditivo", "aditivos", "conservante", "conservantes", "quimico", "relleno", "ingrediente", "ingredientes", "sano", "saludable"],
  },
  {
    pregunta: "¿Dónde se elaboran?",
    respuesta: "En Chile, con producción artesanal y local.",
    palabras: ["chile", "chilenos", "elaboran", "fabrican", "hacen", "artesanal", "origen", "hecho"],
  },
  {
    pregunta: "¿Qué tamaño elijo?",
    respuesta: "El Fémur Natural viene en tamaño Pequeño y Grande, según el porte de tu mascota. Los demás snacks vienen por peso: 80g, 100g o 200g, según el producto.",
    palabras: ["tamano", "porte", "grande", "pequeno", "chico", "raza", "peso", "gramos", "cual elijo"],
  },
  {
    pregunta: "¿En cuánto tiempo responden?",
    respuesta: "Respondemos por WhatsApp o correo en menos de 24 horas.",
    palabras: ["responden", "contacto", "contactar", "correo", "mail", "escribirles", "atencion"],
  },

  // --- Información que la tienda aún no publica: el bot deriva a una persona ---
  {
    derivar: true,
    pregunta: "¿Puedo cambiar o devolver un producto?",
    respuesta: "Para cambios o devoluciones, te comunico con el equipo para que revise tu caso.",
    palabras: ["cambio", "cambiar", "devolucion", "devolver", "reembolso", "garantia", "malo", "mal estado"],
  },
  {
    derivar: true,
    pregunta: "¿Tienen snacks para gatos?",
    respuesta: "Por ahora los snacks del catálogo son para perros. Para consultas sobre gatos, te comunico con el equipo.",
    palabras: ["gato", "gatos", "gatito", "felino", "michi"],
  },
  {
    derivar: true,
    pregunta: "¿Puedo retirar en persona?",
    respuesta: "Para retiros o direcciones, te comunico con el equipo.",
    palabras: ["retiro", "retirar", "direccion", "donde estan", "local", "tienda fisica", "ubicacion"],
  },
  {
    derivar: true,
    pregunta: "¿Venden al por mayor?",
    respuesta: "Para ventas por mayor, te comunico con el equipo.",
    palabras: ["mayor", "mayorista", "por mayor", "distribuir", "revender", "cantidad grande"],
  },
];

const ASISTENTE = {
  nombre: "Asistente Mi Legado",
  saludo: "¡Hola! Soy el asistente de Mi Legado. Puedo contarte sobre nuestros snacks, envíos, pagos y despacho, o ayudarte a elegir un producto. ¿En qué te ayudo?",
  palabrasHumano: ["persona", "humano", "hablar con alguien", "reclamo", "queja", "no me llego", "no ha llegado", "estado de mi pedido", "urgente", "alergia", "enfermo", "veterinario"],
  intentosAntesDeDerivar: 2,
};
