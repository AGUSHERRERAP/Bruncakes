// ============ Utilidades ============
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const pesos = (n) => "$" + n.toLocaleString("es-AR");
const porId = Object.fromEntries(PRODUCTOS.map((p) => [p.id, p]));
const fotoDe = (p) => p.img || IMAGENES[(p.collage || [])[0]] || "img/logo.jpg";

// Opciones de un producto, incluida la "Unidad" (individuales)
function opcionesDe(p) {
  const ops = (p.opciones || []).map((o, i) => ({ key: String(i), nombre: o.nombre, precio: o.precio }));
  if ("unidad" in p) ops.push({ key: "u", nombre: "Unidad", precio: p.unidad, proximamente: p.unidad == null });
  return ops;
}
const opcion = (p, key) => opcionesDe(p).find((o) => o.key === key);

// ============ Carrito (se guarda en el navegador) ============
let carrito = {}; // "id|key" -> cantidad
try { carrito = JSON.parse(localStorage.getItem("brun-carrito") || "{}"); } catch {}
function guardar() { try { localStorage.setItem("brun-carrito", JSON.stringify(carrito)); } catch {} }

function lineas() {
  return Object.entries(carrito).map(([k, cant]) => {
    const [id, key] = k.split("|");
    const p = porId[id], o = p && opcion(p, key);
    return p && o && !o.proximamente && p.disponible ? { k, p, o, cant } : null;
  }).filter(Boolean);
}
const total = () => lineas().reduce((t, l) => t + l.o.precio * l.cant, 0);
const cantidad = () => lineas().reduce((t, l) => t + l.cant, 0);

function sumar(k, n) {
  carrito[k] = (carrito[k] || 0) + n;
  if (carrito[k] <= 0) delete carrito[k];
  guardar(); actualizarBoton();
}

// ============ Textos fijos ============
$$("[data-ig]").forEach((a) => { a.href = CONFIG.instagram; a.textContent = "Instagram " + CONFIG.instagramUsuario; });
$$("[data-wa]").forEach((a) => { a.href = `https://wa.me/${CONFIG.whatsapp}`; a.textContent = "WhatsApp " + CONFIG.whatsappVisible; });
$("#pie-ubicacion").textContent = "📍 " + CONFIG.ubicacion;
$("#hero-pills").innerHTML = CATEGORIAS.map((c) => `<a class="pill" href="#${c.id}">${c.nombre}</a>`).join("");

// ============ Menú ============
function tarjeta(p) {
  const ops = opcionesDe(p).filter((o) => !o.proximamente);
  const desde = ops.length ? Math.min(...ops.map((o) => o.precio)) : null;
  const visual = p.collage
    ? `<div class="collage">${p.collage.map((c) => `<div class="aro"><img src="${IMAGENES[c]}" alt="" loading="lazy"></div>`).join("")}</div>`
    : `<div class="aro foto"><img src="${p.img}" alt="${p.nombre}" loading="lazy"></div>`;
  const precio = p.soloEn
    ? `<span class="precio-desde">Solo en <b>${porId[p.soloEn].nombre}</b></span>`
    : desde != null ? `<span class="precio-desde">${ops.length > 1 ? "Desde " : ""}<b>${pesos(desde)}</b></span>` : "";
  return `
    <button class="tarjeta ${p.disponible ? "" : "agotada"}" data-abrir="${p.id}">
      <span class="pill chica etiqueta">${p.etiqueta}</span>
      ${p.disponible ? `<span class="mas" aria-hidden="true">+</span>` : `<span class="cinta">Agotado por ahora</span>`}
      <h3 class="display">${p.nombre}</h3>
      <p>${p.desc}</p>
      ${visual}
      ${precio}
    </button>`;
}

