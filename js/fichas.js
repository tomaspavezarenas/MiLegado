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
    imagen: { src: "img/cogotes/cogote-real.png?v=202611252207", ancho: 1600, alto: 1338, anclas: [[.1, .12], [.62, .3], [.33, .72], [.86, .8]] },
    ventana: "img/cogotes/ventana.jpg?v=202611252207",
    foto: "img/cogotes/foto.jpg?v=202611252207",
    etiqueta: { lineas: ["Cogote de pollo", "deshidratado"], ingrediente: "Ingrediente único: cogote de pollo deshidratado", sello: "PESO NETO 100 g" },
    portada: { eyebrow: "Snack natural para perros", titulo: "Lo natural se hereda. Cogote de pollo deshidratado: el premio crujiente que tu perro va a amar." },
    abre: { eyebrow: "Ábrela", titulo: "Huele a premio.", texto: "Cogotes enteros, dorados y crujientes. Tu perro lo va a oler antes que tú." },
    unico: { eyebrow: "Ingrediente único", titulo: "Cero rellenos. Cero cuentos.", texto: "Sin harinas, sin cereales, sin colorantes. Solo cogote de pollo para tu perro." },
    foco: { eyebrow: "De cerca", titulo: "Fuerza natural para tu perro, mordida a mordida." },
    componentesTitulo: "Lo que hay en cada cogote",
    componentes: [
      { parte: "Cartílago", valor: "Colágeno tipo II", texto: "El cartílago de pollo es fuente de condroitina y colágeno tipo II, estudiados para la salud articular (Frontiers in Nutrition, 2022)." },
      { parte: "Vértebras", valor: "20 % minerales", texto: "Las cenizas son el mineral del hueso: calcio y fósforo, que en hueso de ave van en proporción cercana a 2 : 1." },
      { parte: "Carne del cuello", valor: "52 % proteína", texto: "Al deshidratar se va el agua: de ~14 % de proteína en crudo pasa a 52 % (USDA / FILAN)." },
      { parte: "Energía", valor: "343 kcal / 100 g", texto: "Solo 15 % de grasa: el más liviano de los masticables de la tienda." },
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
    nota: "Composición declarada por FILAN para cogote de pollo deshidratado (100 g): proteína 52 %, grasa 15 %, cenizas 20 %, humedad 8 %, 343 kcal. Proteína en crudo: USDA FoodData Central (cuello de pollo con piel, 14,1 g/100 g). Cartílago: Frontiers in Nutrition 2022 (condroitina y colágeno tipo II de cartílago de pollo). Proporción calcio : fósforo en hueso de ave: estudio de cenizas de hueso de pollo, 2022 (1,6 a 2,5 : 1). Los beneficios articulares son de apoyo y no reemplazan las indicaciones de tu veterinario. Producto exclusivo para perros: no apto para consumo humano.",
  },

  "patitas-de-pollo": {
    titulo: "Patitas de Pollo",
    descripcion: "Patitas de pollo deshidratadas: cartílago con colágeno, glucosamina y condroitina, y una mordida crujiente que limpia los dientes.",
    imagen: { src: "img/patitas/patita-real.png?v=202611252207", ancho: 1152, alto: 1571, anclas: [[.28, .2], [.45, .47], [.3, .84], [.86, .74]] },
    foto: "img/patitas/patitas-pila.png?v=202611252207",
    etiqueta: { lineas: ["Patitas de pollo", "deshidratadas"], ingrediente: "Ingrediente único: pata de pollo deshidratada", sello: "PESO NETO 100 g" },
    portada: { eyebrow: "Snack 100 % natural para perros", titulo: "Lo natural se hereda. Patitas de pollo deshidratadas: el crunch favorito de tu perro." },
    abre: { eyebrow: "Ábrela", titulo: "Crunch garantizado.", texto: "Patitas enteras, doradas y crocantes. El snack que suena rico." },
    unico: { eyebrow: "Ingrediente único", titulo: "Sin aditivos. Sin conservantes.", texto: "Solo pata de pollo deshidratada. Nada que tu perro no reconozca como comida." },
    foco: { eyebrow: "De cerca", titulo: "Pequeña por fuera, poderosa por dentro." },
    componentesTitulo: "Lo que hay en cada patita",
    componentes: [
      { parte: "Piel y tendones", valor: "Colágeno: 71 %", texto: "Un análisis de patas de pollo encontró que cerca del 71 % de su proteína es colágeno (Polymers, 2020)." },
      { parte: "Articulaciones", valor: "Condroitina", texto: "Cada patita tiene muchas articulaciones pequeñas, con cartílago rico en condroitina." },
      { parte: "Huesitos", valor: "15,9 % minerales", texto: "Huesos finos que al deshidratarse quedan crocantes y se trituran al morder." },
      { parte: "Energía", valor: "468 kcal / 100 g", texto: "29,7 % de grasa: es el más contundente de los snacks de pollo, dalo con medida." },
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
    nota: "Composición declarada por Pets & Friends para pata de pollo deshidratada (100 % pata de pollo): proteína 49,4 %, grasa 29,7 %, cenizas 15,9 %, humedad 3,9 %, 468 kcal de energía metabolizable por 100 g. Colágeno: Polymers 2020, Valorization of Chicken Feet (≈ 70,9 % de la proteína de la pata es colágeno). La ración máxima equivale a cerca del 10 % de las calorías diarias. Los beneficios articulares son de apoyo y no reemplazan las indicaciones de tu veterinario. Producto exclusivo para perros: no apto para consumo humano.",
  },

  "orejas-de-cerdo": {
    titulo: "Orejas de Cerdo",
    descripcion: "Orejas de cerdo deshidratadas: masticable largo, rico en colágeno y proteína.",
    imagen: { src: "img/orejas/oreja-real.png?v=202611252207", ancho: 1574, alto: 1263, anclas: [[.15, .85], [.65, .35], [.42, .62], [.86, .55]] },
    etiqueta: { lineas: ["Orejas de cerdo", "deshidratadas"], ingrediente: "Ingrediente único: oreja de cerdo deshidratada", sello: "PESO NETO 80 g" },
    portada: { eyebrow: "Snack 100 % natural para perros", titulo: "Lo natural se hereda. Orejas de cerdo deshidratadas: el clásico que todo perro ama." },
    abre: { eyebrow: "Ábrela", titulo: "Un clásico, en su punto.", texto: "Orejas enteras, doradas y firmes. Horas de entretención sana para tu perro." },
    unico: { eyebrow: "Ingrediente único", titulo: "Solo oreja. Nada más.", texto: "Sin saborizantes, sin colorantes, sin conservantes artificiales." },
    foco: { eyebrow: "De cerca", titulo: "Textura firme, sabor irresistible." },
    componentesTitulo: "Lo que hay en cada oreja",
    componentes: [
      { parte: "Cartílago auricular", valor: "≈ 70 % colágeno", texto: "En estudios del cartílago de oreja de cerdo, cerca del 70 % de su peso resultó ser colágeno." },
      { parte: "Matriz del cartílago", valor: "Ácido hialurónico", texto: "El mismo estudio encontró colágeno tipo II, condroitina sulfato y ácido hialurónico." },
      { parte: "Piel", valor: "57 % proteína", texto: "Cruda tiene 22,5 g de proteína por 100 g (USDA); deshidratada, sube a 57 %." },
      { parte: "Energía", valor: "≈ 500 kcal / 100 g", texto: "El más energético de la tienda: un premio para darlo en trozos." },
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
    nota: "Composición referencial de oreja de cerdo deshidratada según análisis garantizados de productos equivalentes (proteína mín. 57 %, grasa mín. 21 %, humedad máx. 8 %; 502 a 530 kcal por 100 g). Oreja cruda: USDA FoodData Central (22,5 g de proteína y 15,1 g de grasa por 100 g). Cartílago: estudio de cartílago auricular porcino (≈ 70 % colágeno; colágeno tipo II, condroitina sulfato y ácido hialurónico). La ración máxima equivale a cerca del 10 % de las calorías diarias. Producto exclusivo para perros: no apto para consumo humano.",
  },

  "femur-natural": {
    titulo: "Fémur Natural",
    descripcion: "Hueso de fémur 100 % natural para masticadores intensos: entretención larga y dientes más limpios.",
    imagen: { src: "img/femur/femur-entero.png?v=202611252207", ancho: 1600, alto: 1809, anclas: [[.16, .2], [.6, .56], [.4, .36], [.82, .84]] },
    empaque: "vacio",   // viene sellado al vacío: se muestra la foto envasada y el plástico se abre
    vacio: { src: "img/femur/femur-vacio.png?v=202611252207", ancho: 1280, alto: 1280 },
    etiqueta: { lineas: ["Fémur", "natural"], ingrediente: "Ingrediente único: hueso de fémur natural", sello: "AL VACÍO" },
    portada: { eyebrow: "Masticable 100 % natural para perros", titulo: "Lo natural se hereda. Hueso de fémur natural para perros, sellado al vacío para que llegue fresco." },
    abre: { eyebrow: "Sellado al vacío", titulo: "Fresco hasta que lo abres.", texto: "El plástico se suelta y aparece el fémur entero, tal como llega a tu casa." },
    unico: { eyebrow: "Envasado al vacío", titulo: "Hueso. Solo hueso.", texto: "Sellado al vacío, uno por envase, para conservarlo fresco. Sin saborizantes ni rellenos." },
    foco: { eyebrow: "De cerca", titulo: "Hecho para durar." },
    componentesTitulo: "Lo que hay en cada fémur",
    componentes: [
      { parte: "Cabeza del hueso", valor: "≈ 59 % minerales", texto: "En hueso de vacuno, las cenizas son cerca del 59 % del peso, con calcio y fósforo en proporción ≈ 1,9 : 1." },
      { parte: "Médula", valor: "≈ 80–86 % grasa", texto: "La médula amarilla del vacuno es casi toda grasa: energía y el sabor que más buscan." },
      { parte: "Carne y tendón", valor: "27 % proteína", texto: "Los restos de carne y tendón secos aportan la proteína del hueso (mín. 27 %)." },
      { parte: "Al masticar", valor: "Roer largo", texto: "Un hueso entero da sesiones largas de mordida: entretiene y gasta energía." },
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
    nota: "Composición referencial de hueso de fémur de vacuno con médula según Jones Natural Chews (proteína mín. 27 %, grasa mín. 19 %, fibra máx. 1 %, humedad máx. 4 %); la energía es una estimación nuestra. Minerales: estudio de hueso de vacuno, 1994 (cenizas 59 %; calcio ≈ 345 y fósforo ≈ 183 mg por g de ceniza). Médula: estudios de médula ósea bovina (80 % a 86 % de grasa). Producto exclusivo para perros: no apto para consumo humano.",
  },
};

// El Mix de Patitas usa la misma ficha que las Patitas de Pollo, con su propio nombre
FICHAS["mix-patitas-de-pollo"] = Object.assign({}, FICHAS["patitas-de-pollo"], {
  titulo: "Mix Patitas de Pollo",
  etiqueta: Object.assign({}, FICHAS["patitas-de-pollo"].etiqueta, { sello: "PESO NETO 200 g" }),
  cierre: { eyebrow: "Pack de 200 g", titulo: "El mix que hace feliz a tu perro." },
});
