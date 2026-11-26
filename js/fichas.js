// Contenido de las fichas 3D de cada producto (ficha.html?p=ID).
// El ID es el mismo de datos/productos.json. Precios, tamaños y stock NO van aquí:
// salen de la tienda. Aquí van los textos, la nutrición y la imagen del producto.
//
// imagen.anclas: 4 puntos [x, y] sobre la foto (0 a 1, desde arriba a la izquierda)
// donde apuntan las fichas 1, 2, 3 y 4 cuando el producto queda en primer plano.

const FICHAS = {
  "cogotes-de-pollo": {
    titulo: "Cogotes de Pollo",
    descripcion: "Cogotes de pollo deshidratados a baja temperatura: colágeno natural, calcio, fósforo y 52 % de proteína.",
    imagen: { src: "img/cogotes/cogote-real.png", ancho: 1600, alto: 1338, anclas: [[.1, .12], [.62, .3], [.33, .72], [.86, .8]] },
    ventana: "img/cogotes/ventana.jpg",
    foto: "img/cogotes/foto.jpg",
    etiqueta: { lineas: ["Cogote de pollo", "deshidratado"], ingrediente: "Ingrediente único: cogote de pollo deshidratado", sello: "PESO NETO 100 g" },
    portada: { eyebrow: "Snack natural para perros", titulo: "Lo natural se hereda. Cogote de pollo deshidratado: el premio crujiente que tu perro va a amar." },
    abre: { eyebrow: "Ábrela", titulo: "Huele a premio.", texto: "Cogotes enteros, dorados y crujientes. Tu perro lo va a oler antes que tú." },
    unico: { eyebrow: "Ingrediente único", titulo: "Cero rellenos. Cero cuentos.", texto: "Sin harinas, sin cereales, sin colorantes. Solo cogote de pollo para tu perro." },
    foco: { eyebrow: "De cerca", titulo: "Fuerza natural para tu perro, mordida a mordida." },
    componentesTitulo: "Lo que hay en cada cogote",
    componentes: [
      { parte: "Cartílago", valor: "Colágeno natural", texto: "Apoya las articulaciones, tendones y ligamentos de tu perro. Ideal para los que no paran de correr." },
      { parte: "Hueso", valor: "Calcio y fósforo", texto: "Minerales para que tu perro tenga huesos y dientes firmes. 20 % de cenizas minerales." },
      { parte: "Carne", valor: "52 % proteína", texto: "Proteína de alta calidad para tu perro, concentrada al quitarle el agua." },
      { parte: "Al masticar", valor: "Dientes limpios, mente tranquila", texto: "Roer le arrastra el sarro y lo relaja. Solo 15 % de grasa." },
    ],
    cierre: { eyebrow: "Bolsa resellable", titulo: "El premio favorito de tu perro ya tiene nombre." },
    nutricion: {
      titulo: "Más proteína, menos cuento.",
      tabla: "Snack para perros · por cada 100 g de cogote de pollo deshidratado",
      filas: [["Proteína bruta", "52 %"], ["Grasas", "15 %"], ["Cenizas (calcio y fósforo del hueso)", "20 %"], ["Humedad", "8 %"]],
      energia: ["Valor energético", "343 kcal"],
    },
    porciones: {
      titulo: "Ración diaria máxima", columnas: ["Peso del perro", "Máx."],
      filas: [["Hasta 5 kg", "10 g"], ["5 a 10 kg", "20 g"], ["10 a 20 kg", "20–40 g"], ["20 a 40 kg", "40–80 g"], ["Más de 40 kg", "80–100 g"]],
    },
    cuidados: [
      "Dáselo siempre supervisado, sobre todo con varios perros juntos.",
      "Para perros chicos, en trozos.",
      "Deja agua fresca a mano.",
      "Guarda la bolsa cerrada, en lugar fresco y seco.",
      "No recomendado con alergia al pollo, enfermedad renal avanzada o problemas dentales graves.",
    ],
    nota: "Composición referencial de cogote de pollo deshidratado, según los valores declarados por FILAN (Cogote de pollo deshidratado, 100 g). Los beneficios articulares y dentales son de apoyo y no reemplazan las indicaciones de tu veterinario. Producto exclusivo para perros: no apto para consumo humano.",
  },

  "patitas-de-pollo": {
    titulo: "Patitas de Pollo",
    descripcion: "Patitas de pollo deshidratadas: cartílago con colágeno, glucosamina y condroitina, y una mordida crujiente que limpia los dientes.",
    imagen: { src: "img/patitas/patita-real.png", ancho: 1154, alto: 1572, anclas: [[.45, .45], [.25, .15], [.3, .84], [.86, .74]] },
    foto: "img/patitas/patitas-pila.png",
    etiqueta: { lineas: ["Patitas de pollo", "deshidratadas"], ingrediente: "Ingrediente único: pata de pollo deshidratada", sello: "PESO NETO 100 g" },
    portada: { eyebrow: "Snack 100 % natural para perros", titulo: "Lo natural se hereda. Patitas de pollo deshidratadas: el crunch favorito de tu perro." },
    abre: { eyebrow: "Ábrela", titulo: "Crunch garantizado.", texto: "Patitas enteras, doradas y crocantes. El snack que suena rico." },
    unico: { eyebrow: "Ingrediente único", titulo: "Sin aditivos. Sin conservantes.", texto: "Solo pata de pollo deshidratada. Nada que tu perro no reconozca como comida." },
    foco: { eyebrow: "De cerca", titulo: "Pequeña por fuera, poderosa por dentro." },
    componentesTitulo: "Lo que hay en cada patita",
    componentes: [
      { parte: "Articulaciones", valor: "Glucosamina y condroitina", texto: "Las patas tienen mucho cartílago: componentes que apoyan las articulaciones de tu perro." },
      { parte: "Piel y tendones", valor: "Colágeno natural", texto: "Para las articulaciones, la piel y el pelaje de tu perro. Se ablanda al masticar." },
      { parte: "Dedos", valor: "Huesitos crocantes", texto: "Al deshidratarse quedan quebradizos y se trituran al morder." },
      { parte: "Al masticar", valor: "Limpieza dental", texto: "El roce arrastra la placa. 49 % de proteína por cada 100 g." },
    ],
    cierre: { eyebrow: "Bolsa resellable", titulo: "El crunch favorito de tu perro ya tiene nombre." },
    nutricion: {
      titulo: "Colágeno que se escucha.",
      tabla: "Snack para perros · por cada 100 g de pata de pollo deshidratada",
      filas: [["Proteína bruta", "49,4 %"], ["Grasa bruta", "29,7 %"], ["Cenizas (minerales del hueso)", "15,9 %"], ["Humedad", "3,9 %"]],
      energia: ["Energía metabolizable", "468 kcal"],
    },
    porciones: {
      titulo: "Ración diaria máxima", columnas: ["Peso del perro", "Máx."],
      filas: [["Hasta 5 kg", "8 g"], ["5 a 10 kg", "13 g"], ["10 a 20 kg", "13–23 g"], ["20 a 40 kg", "23–38 g"], ["Más de 40 kg", "38–45 g"]],
    },
    cuidados: [
      "Dáselo siempre supervisado.",
      "Para perros chicos, quita las uñas o parte la patita.",
      "Deja agua fresca a mano.",
      "Guarda la bolsa cerrada, en lugar fresco y seco.",
      "No recomendado con alergia al pollo o pancreatitis: es un snack con bastante grasa.",
    ],
    nota: "Composición referencial de pata de pollo deshidratada, según los valores declarados por Pets & Friends (Snack garras de pollo, 100 % pata de pollo). La ración máxima equivale a cerca del 10 % de las calorías diarias. Los beneficios articulares y dentales son de apoyo y no reemplazan las indicaciones de tu veterinario. Producto exclusivo para perros: no apto para consumo humano.",
  },

  "orejas-de-cerdo": {
    titulo: "Orejas de Cerdo",
    descripcion: "Orejas de cerdo deshidratadas: masticable largo, rico en colágeno y proteína.",
    imagen: { src: "img/orejas/oreja-real.png", ancho: 1574, alto: 1263, anclas: [[.15, .85], [.65, .35], [.42, .62], [.86, .55]] },
    etiqueta: { lineas: ["Orejas de cerdo", "deshidratadas"], ingrediente: "Ingrediente único: oreja de cerdo deshidratada", sello: "PESO NETO 80 g" },
    portada: { eyebrow: "Snack 100 % natural para perros", titulo: "Lo natural se hereda. Orejas de cerdo deshidratadas: el clásico que todo perro ama." },
    abre: { eyebrow: "Ábrela", titulo: "Un clásico, en su punto.", texto: "Orejas enteras, doradas y firmes. Horas de entretención sana para tu perro." },
    unico: { eyebrow: "Ingrediente único", titulo: "Solo oreja. Nada más.", texto: "Sin saborizantes, sin colorantes, sin conservantes artificiales." },
    foco: { eyebrow: "De cerca", titulo: "Textura firme, sabor irresistible." },
    componentesTitulo: "Lo que hay en cada oreja",
    componentes: [
      { parte: "Cartílago", valor: "Colágeno natural", texto: "La oreja es casi toda cartílago: colágeno para las articulaciones, la piel y el pelaje de tu perro." },
      { parte: "Piel", valor: "57 % proteína", texto: "Proteína concentrada al quitarle el agua." },
      { parte: "Textura", valor: "Masticación larga", texto: "Firme pero flexible: entretiene sin ser tan dura como un hueso." },
      { parte: "Energía", valor: "21 % grasa", texto: "Es un premio contundente: mejor en porciones pequeñas." },
    ],
    cierre: { eyebrow: "Orejas de cerdo · 80 g y 200 g", titulo: "El clásico favorito de tu perro ya tiene nombre." },
    nutricion: {
      titulo: "Colágeno para rato.",
      tabla: "Snack para perros · por cada 100 g de oreja de cerdo deshidratada",
      filas: [["Proteína bruta", "57 %"], ["Grasa bruta", "21 %"], ["Fibra bruta", "0 %"], ["Humedad", "8 %"]],
      energia: ["Energía", "≈ 500 kcal"],
    },
    porciones: {
      titulo: "Ración diaria máxima", columnas: ["Peso del perro", "Máx."],
      filas: [["Hasta 5 kg", "7 g"], ["5 a 10 kg", "13 g"], ["10 a 20 kg", "13–21 g"], ["20 a 40 kg", "21–36 g"], ["Más de 40 kg", "1 oreja"]],
    },
    cuidados: [
      "Dáselo siempre supervisado y quítalo cuando quede un trozo pequeño.",
      "Para perros chicos, en trozos.",
      "Deja agua fresca a mano.",
      "Guarda la bolsa cerrada, en lugar fresco y seco.",
      "No recomendado con sobrepeso, pancreatitis o estómago sensible: tiene bastante grasa.",
    ],
    nota: "Composición referencial de oreja de cerdo deshidratada, según el análisis garantizado declarado por productos equivalentes (tiras de oreja de cerdo: proteína mín. 57 %, grasa mín. 21 %, humedad máx. 8 %; energía de 502 a 530 kcal por 100 g). La ración máxima equivale a cerca del 10 % de las calorías diarias. Producto exclusivo para perros: no apto para consumo humano.",
  },

  "femur-natural": {
    titulo: "Fémur Natural",
    descripcion: "Hueso de fémur 100 % natural para masticadores intensos: entretención larga y dientes más limpios.",
    imagen: { src: "img/femur/femur-entero.png", ancho: 1600, alto: 1809, anclas: [[.16, .2], [.6, .56], [.4, .36], [.82, .84]] },
    empaque: "vacio",   // bolsa transparente al vacío, con un solo hueso
    etiqueta: { lineas: ["Fémur", "natural"], ingrediente: "Ingrediente único: hueso de fémur natural", sello: "AL VACÍO" },
    portada: { eyebrow: "Masticable 100 % natural para perros", titulo: "Lo natural se hereda. Hueso de fémur natural para perros, sellado al vacío para que llegue fresco." },
    abre: { eyebrow: "Sellado al vacío", titulo: "Fresco hasta que lo abres.", texto: "El plástico se suelta y aparece el fémur entero, tal como llega a tu casa." },
    unico: { eyebrow: "Envasado al vacío", titulo: "Hueso. Solo hueso.", texto: "Sellado al vacío, uno por envase, para conservarlo fresco. Sin saborizantes ni rellenos." },
    foco: { eyebrow: "De cerca", titulo: "Hecho para durar." },
    componentesTitulo: "Lo que hay en cada fémur",
    componentes: [
      { parte: "Cabeza del hueso", valor: "Calcio y fósforo", texto: "El hueso es mineral puro: lo que tu perro roe le aporta calcio y fósforo." },
      { parte: "Centro", valor: "Médula", texto: "Grasa y sabor naturales dentro del hueso. Lo que más disfrutan." },
      { parte: "Carne adherida", valor: "Sabor natural", texto: "Restos de carne y tendón secos: lo primero que tu perro va a roer." },
      { parte: "Al masticar", valor: "Dientes limpios", texto: "Roer raspa la placa y calma la energía de los perros más activos." },
    ],
    cierre: { eyebrow: "Fémur natural al vacío · Pequeño y Grande", titulo: "El hueso favorito de tu perro ya tiene nombre." },
    nutricion: {
      titulo: "Calcio, médula y paciencia.",
      tabla: "Snack para perros · por cada 100 g de hueso de fémur con médula",
      filas: [["Proteína bruta (mín.)", "27 %"], ["Grasa bruta (mín.)", "19 %"], ["Fibra bruta (máx.)", "1 %"], ["Humedad (máx.)", "4 %"]],
      energia: ["Energía estimada", "≈ 260 kcal"],
    },
    porciones: {
      titulo: "Qué tamaño elegir", columnas: ["Perro", "Tamaño"],
      filas: [["Hasta 15 kg", "Pequeño"], ["Más de 15 kg", "Grande"], ["Sesiones", "15–20 min"], ["Frecuencia", "2–3 veces por semana"]],
    },
    cuidados: [
      "Siempre bajo supervisión. Retíralo si se astilla o queda un trozo que pueda tragar.",
      "Elige un hueso más grande que el hocico de tu perro.",
      "No es para cachorros ni perros con dientes débiles o fracturados.",
      "Los huesos muy duros pueden fracturar dientes en perros que muerden con mucha fuerza.",
      "Mantén el envase al vacío cerrado hasta usarlo. Una vez abierto, guárdalo refrigerado y dáselo pronto.",
      "Deja agua fresca a mano.",
    ],
    nota: "Composición referencial de hueso de fémur de vacuno con médula, según el análisis garantizado declarado por Jones Natural Chews (Center Bone: proteína mín. 27 %, grasa mín. 19 %, fibra máx. 1 %, humedad máx. 4 %). La energía es una estimación nuestra a partir de esos valores. Producto exclusivo para perros: no apto para consumo humano.",
  },
};

// El Mix de Patitas usa la misma ficha que las Patitas de Pollo, con su propio nombre
FICHAS["mix-patitas-de-pollo"] = Object.assign({}, FICHAS["patitas-de-pollo"], {
  titulo: "Mix Patitas de Pollo",
  etiqueta: Object.assign({}, FICHAS["patitas-de-pollo"].etiqueta, { sello: "PESO NETO 200 g" }),
  cierre: { eyebrow: "Pack de 200 g", titulo: "El mix que hace feliz a tu perro." },
});