function renderMenu() {
  const hayIndividualesPronto = PRODUCTOS.some((p) => p.cat === "alfajores" && "unidad" in p && p.unidad == null);
  $("#menu").innerHTML = CATEGORIAS.map((c) => `
    <section class="seccion" id="${c.id}">
      <div class="seccion-cabecera">
        <h2 class="display">${c.nombre}</h2>
        <p class="bajada">${c.bajada}</p>
      </div>
      ${c.id === "alfajores" && hayIndividualesPronto ? `
        <div class="banner-individuales"><span style="font-size:1.8rem">✨</span>
          <div><span class="display">Próximamente</span>Alfajores por unidad. Por ahora, en cajas.</div></div>` : ""}
      <div class="grilla">${PRODUCTOS.filter((p) => p.cat === c.id).map(tarjeta).join("")}</div>
    </section>`).join("");
  $("#tabs").innerHTML = CATEGORIAS.map((c) => `<a href="#${c.id}" data-tab="${c.id}">${c.nombre}</a>`).join("")
    + `<a href="#quiz" data-tab="quiz">¿Qué alfajor sos?</a>`;
  observarRevelar();
}

$("#menu").addEventListener("click", (e) => {
  const b = e.target.closest("[data-abrir]");
  if (b) abrirProducto(b.dataset.abrir);
});

// Tab activa según la sección visible
const spy = new IntersectionObserver((entradas) => {
  entradas.forEach((en) => {
    if (!en.isIntersecting) return;
    $$("#tabs a").forEach((a) => a.classList.toggle("activa", a.dataset.tab === en.target.id));
    const activa = $(`#tabs a[data-tab="${en.target.id}"]`), nav = $("#tabs");
    if (activa) nav.scrollTo({ left: activa.offsetLeft - nav.clientWidth / 2 + activa.clientWidth / 2, behavior: "smooth" });
  });
}, { rootMargin: "-45% 0px -50% 0px" });

function observarRevelar() {
  [...CATEGORIAS.map((c) => $("#" + c.id)), $("#quiz")].forEach((s) => s && spy.observe(s));
}

// ============ Hojas (producto / carrito) ============
let hojaAbierta = null, ultimoFoco = null;
function abrirHoja(id) {
  cerrarHoja(true);
  ultimoFoco = document.activeElement;
  hojaAbierta = $("#" + id);
  $("#velo").hidden = false; hojaAbierta.hidden = false;
  document.body.style.overflow = "hidden";
  $("#carrito-btn").hidden = true;
  setTimeout(() => $(".cerrar", hojaAbierta).focus({ preventScroll: true }), 50);
}
function cerrarHoja(silencioso) {
  if (!hojaAbierta) return;
  hojaAbierta.hidden = true; $("#velo").hidden = true; hojaAbierta = null;
  document.body.style.overflow = "";
  actualizarBoton();
  if (!silencioso && ultimoFoco) ultimoFoco.focus({ preventScroll: true });
}
$("#velo").onclick = () => cerrarHoja();
$$("[data-cerrar]").forEach((b) => (b.onclick = () => cerrarHoja()));
document.addEventListener("keydown", (e) => e.key === "Escape" && cerrarHoja());

// Detalle de producto
let sel = { id: null, key: null, cant: 1 };
function abrirProducto(id) {
  const p = porId[id];
  const ops = opcionesDe(p);
  const primera = ops.find((o) => !o.proximamente);
  sel = { id, key: primera ? primera.key : null, cant: 1 };

  const visual = p.collage
    ? `<div class="hp-collage">${p.collage.map((c) => `<div class="aro"><img src="${IMAGENES[c]}" alt=""></div>`).join("")}</div>`
    : `<div class="aro aro-celeste hp-foto"><img src="${p.img}" alt="${p.nombre}"></div>`;
  const sabores = p.sabores ? `<div class="sabores">${p.sabores.map((s) => `
      <div class="sabor"><div class="aro"><img src="${s.img}" alt=""></div><div><b>${s.nombre}</b><span>${s.desc}</span></div></div>`).join("")}</div>` : "";

  let accion;
  if (!p.disponible) {
    accion = `<p class="aviso">Este producto está agotado por ahora. ¡Volvé pronto! 🤍</p>`;
  } else if (p.soloEn) {
    accion = `<button class="btn btn-bordo" style="width:100%" data-ir="${p.soloEn}">Ver ${porId[p.soloEn].nombre}</button>`;
  } else {
    accion = `
      <p class="opciones-titulo">Elegí la presentación</p>
      <div class="opciones" role="radiogroup">
        ${ops.map((o) => `
          <button class="opcion" role="radio" data-op="${o.key}" aria-checked="${o.key === sel.key}" ${o.proximamente ? "disabled" : ""}>
            <span>${o.nombre}</span>${o.proximamente ? `<span class="prox">Próximamente</span>` : `<b>${pesos(o.precio)}</b>`}
          </button>`).join("")}
      </div>
      <div class="hp-accion">
        <div class="stepper"><button data-paso="-1" aria-label="Menos">−</button><span id="hp-cant">1</span><button data-paso="1" aria-label="Más">+</button></div>
        <button class="btn btn-bordo" id="hp-agregar"></button>
      </div>`;
  }

  $("#hp-cuerpo").innerHTML = `
    ${visual}
    <span class="pill pill-crema chica">${p.etiqueta}</span>
    <h2 class="display hp-nombre" id="hp-nombre">${p.nombre}</h2>
    <p class="hp-desc">${p.desc}</p>
    ${sabores}
    ${p.nota ? `<p class="hp-nota">${p.nota}</p>` : ""}
    <p class="hp-nota">⏰ Pedilo con ${p.anticipacion} h de anticipación</p>
    ${accion}`;
  actualizarAgregar();
  abrirHoja("hoja-producto");
}

