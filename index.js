// ✅ WhatsApp destino (Argentina: 54 + 9 + área + número)
const WHATSAPP_TO = "5493512468459";

// Config: pedidos con anticipación mínima (días)
const minLeadDays = 2;

// DOM
const grid = document.getElementById("grid");
const dlg = document.getElementById("dlg");
const closeBtn = document.getElementById("closeBtn");
const orderForm = document.getElementById("orderForm");

const productEl = document.getElementById("product");
const qtyEl = document.getElementById("qty");
const dateEl = document.getElementById("date");
const deliveryEl = document.getElementById("delivery");
const addrWrap = document.getElementById("addrWrap");
const addressEl = document.getElementById("address");
const hintEl = document.getElementById("hint");

let PRODUCTS = [];

// Helpers
const money = (n) => new Intl.NumberFormat("es-AR").format(n);

function setMinDate() {
  const today = new Date();
  const minDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + minLeadDays,
  );
  dateEl.min = minDate.toISOString().slice(0, 10);
  hintEl.textContent = `Pedidos con al menos ${minLeadDays} días de anticipación (ajustable).`;
}

function render() {
  grid.innerHTML = "";
  PRODUCTS.forEach((p) => {
    const item = document.createElement("div");
    item.className = "menu-item";
    item.innerHTML = `
      <div class="menu-header">
        <div class="menu-title-desc">
          <strong class="menu-title">${p.name}</strong>
          <div class="menu-desc">${p.desc}</div>
        </div>
        <div class="menu-price">$ ${money(p.price)}</div>
      </div>
      <div class="menu-footer">
        <div class="counter">
          <button class="counter-btn" type="button" data-action="minus" data-id="${p.id}">−</button>
          <input class="counter-input" type="number" min="1" value="1" data-id="${p.id}" readonly />
          <button class="counter-btn" type="button" data-action="plus" data-id="${p.id}">+</button>
        </div>
        <button class="btn primary btn-add" data-id="${p.id}">Agregar</button>
      </div>
    `;
    grid.appendChild(item);
  });

  // Eventos para los contadores
  grid.querySelectorAll(".counter-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const input = e.target.parentElement.querySelector(".counter-input");
      const action = e.target.dataset.action;
      let val = parseInt(input.value) || 1;
      if (action === "plus") val++;
      if (action === "minus" && val > 1) val--;
      input.value = val;
    });
  });

  // Eventos para agregar al pedido
  grid.querySelectorAll("button.btn-add").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const qty = parseInt(
        btn.closest(".menu-item").querySelector(".counter-input").value,
      );
      openOrder(id, qty);
    });
  });
}

function openOrder(id, qty = 1) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return;

  productEl.value = p.name;
  qtyEl.value = qty;

  deliveryEl.value = "Retiro";
  addressEl.value = "";
  addrWrap.classList.add("hide");
  addressEl.required = false;

  dlg.showModal();
}

// Events
closeBtn.addEventListener("click", () => dlg.close());

deliveryEl.addEventListener("change", () => {
  const isShip = deliveryEl.value === "Envío";
  addrWrap.classList.toggle("hide", !isShip);
  addressEl.required = isShip;
  if (!isShip) addressEl.value = "";
});

orderForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(orderForm);
  const product = data.get("product");
  const qty = data.get("qty");
  const date = data.get("date");
  const delivery = data.get("delivery");
  const address = data.get("address") || "";
  const name = data.get("name");
  const phone = data.get("phone");
  const notes = data.get("notes") || "";

  const formattedDate = date ? date.split("-").reverse().join("/") : "";

  const lines = [
    "Hola! Quiero hacer un pedido en *Dulce Antojo* 💕",
    `• Producto: ${product}`,
    `• Cantidad: ${qty}`,
    `• Fecha: ${formattedDate}`,
    `• Entrega: ${delivery}`,
    delivery === "Envío" ? `• Dirección: ${address}` : null,
    `• Nombre: ${name}`,
    `• Mi WhatsApp: ${phone}`,
    notes.trim() ? `• Notas: ${notes.trim()}` : null,
  ].filter(Boolean);

  const text = encodeURIComponent(lines.join("\n"));
  const url = `https://wa.me/${WHATSAPP_TO}?text=${text}`;
  window.open(url, "_blank");
  dlg.close();
});

// Load products
async function init() {
  setMinDate();

  try {
    const res = await fetch("./products.json", { cache: "no-store" });
    if (!res.ok)
      throw new Error(`No se pudo cargar products.json (${res.status})`);
    PRODUCTS = await res.json();
    render();
  } catch (err) {
    grid.innerHTML = `<p class="muted">Error cargando productos. Revisá products.json o el deploy.</p>`;
    console.error(err);
  }
}

init();
