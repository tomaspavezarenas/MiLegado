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
    imagen: { src: "img/cogotes/cogote-4k.png", ancho: 1200, alto: 1063, anclas: [[.1, .1], [.62, .3], [.33, .72], [.86, .8]] },
    ventana: "img/cogotes/ventana.jpg",
    foto: "img/cogotes/foto.jpg",
    etiqueta: { lineas: ["Cogote de pollo", "deshidratado"], ingrediente: "Ingrediente único: cogote de pollo deshidratado", sello: "PESO NETO 100 g" },
    portada: { eyebrow: "Snack 100 % natural para perros y gatos", titulo: "Lo natural se hereda. Cogote de pollo deshidratado, crujiente y lleno de fuerza." },
    abre: { eyebrow: "Ábrela", titulo: "Huele a premio.", texto: "Cogotes enteros, dorados y crujientes. Así de simple, así de rico." },
    unico: { eyebrow: "Ingrediente único", titulo: "Cero rellenos. Cero cuentos.", texto: "Sin harinas, sin cereales, sin colorantes. Solo cogote de pollo." },
    foco: { eyebrow: "De cerca", titulo: "Fuerza natural, mordida a mordida." },
    componentesTitulo: "Lo que hay en cada cogote",
    componentes: [
      { parte: "Cartílago", valor: "Colágeno natural", texto: "Apoya articulaciones, tendones y ligamentos. Ideal para los que no paran de correr." },
      { parte: "Hueso", valor: "Calcio y fósforo", texto: "Minerales para huesos y dientes firmes. 20 % de cenizas minerales." },
      { parte: "Carne", valor: "52 % proteína", texto: "Proteína de alta calidad, concentrada al quitarle el agua." },
      { parte: "Al masticar", valor: "Dientes limpios, mente tranquila", texto: "Roer arrastra el sarro y los relaja. Solo 15 % de grasa." },
    ],
    cierre: { eyebrow: "Bolsa resellable", titulo: "Su premio favorito ya tiene nombre." },
    nutricion: {
      titulo: "Más proteína, menos cuento.",
      tabla: "Por cada 100 g de cogote de pollo deshidratado",
      filas: [["Proteína bruta", "52 %"], ["Grasas", "15 %"], ["Cenizas (calcio y fósforo del hueso)", "20 %"], ["Humedad", "8 %"]],
      energia: ["Valor energético", "343 kcal"],
    },
    porciones: {
      titulo: "Ración diaria máxima", columnas: ["Peso del perro", "Máx."],
      filas: [["Hasta 5 kg", "10 g"], ["5 a 10 kg", "20 g"], ["10 a 20 kg", "20–40 g"], ["20 a 40 kg", "40–80 g"], ["Más de 40 kg", "80–100 g"]],
    },
    cuidados: [
      "Dáselo siempre supervisado, sobre todo con varios perros juntos.",
      "Para gatos y perros chicos, en trozos.",
      "Deja agua fresca a mano.",
      "Guarda la bolsa cerrada, en lugar fresco y seco.",
      "No recomendado con alergia al pollo, enfermedad renal avanzada o problemas dentales graves.",
    ],
    nota: "Composición referencial de cogote de pollo deshidratado, según los valores declarados por FILAN (Cogote de pollo deshidratado, 100 g). Los beneficios articulares y dentales son de apoyo y no reemplazan las indicaciones de tu veterinario.",
  },

  "patitas-de-pollo": {
    titulo: "Patitas de Pollo",
    descripcion: "Patitas de pollo deshidratadas: cartílago con colágeno, glucosamina y condroitina, y una mordida crujiente que limpia los dientes.",
    imagen: { src: "img/patitas/patita-hd.png", ancho: 1200, alto: 755, anclas: [[.47, .42], [.82, .22], [.22, .62], [.72, .78]] },
    etiqueta: { lineas: ["Patitas de pollo", "deshidratadas"], ingrediente: "Ingrediente único: pata de pollo deshidratada", sello: "PESO NETO 100 g" },
    portada: { eyebrow: "Snack 100 % natural para perros", titulo: "Lo natural se hereda. Patitas de pollo deshidratadas, crujientes y llenas de colágeno." },
    abre: { eyebrow: "Ábrela", titulo: "Crunch garantizado.", texto: "Patitas enteras, doradas y crocantes. El snack que suena rico." },
    unico: { eyebrow: "Ingrediente único", titulo: "Sin aditivos. Sin conservantes.", texto: "Solo pata de pollo deshidratada. Nada que no reconozca como comida." },
    foco: { eyebrow: "De cerca", titulo: "Pequeña por fuera, poderosa por dentro." },
    componentesTitulo: "Lo que hay en cada patita",
    componentes: [
      { parte: "Articulaciones", valor: "Glucosamina y condroitina", texto: "Las patas tienen mucho cartílago: componentes que apoyan las articulaciones." },
      { parte: "Piel y tendones", valor: "Colágeno natural", texto: "Para articulaciones, piel y pelaje. Se ablanda al masticar." },
      { parte: "Dedos", valor: "Huesitos crocantes", texto: "Al deshidratarse quedan quebradizos y se trituran al morder." },
      { parte: "Al masticar", valor: "Limpieza dental", texto: "El roce arrastra la placa. 49 % de proteína por cada 100 g." },
    ],
    cierre: { eyebrow: "Bolsa resellable", titulo: "Su crunch favorito ya tiene nombre." },
    nutricion: {
      titulo: "Colágeno que se escucha.",
      tabla: "Por cada 100 g de pata de pollo deshidratada",
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
    nota: "Composición referencial de pata de pollo deshidratada, según los valores declarados por Pets & Friends (Snack garras de pollo, 100 % pata de pollo). La ración máxima equivale a cerca del 10 % de las calorías diarias. Los beneficios articulares y dentales son de apoyo y no reemplazan las indicaciones de tu veterinario.",
  },

  "orejas-de-cerdo": {
    titulo: "Orejas de Cerdo",
    descripcion: "Orejas de cerdo deshidratadas: masticable largo, rico en colágeno y proteína.",
    imagen: { src: "img/orejas/oreja-hd.png", ancho: 1200, alto: 1111, anclas: [[.22, .76], [.7, .3], [.45, .55], [.86, .55]] },
    etiqueta: { lineas: ["Orejas de cerdo", "deshidratadas"], ingrediente: "Ingrediente único: oreja de cerdo deshidratada", sello: "PESO NETO 80 g" },
    portada: { eyebrow: "Snack 100 % natural para perros", titulo: "Lo natural se hereda. Orejas de cerdo deshidratadas: el clásico que nunca falla." },
    abre: { eyebrow: "Ábrela", titulo: "Un clásico, en su punto.", texto: "Orejas enteras, doradas y firmes. Horas de entretención sana." },
    unico: { eyebrow: "Ingrediente único", titulo: "Solo oreja. Nada más.", texto: "Sin saborizantes, sin colorantes, sin conservantes artificiales." },
    foco: { eyebrow: "De cerca", titulo: "Textura firme, sabor irresistible." },
    componentesTitulo: "Lo que hay en cada oreja",
    componentes: [
      { parte: "Cartílago", valor: "Colágeno natural", texto: "La oreja es casi toda cartílago: colágeno para articulaciones, piel y pelaje." },
      { parte: "Piel", valor: "57 % proteína", texto: "Proteína concentrada al quitarle el agua." },
      { parte: "Textura", valor: "Masticación larga", texto: "Firme pero flexible: entretiene sin ser tan dura como un hueso." },
      { parte: "Energía", valor: "21 % grasa", texto: "Es un premio contundente: mejor en porciones pequeñas." },
    ],
    cierre: { eyebrow: "Orejas de cerdo · 80 g y 200 g", titulo: "Su clásico favorito ya tiene nombre." },
    nutricion: {
      titulo: "Colágeno para rato.",
      tabla: "Por cada 100 g de oreja de cerdo deshidratada",
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
    nota: "Composición referencial de oreja de cerdo deshidratada, según el análisis garantizado declarado por productos equivalentes (tiras de oreja de cerdo: proteína mín. 57 %, grasa mín. 21 %, humedad máx. 8 %; energía de 502 a 530 kcal por 100 g). La ración máxima equivale a cerca del 10 % de las calorías diarias.",
  },

  "femur-natural": {
    titulo: "Fémur Natural",
    descripcion: "Hueso de fémur 100 % natural para masticadores intensos: entretención larga y dientes más limpios.",
    imagen: { src: "img/femur/femur-hd.png", ancho: 1200, alto: 559, anclas: [[.1, .5], [.88, .38], [.45, .55], [.7, .5]] },
    etiqueta: { lineas: ["Fémur", "natural"], ingrediente: "Ingrediente único: hueso de fémur natural", sello: "100 % NATURAL" },
    portada: { eyebrow: "Masticable 100 % natural para perros", titulo: "Lo natural se hereda. Hueso de fémur natural, para los que muerden en serio." },
    abre: { eyebrow: "Ábrelo", titulo: "Para masticadores intensos.", texto: "Un hueso de verdad, firme y entero. Entretención que dura." },
    unico: { eyebrow: "Ingrediente único", titulo: "Hueso. Solo hueso.", texto: "Sin saborizantes, sin rellenos, sin plástico. Natural de punta a punta." },
    foco: { eyebrow: "De cerca", titulo: "Hecho para durar." },
    componentesTitulo: "Lo que hay en cada fémur",
    componentes: [
      { parte: "Extremo", valor: "Calcio y fósforo", texto: "El hueso es mineral puro: lo que roe le aporta calcio y fósforo." },
      { parte: "Centro", valor: "Médula", texto: "Grasa y sabor naturales dentro del hueso. Lo que más disfrutan." },
      { parte: "Superficie", valor: "Limpieza dental", texto: "Roer raspa la placa y el sarro de los dientes." },
      { parte: "Al masticar", valor: "Entretención larga", texto: "Calma la ansiedad y la energía de los perros más activos." },
    ],
    cierre: { eyebrow: "Fémur natural · Pequeño y Grande", titulo: "Su hueso favorito ya tiene nombre." },
    nutricion: {
      titulo: "Calcio, médula y paciencia.",
      tabla: "Por cada 100 g de hueso de fémur con médula",
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
      "Deja agua fresca a mano y guarda el hueso en un lugar fresco y seco.",
    ],
    nota: "Composición referencial de hueso de fémur de vacuno con médula, según el análisis garantizado declarado por Jones Natural Chews (Center Bone: proteína mín. 27 %, grasa mín. 19 %, fibra máx. 1 %, humedad máx. 4 %). La energía es una estimación nuestra a partir de esos valores.",
  },
};

// El Mix de Patitas usa la misma ficha que las Patitas de Pollo, con su propio nombre
FICHAS["mix-patitas-de-pollo"] = Object.assign({}, FICHAS["patitas-de-pollo"], {
  titulo: "Mix Patitas de Pollo",
  etiqueta: Object.assign({}, FICHAS["patitas-de-pollo"].etiqueta, { sello: "PESO NETO 200 g" }),
  cierre: { eyebrow: "Pack de 200 g", titulo: "El mix que lo hace feliz." },
});