function actualizarAgregar() {
  const b = $("#hp-agregar");
  if (!b) return;
  const o = opcion(porId[sel.id], sel.key);
  $("#hp-cant").textContent = sel.cant;
  b.textContent = `Agregar · ${pesos(o.precio * sel.cant)}`;
}

$("#hp-cuerpo").addEventListener("click", (e) => {
  const op = e.target.closest("[data-op]");
  const paso = e.target.closest("[data-paso]");
  const ir = e.target.closest("[data-ir]");
  if (op && !op.disabled) {
    sel.key = op.dataset.op;
    $$(".opcion").forEach((b) => b.setAttribute("aria-checked", b === op));
    actualizarAgregar();
  }
  if (paso) { sel.cant = Math.max(1, Math.min(20, sel.cant + Number(paso.dataset.paso))); actualizarAgregar(); }
  if (ir) abrirProducto(ir.dataset.ir);
  if (e.target.closest("#hp-agregar")) agregarSeleccion();
});

function agregarSeleccion() {
  const p = porId[sel.id], o = opcion(p, sel.key);
  const foto = $("#hp-cuerpo .aro img");
  const r = foto.getBoundingClientRect();
  sumar(`${sel.id}|${sel.key}`, sel.cant);
  cerrarHoja(true);
  volarAlCarrito(fotoDe(p), r);
  toast(`¡Sumaste ${sel.cant} × ${p.nombre} (${o.nombre})! 🤍`);
}

function volarAlCarrito(src, desde) {
  const btn = $("#carrito-btn");
  const hasta = $(".carrito-cant", btn).getBoundingClientRect();
  const v = document.createElement("div");
  v.className = "vuela";
  v.innerHTML = `<img src="${src}" alt="">`;
  const x0 = desde.left + desde.width / 2 - 27, y0 = desde.top + desde.height / 2 - 27;
  v.style.left = x0 + "px"; v.style.top = y0 + "px";
  document.body.appendChild(v);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    v.style.transform = `translate(${hasta.left - x0 - 7}px, ${hasta.top - y0 - 7}px) scale(.5)`;
    v.style.opacity = ".3";
  }));
  setTimeout(() => { v.remove(); btn.classList.remove("salto"); void btn.offsetWidth; btn.classList.add("salto"); }, 700);
}

let toastT;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg; t.classList.add("ver");
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("ver"), 2400);
}

// ============ Botón y hoja del carrito ============
function actualizarBoton() {
  const n = cantidad();
  $("#carrito-btn").hidden = n === 0 || !!hojaAbierta;
  $("#carrito-cant").textContent = n;
  $("#carrito-total").textContent = pesos(total());
}
$("#carrito-btn").onclick = () => { renderCarrito(); abrirHoja("hoja-carrito"); };

