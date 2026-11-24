// ============================================================
//  CONFIGURACIÓN DE BRÜN CAKES — editá este archivo para
//  cambiar tu número, tus productos, precios y disponibilidad.
// ============================================================

const CONFIG = {
  nombreNegocio: "brün cakes",
  // Número de WhatsApp en formato internacional, sin "+", espacios ni guiones.
  whatsapp: "5493518005221",
  instagram: "https://www.instagram.com/bruncakes_/",
  eslogan: "Tortas, alfajores y tartas por pedido hechas con mucho mucho amor 🤍",
  ubicacion: "Córdoba Capital",
  // Opciones de entrega que aparecen en el formulario
  envio: true,
  retiro: true,
  // Métodos de pago que aparecen en el formulario
  pagos: ["Transferencia", "Efectivo", "Mercado Pago"],
};

// ⚠️ LOS PRECIOS SON DE EJEMPLO — reemplazalos por los tuyos.
// disponible: true  → se puede pedir
// disponible: false → aparece como "Agotado"
// imagen: opcional, poné una ruta como "img/alfajor-choco.jpg"
const PRODUCTOS = [
  {
    categoria: "Alfajores",
    items: [
      { id: "alf-choco", nombre: "Alfajor Choco negro", descripcion: "Intenso, no negocia.", precio: 2500, disponible: true },
      { id: "alf-almendra", nombre: "Alfajor Almendra", descripcion: "Clásico, nunca falla.", precio: 2500, disponible: true },
      { id: "alf-frutos", nombre: "Alfajor Frutos rojos", descripcion: "Romántico y un poco dramático.", precio: 2500, disponible: true },
      { id: "alf-caja6", nombre: "Caja surtida x6", descripcion: "Dos de cada sabor.", precio: 14000, disponible: true },
    ],
  },
  {
    categoria: "Boxes",
    items: [
      { id: "box-dulce", nombre: "Box dulce", descripcion: "Mini torta, budín, cookies y alfajores, decorada con flores.", precio: 30000, disponible: true },
      { id: "box-brunch", nombre: "Box brunch", descripcion: "Opción dulce y salada para regalar o compartir.", precio: 38000, disponible: true },
    ],
  },
  {
    categoria: "Tortas",
    items: [
      { id: "torta-frutos", nombre: "Torta chocolate y frutos rojos", descripcion: "Bizcochuelo de chocolate, crema y frutos rojos.", precio: 32000, disponible: true },
      { id: "torta-chocotorta", nombre: "Chocotorta", descripcion: "La de siempre, bien cargada.", precio: 26000, disponible: true },
      { id: "torta-personalizada", nombre: "Torta personalizada", descripcion: "Contanos la idea en las notas y te pasamos presupuesto.", precio: 0, disponible: true, consultar: true },
    ],
  },
  {
    categoria: "Tartas",
    items: [
      { id: "tarta-coco", nombre: "Tarta de coco y dulce de leche", descripcion: "Masa sablée, dulce de leche y coco.", precio: 22000, disponible: true },
      { id: "tarta-lemon", nombre: "Lemon pie", descripcion: "Crema de limón y merengue italiano.", precio: 22000, disponible: true },
    ],
  },
  {
    categoria: "Cookies",
    items: [
      { id: "cookies-6", nombre: "Cookies x6", descripcion: "Chips de chocolate, bien chewy.", precio: 9000, disponible: true },
      { id: "cookies-12", nombre: "Cookies x12", descripcion: "Para compartir (o no).", precio: 17000, disponible: false },
    ],
  },
];
