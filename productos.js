// ============================================================
//  BRÜN CAKES — CATÁLOGO
//  Editá este archivo para cambiar precios, productos y disponibilidad.
// ============================================================

const CONFIG = {
  nombreNegocio: "brün cakes",
  whatsapp: "5493518005221",          // sin "+", espacios ni guiones
  whatsappVisible: "351 800 5221",
  instagram: "https://www.instagram.com/bruncakes_/",
  instagramUsuario: "@bruncakes_",
  ubicacion: "Córdoba Capital",
  envio: true,
  retiro: true,
  pagos: ["Transferencia", "Efectivo", "Mercado Pago"],
};

// ------------------------------------------------------------
// CÓMO EDITAR
//  • disponible: false  → aparece "Agotado por ahora" y no se puede pedir
//  • opciones           → cada presentación con su precio (sin puntos ni $)
//  • unidad             → precio por unidad. Dejalo en null mientras no
//                         vendas individuales (se ve "Próximamente").
//                         Cuando empieces, poné el precio, ej: unidad: 2300
//  • anticipacion       → horas mínimas para pedir (24 o 48)
// ------------------------------------------------------------

const CATEGORIAS = [
  { id: "cajas", nombre: "Cajas", bajada: "Para regalar o para vos" },
  { id: "alfajores", nombre: "Alfajores", bajada: "Siete variedades, hechas a mano" },
  { id: "tortas", nombre: "Tortas y tartas", bajada: "24 cm · 15 a 20 porciones" },
  { id: "cookies", nombre: "Cookies", bajada: "Rellenas y bien chewy" },
];