function anticipacionHoras() { return Math.max(24, ...lineas().map((l) => l.p.anticipacion || 24)); }
function fechaMinima() {
  const d = new Date(); d.setDate(d.getDate() + Math.ceil(anticipacionHoras() / 24));
  return d.toISOString().slice(0, 10);
}

function renderCarrito() {
  const ls = lineas();
  if (!ls.length) { cerrarHoja(); return; }
  $("#lineas").innerHTML = ls.map((l) => `
    <li class="linea">
      <div class="aro"><img src="${fotoDe(l.p)}" alt=""></div>
      <div><b>${l.p.nombre}</b><small>${l.o.nombre} · ${pesos(l.o.precio * l.cant)}</small></div>
      <div class="stepper"><button data-linea="${l.k}" data-n="-1" aria-label="Quitar uno">${l.cant === 1 ? "🗑" : "−"}</button><span>${l.cant}</span><button data-linea="${l.k}" data-n="1" aria-label="Sumar uno">+</button></div>
    </li>`).join("");
  $("#hc-total").textContent = pesos(total());
  const h = anticipacionHoras();
  $("#aviso-anticipacion").textContent = h >= 48
    ? "🎂 Tu pedido tiene tortas o tartas: necesitamos 48 h de anticipación."
    : "⏰ Pedí con 24 h de anticipación así lo preparamos con tiempo.";
  const f = $("#form").fecha;
  f.min = fechaMinima();
  if (!f.value || f.value < f.min) f.value = f.min;
}
$("#lineas").addEventListener("click", (e) => {
  const b = e.target.closest("[data-linea]");
  if (b) { sumar(b.dataset.linea, Number(b.dataset.n)); renderCarrito(); }
});

// ============ Formulario → WhatsApp ============
const entregas = [CONFIG.retiro && "Retiro", CONFIG.envio && "Envío"].filter(Boolean);
$("#entrega").innerHTML = entregas.map((e, i) => `<label><input type="radio" name="entrega" value="${e}" ${i ? "" : "checked"}><span>${e === "Envío" ? "🚗 Envío" : "🏠 Retiro"}</span></label>`).join("");
$("#pagos").innerHTML = CONFIG.pagos.map((p, i) => `<label><input type="radio" name="pago" value="${p}" ${i ? "" : "checked"}><span>${p}</span></label>`).join("");
$("#entrega").addEventListener("change", (e) => {
  const envio = e.target.value === "Envío";
  $("#direccion-box").hidden = !envio;
  $("#form").direccion.required = envio;
});
try { $("#form").nombre.value = localStorage.getItem("brun-nombre") || ""; } catch {}

$("#form").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  try { localStorage.setItem("brun-nombre", f.get("nombre")); } catch {}
  const [y, m, d] = f.get("fecha").split("-");
  const dia = new Date(+y, m - 1, +d).toLocaleDateString("es-AR", { weekday: "long" });
  const msg = [
    `¡Hola Agus! 🤍 Soy ${f.get("nombre")} y quiero hacer este pedido:`,
    "",
    ...lineas().map((l) => `• ${l.cant} × ${l.p.nombre} (${l.o.nombre}) — ${pesos(l.o.precio * l.cant)}`),
    "",
    `*Total: ${pesos(total())}*`,
    "",
    `📅 ${dia} ${d}/${m} · ${f.get("hora")}`,
    f.get("entrega") === "Envío" ? `🚗 Envío a: ${f.get("direccion")}` : "🏠 Lo retiro",
    `💳 ${f.get("pago")}`,
    f.get("notas") ? `📝 ${f.get("notas")}` : null,
  ].filter((x) => x !== null).join("\n");
  const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
  cerrarHoja(true);
  $("#gracias-reabrir").href = url;
  $("#gracias").hidden = false;
  document.body.style.overflow = "hidden";
});
$("#gracias-ok").onclick = () => {
  $("#gracias").hidden = true;
  document.body.style.overflow = "";
  carrito = {}; guardar(); actualizarBoton();
  window.scrollTo({ top: 0 });
};

