const $ = (s) => document.querySelector(s);
const pesos = (n) => "$" + n.toLocaleString("es-AR");
const precioDe = (p, cant = 1) => p.consultar ? "A consultar" : pesos(p.precio * cant);
const carrito = {}; // id -> cantidad
const todos = PRODUCTOS.flatMap((c) => c.items);
const porId = Object.fromEntries(todos.map((p) => [p.id, p]));

// ---------- Encabezado ----------
document.title = `${CONFIG.nombreNegocio} · Pedidos`;
$("#titulo").textContent = CONFIG.nombreNegocio;
$("#eslogan").textContent = CONFIG.eslogan;
if (CONFIG.ubicacion) $("#ubicacion").textContent = "📍 " + CONFIG.ubicacion;
$("#pie-nombre").textContent = CONFIG.nombreNegocio;
if (CONFIG.instagram) $("#ig").href = CONFIG.instagram; else $("#ig").remove();

// ---------- Menú ----------
function slug(s) { return s.toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "-"); }

function renderMenu() {
  $("#categorias").innerHTML = PRODUCTOS.map((c) => `<a href="#${slug(c.categoria)}">${c.categoria}</a>`).join("");
  $("#menu").innerHTML = PRODUCTOS.map((c) => `
    <h2 id="${slug(c.categoria)}">${c.categoria}</h2>
    <div class="grid">${c.items.map(card).join("")}</div>
  `).join("");
}

function card(p) {
  const cant = carrito[p.id] || 0;
  let accion;
  if (!p.disponible) accion = `<span class="badge">Agotado</span>`;
  else if (cant === 0) accion = `<button class="agregar" data-mas="${p.id}">Agregar</button>`;
  else accion = `<div class="contador"><button data-menos="${p.id}" aria-label="Quitar">−</button><span>${cant}</span><button data-mas="${p.id}" aria-label="Sumar">+</button></div>`;
  return `
    <article class="card ${p.disponible ? "" : "agotado"}">
      ${p.imagen ? `<img src="${p.imagen}" alt="${p.nombre}" loading="lazy">` : ""}
      <h3>${p.nombre}</h3>
      <p>${p.descripcion || ""}</p>
      <div class="pie-card"><span class="precio">${precioDe(p)}</span>${accion}</div>
    </article>`;
}

$("#menu").addEventListener("click", (e) => {
  const mas = e.target.dataset.mas, menos = e.target.dataset.menos;
  if (mas) carrito[mas] = (carrito[mas] || 0) + 1;
  if (menos) { carrito[menos]--; if (carrito[menos] <= 0) delete carrito[menos]; }
  if (mas || menos) { renderMenu(); actualizarBarra(); }
});

// ---------- Carrito ----------
function lineas() { return Object.entries(carrito).map(([id, cant]) => ({ p: porId[id], cant })); }
function total() { return lineas().reduce((t, l) => t + l.p.precio * l.cant, 0); }

function actualizarBarra() {
  const cant = Object.values(carrito).reduce((a, b) => a + b, 0);
  $("#barra").hidden = cant === 0 || !$("#checkout").hidden;
  $("#cant").textContent = `${cant} ${cant === 1 ? "producto" : "productos"}`;
  $("#total").textContent = pesos(total());
}

function mostrarCheckout(si) {
  $("#checkout").hidden = !si;
  $("#menu").hidden = si;
  $("#categorias").hidden = si;
  if (si) {
    $("#resumen").innerHTML = lineas().map((l) => `<li><span>${l.cant} × ${l.p.nombre}</span><span>${precioDe(l.p, l.cant)}</span></li>`).join("");
    $("#total-checkout").textContent = pesos(total());
    window.scrollTo({ top: $("#checkout").offsetTop - 10, behavior: "smooth" });
  }
  actualizarBarra();
}
$("#ver-pedido").onclick = () => mostrarCheckout(true);
$("#volver").onclick = () => mostrarCheckout(false);

// ---------- Formulario ----------
const entregas = [];
if (CONFIG.retiro) entregas.push("Retiro");
if (CONFIG.envio) entregas.push("Envío a domicilio");
$("#entrega-opciones").innerHTML = entregas.map((e, i) =>
  `<label><input type="radio" name="entrega" value="${e}" ${i === 0 ? "checked" : ""} required> ${e}</label>`).join("");
$("#entrega-opciones").addEventListener("change", (e) => {
  const envio = e.target.value === "Envío a domicilio";
  $("#direccion-box").hidden = !envio;
  $("#form").direccion.required = envio;
});
$("#pago").innerHTML = CONFIG.pagos.map((p) => `<option>${p}</option>`).join("");
$("#form").fecha.min = new Date().toISOString().slice(0, 10);

$("#form").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  const [y, m, d] = (f.get("fecha") || "").split("-");
  const msg = [
    `¡Hola Agus! Quiero hacer un pedido en ${CONFIG.nombreNegocio} 🧁`,
    "",
    ...lineas().map((l) => `• ${l.cant} × ${l.p.nombre} — ${precioDe(l.p, l.cant)}`),
    "",
    `*Total: ${pesos(total())}*${lineas().some((l) => l.p.consultar) ? " + productos a consultar" : ""}`,
    "",
    `👤 ${f.get("nombre")}`,
    `📞 ${f.get("telefono")}`,
    `🚚 ${f.get("entrega")}${f.get("entrega") === "Envío a domicilio" ? `: ${f.get("direccion")}` : ""}`,
    `📅 ${d}/${m}/${y}${f.get("hora") ? ` a las ${f.get("hora")}` : ""}`,
    `💳 ${f.get("pago")}`,
    f.get("notas") ? `📝 ${f.get("notas")}` : "",
  ].filter((x, i, arr) => x !== "" || arr[i - 1] !== "").join("\n");
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
});

renderMenu();
actualizarBarra();