const PRODUCTOS = [
  // ---------- ALFAJORES 7 CM ----------
  { id: "alf-chocolate", cat: "alfajores", nombre: "Chocolate", etiqueta: "Alfajor · 7 cm", img: "img/alf-chocolate.jpg",
    desc: "Masa de chocolate, relleno de dulce de leche, bañado en chocolate semiamargo.",
    opciones: [{ nombre: "Caja x6", precio: 12500 }, { nombre: "Caja x12", precio: 24000 }],
    unidad: null, disponible: true, anticipacion: 24 },
  { id: "alf-frutos-rojos", cat: "alfajores", nombre: "Frutos rojos", etiqueta: "Alfajor · 7 cm", img: "img/alf-frutos-rojos.jpg",
    desc: "Masa de vainilla, relleno de dulce de leche con corazón de frutos rojos, bañado en chocolate blanco.",
    opciones: [{ nombre: "Caja x6", precio: 13500 }, { nombre: "Caja x12", precio: 26000 }],
    unidad: null, disponible: true, anticipacion: 24 },
  { id: "alf-almendras", cat: "alfajores", nombre: "Almendras", etiqueta: "Alfajor · 7 cm", img: "img/alf-almendras.jpg",
    desc: "Masa de almendras, relleno de dulce de leche y cubierto de almendras.",
    opciones: [{ nombre: "Caja x6", precio: 13500 }, { nombre: "Caja x12", precio: 26000 }],
    unidad: null, disponible: true, anticipacion: 24 },
  { id: "alf-nueces", cat: "alfajores", nombre: "Nueces", etiqueta: "Alfajor · 7 cm", img: "img/alf-nueces.jpg",
    desc: "Masa de nueces, relleno de dulce de leche y cubierto de nueces.",
    opciones: [{ nombre: "Caja x6", precio: 13500 }, { nombre: "Caja x12", precio: 26000 }],
    unidad: null, disponible: true, anticipacion: 24 },
  // ---------- ALFAJORES 5 CM (solo en Box Degustación) ----------
  { id: "alf-lemon-curd", cat: "alfajores", nombre: "Lemon curd", etiqueta: "Alfajor · 5 cm", img: "img/alf-lemon-curd.jpg",
    desc: "Masa de vainilla, relleno de ganache de chocolate blanco y lemon curd, bañado en chocolate blanco.",
    soloEn: "box-degustacion", nota: "Tamaño 7 cm: consultar disponibilidad", unidad: null, disponible: true, anticipacion: 24 },
  { id: "alf-quaker", cat: "alfajores", nombre: "Quaker", etiqueta: "Alfajor · 5 cm", img: "img/alf-quaker.jpg",
    desc: "Masa de vainilla, relleno de avena, chocolate y dulce de leche, bañado en chocolate semiamargo.",
    soloEn: "box-degustacion", nota: "Tamaño 7 cm: consultar disponibilidad", unidad: null, disponible: true, anticipacion: 24 },
  { id: "alf-pistacho", cat: "alfajores", nombre: "Pistacho", etiqueta: "Alfajor · 5 cm", img: "img/alf-pistacho.jpg",
    desc: "Masa de pistachos, relleno de dulce de leche con corazón de pasta de pistacho crocante, bañado en chocolate blanco.",
    soloEn: "box-degustacion", nota: "Tamaño 7 cm: consultar disponibilidad", unidad: null, disponible: true, anticipacion: 24 },

  // ---------- CAJAS ----------
  { id: "box-surtido", cat: "cajas", nombre: "Box Surtido", etiqueta: "Alfajores de 7 cm",
    collage: ["alf-chocolate", "alf-frutos-rojos", "alf-almendras"],
    desc: "Chocolate, frutos rojos y almendras. La x6 trae 2 de cada; la x12, 4 de cada.",
    opciones: [{ nombre: "Caja x6", precio: 13000 }, { nombre: "Caja x12", precio: 25000 }],
    disponible: true, anticipacion: 24 },
  { id: "box-degustacion", cat: "cajas", nombre: "Box Degustación", etiqueta: "15 alfajores de 5 cm", destacado: "Las 7 variedades",
    collage: ["alf-chocolate", "alf-frutos-rojos", "alf-almendras", "alf-nueces", "alf-lemon-curd", "alf-quaker", "alf-pistacho"],
    desc: "3 de chocolate y 2 de frutos rojos, almendras, nueces, lemon curd, quaker y pistacho.",
    opciones: [{ nombre: "Caja x15", precio: 23000 }],
    disponible: true, anticipacion: 24 },
  { id: "mini-surtido", cat: "cajas", nombre: "Mini Surtido", etiqueta: "Alfajores de 5 cm", img: "img/box-mini.jpg",
    desc: "Las mismas variedades del Box Surtido, en 5 cm. La x6 trae 2 de cada; la x12, 4 de cada.",
    opciones: [{ nombre: "Caja x6", precio: 8000 }, { nombre: "Caja x12", precio: 15000 }],
    disponible: true, anticipacion: 24 },

  // ---------- TORTAS Y TARTAS ----------
  { id: "torta-key-lime", cat: "tortas", nombre: "Key lime pie", etiqueta: "Tortas y tartas", img: "img/torta-key-lime.jpg",
    desc: "Base de galletitas de vainilla, relleno cremoso de lima y leche condensada, terminación con crema chantilly y limas.",
    opciones: [{ nombre: "24 cm · 15–20 porciones", precio: 48500 }], nota: "Otros tamaños a consultar", disponible: true, anticipacion: 48 },
  { id: "torta-sablee", cat: "tortas", nombre: "Sablée de almendras", etiqueta: "Tortas y tartas", img: "img/torta-sablee.jpg",
    desc: "Dos capas de masa sablée de almendras con dulce de leche, crema chantilly y corazón de frutos rojos: moras, frambuesas, arándanos y frutillas.",
    opciones: [{ nombre: "24 cm · 15–20 porciones", precio: 46500 }], nota: "Otros tamaños a consultar", disponible: true, anticipacion: 48 },
  { id: "torta-carrot", cat: "tortas", nombre: "Carrot cake", etiqueta: "Tortas y tartas", img: "img/torta-carrot.jpg",
    desc: "Dos capas de bizcochuelo de zanahoria, relleno de crema de queso y nueces, terminación de crema chantilly y corazón de nueces.",
    opciones: [{ nombre: "24 cm · 15–20 porciones", precio: 44500 }], nota: "Otros tamaños a consultar", disponible: true, anticipacion: 48 },
  { id: "torta-bombona", cat: "tortas", nombre: "Torta Bombona", etiqueta: "Tortas y tartas", img: "img/torta-bombona.jpg",
    desc: "Base sablée de vainilla, relleno de avena, chocolate, dulce de leche y coco, terminación con dulce de leche y trufas de avena.",
    opciones: [{ nombre: "24 cm · 15–20 porciones", precio: 40500 }], nota: "Otros tamaños a consultar", disponible: true, anticipacion: 48 },
  { id: "torta-marquise", cat: "tortas", nombre: "Marquise", etiqueta: "Tortas y tartas", img: "img/torta-marquise.jpg",
    desc: "Base de chocolate húmeda sin harinas, relleno de dulce de leche, crema chantilly y terminación con chocolate.",
    opciones: [{ nombre: "24 cm · 15–20 porciones", precio: 32500 }], nota: "Otros tamaños a consultar", disponible: true, anticipacion: 48 },
  { id: "torta-coco", cat: "tortas", nombre: "Tarta de coco", etiqueta: "Tortas y tartas", img: "img/torta-coco.jpg",
    desc: "Base sablée de vainilla, rellena con dulce de leche y crumble de coco, terminación con dulce de leche.",
    opciones: [{ nombre: "24 cm · 15–20 porciones", precio: 30500 }], nota: "Otros tamaños a consultar", disponible: true, anticipacion: 48 },

  // ---------- COOKIES ----------
  { id: "box-cookies", cat: "cookies", nombre: "Box Cookies", etiqueta: "Cookies surtidas",
    collage: ["cookie-pistacho", "cookie-doble-choco", "cookie-carrot", "cookie-chocolate"],
    desc: "Pistacho y chocolate blanco · Doble chocolate y frutos rojos · Carrot · Chocolate.",
    sabores: [
      { nombre: "Pistacho y chocolate blanco", desc: "Cookie de chocolate blanco rellena con pasta de pistacho crocante.", img: "img/cookie-pistacho.jpg" },
      { nombre: "Doble chocolate y frutos rojos", desc: "Cookie de chocolate amargo con corazón de frutos rojos y chocolate blanco.", img: "img/cookie-doble-choco.jpg" },
      { nombre: "Carrot", desc: "Cookie de zanahoria rellena de cream cheese.", img: "img/cookie-carrot.jpg" },
      { nombre: "Chocolate", desc: "Cookie de vainilla con trozos de chocolate amargo.", img: "img/cookie-chocolate.jpg" },
    ],
    opciones: [{ nombre: "Caja x4", precio: 10200 }, { nombre: "Caja x8", precio: 19000 }],
    unidad: null, disponible: true, anticipacion: 24 },
];

// Imágenes para los collages (no hace falta tocar)
const IMAGENES = {
  "alf-chocolate": "img/alf-chocolate.jpg", "alf-frutos-rojos": "img/alf-frutos-rojos.jpg",
  "alf-almendras": "img/alf-almendras.jpg", "alf-nueces": "img/alf-nueces.jpg",
  "alf-lemon-curd": "img/alf-lemon-curd.jpg", "alf-quaker": "img/alf-quaker.jpg", "alf-pistacho": "img/alf-pistacho.jpg",
  "cookie-pistacho": "img/cookie-pistacho.jpg", "cookie-doble-choco": "img/cookie-doble-choco.jpg",
  "cookie-carrot": "img/cookie-carrot.jpg", "cookie-chocolate": "img/cookie-chocolate.jpg",
};