// ============ Intro con la carita (una vez por visita) ============
(function intro() {
  const el = $("#intro");
  let visto = false;
  try { visto = sessionStorage.getItem("brun-intro") === "1"; sessionStorage.setItem("brun-intro", "1"); } catch {}
  if (visto || matchMedia("(prefers-reduced-motion: reduce)").matches) { el.remove(); return; }
  const salir = () => { el.classList.add("fuera"); setTimeout(() => el.remove(), 450); };
  el.addEventListener("click", salir);
  setTimeout(salir, 1700);
})();

// ============ Quiz: ¿Qué alfajor Brün sos? ============
const PREGUNTAS = [
  { q: "Es domingo a la tarde. ¿Qué plan elegís?", r: [
    ["Sillón, manta y peli de terror", "alf-chocolate"], ["Cita con flores y todo", "alf-frutos-rojos"],
    ["Mate con la abuela", "alf-almendras"], ["Caminata por las sierras", "alf-nueces"] ] },
  { q: "¿Cómo te describen tus amigos?", r: [
    ["Intensa/o, no negocio", "alf-chocolate"], ["Romántica/o y un poco dramática/o", "alf-frutos-rojos"],
    ["Clásica/o, nunca fallo", "alf-almendras"], ["Tranqui pero con carácter", "alf-nueces"] ] },
  { q: "Elegí un color:", r: [
    ["Bordó", "alf-frutos-rojos"], ["Marrón chocolate", "alf-chocolate"],
    ["Crema", "alf-almendras"], ["Celeste", "alf-nueces"] ] },
];
const FRASES = {
  "alf-chocolate": "Intensa/o, no negociás. Sabés lo que querés y lo querés bañado en semiamargo.",
  "alf-frutos-rojos": "Romántica/o y un poco dramática/o. Tenés un corazón… de frutos rojos.",
  "alf-almendras": "Clásica/o, nunca fallás. Todos te quieren cerca.",
  "alf-nueces": "Tranqui, auténtica/o y con mucho carácter debajo de la superficie.",
};
let quizPaso = 0, votos = {};
function renderQuiz() {
  const c = $("#quiz-cuerpo");
  if (quizPaso < PREGUNTAS.length) {
    const p = PREGUNTAS[quizPaso];
    c.innerHTML = `
      <div class="quiz-progreso">${PREGUNTAS.map((_, i) => `<i class="${i <= quizPaso ? "ok" : ""}"></i>`).join("")}</div>
      <p class="quiz-pregunta">${p.q}</p>
      <div class="quiz-opciones">${p.r.map(([t, id]) => `<button data-voto="${id}">${t}</button>`).join("")}</div>`;
  } else {
    const gana = Object.entries(votos).sort((a, b) => b[1] - a[1])[0][0];
    const p = porId[gana];
    c.innerHTML = `
      <div class="quiz-resultado">
        <div class="aro aro-celeste"><img src="${p.img}" alt="${p.nombre}"></div>
        <p class="quiz-pregunta">Sos un alfajor de…</p>
        <h3 class="display">${p.nombre}</h3>
        <p>${FRASES[gana]}</p>
        <div class="acciones">
          <button class="btn btn-bordo" data-abrir-quiz="${gana}">Pedí tu caja</button>
          <button class="btn-link" data-reiniciar>Hacer el test de nuevo</button>
        </div>
      </div>`;
  }
}
$("#quiz-cuerpo").addEventListener("click", (e) => {
  const v = e.target.closest("[data-voto]");
  if (v) { votos[v.dataset.voto] = (votos[v.dataset.voto] || 0) + 1; quizPaso++; renderQuiz(); }
  const a = e.target.closest("[data-abrir-quiz]");
  if (a) abrirProducto(a.dataset.abrirQuiz);
  if (e.target.closest("[data-reiniciar]")) { quizPaso = 0; votos = {}; renderQuiz(); }
});

// Scroll suave solo al tocar un link interno
document.addEventListener("click", (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link || link.getAttribute("href") === "#") return;
  const destino = document.querySelector(link.getAttribute("href"));
  if (destino) { e.preventDefault(); destino.scrollIntoView({ behavior: "smooth" }); }
});

// ============ Inicio ============
renderMenu();
renderQuiz();
actualizarBoton();
