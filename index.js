// ✅ WhatsApp destino (Argentina: 54 + 9 + área + número)
const WHATSAPP_TO = "5493512468459";

// Config: pedidos con anticipación mínima (días)
const minLeadDays = 2;

// DOM
const grid = document.getElementById("grid");
const dlg = document.getElementById("dlg");
const closeBtn = document.getElementById("closeBtn");
const orderForm = document.getElementById("orderForm");
const cartItemsEl = document.getElementById("cartItems");
const cartSummaryEl = document.getElementById("cartSummary");
const checkoutBtn = document.getElementById("checkoutBtn");
const toastEl = document.getElementById("toast");
const totalAmountEl = document.getElementById("totalAmount");

const dateEl = document.getElementById("date");
const deliveryEl = document.getElementById("delivery");
const addrWrap = document.getElementById("addrWrap");
const addressEl = document.getElementById("address");
const hintEl = document.getElementById("hint");

let PRODUCTS = [];
let CART = []; // Carrito de compras
let toastTimeout = null;

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

  // Eventos para agregar al carrito
  grid.querySelectorAll("button.btn-add").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const qty = parseInt(
        btn.closest(".menu-item").querySelector(".counter-input").value,
      );
      addToCart(id, qty);
    });
  });
}

function addToCart(productId, quantity) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  // Buscar si el producto ya está en el carrito
  const existingItem = CART.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.qty += quantity;
  } else {
    CART.push({
      id: productId,
      name: product.name,
      price: product.price,
      qty: quantity,
    });
  }

  // Mostrar notificación
  showToast(product.name, quantity, product.price);

  updateCartUI();
}

function showToast(productName, quantity, price) {
  // Limpiar timeout anterior
  if (toastTimeout) clearTimeout(toastTimeout);

  const total = price * quantity;
  toastEl.innerHTML = `
    <div class="toast-content">
      <div>✓ Agregado al carrito</div>
      <strong>${productName}</strong>
      <div class="toast-qty">x${quantity} = $ ${money(total)}</div>
    </div>
  `;
  toastEl.classList.add("show");

  toastTimeout = setTimeout(() => {
    toastEl.classList.remove("show");
  }, 3000);
}

function updateCartUI() {
  if (CART.length === 0) {
    cartSummaryEl.classList.add("hide");
  } else {
    cartSummaryEl.classList.remove("hide");
  }
}

function renderCart() {
  cartItemsEl.innerHTML = "";
  let totalPrice = 0;

  CART.forEach((item) => {
    totalPrice += item.price * item.qty;
    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";
    itemEl.innerHTML = `
      <div class="cart-item-info">
        <strong>${item.name}</strong>
        <span>$ ${money(item.price)} x ${item.qty} = $ ${money(item.price * item.qty)}</span>
      </div>
      <div class="cart-item-actions">
        <button type="button" class="btn-qty" data-id="${item.id}" data-action="minus">−</button>
        <input type="number" value="${item.qty}" readonly />
        <button type="button" class="btn-qty" data-id="${item.id}" data-action="plus">+</button>
        <button type="button" class="btn-remove" data-id="${item.id}">✕</button>
      </div>
    `;
    cartItemsEl.appendChild(itemEl);
  });

  // Actualizar total
  totalAmountEl.textContent = money(totalPrice);

  // Eventos para modificar cantidad
  cartItemsEl.querySelectorAll(".btn-qty").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      const item = CART.find((x) => x.id === id);
      if (!item) return;

      if (action === "plus") item.qty++;
      if (action === "minus" && item.qty > 1) item.qty--;

      renderCart();
    });
  });

  // Eventos para eliminar
  cartItemsEl.querySelectorAll(".btn-remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      CART = CART.filter((x) => x.id !== id);
      updateCartUI();
      if (CART.length > 0) {
        renderCart();
      } else {
        dlg.close();
      }
    });
  });
}

// Events
closeBtn.addEventListener("click", () => dlg.close());

deliveryEl.addEventListener("change", () => {
  const isShip = deliveryEl.value === "Envío";
  addrWrap.classList.toggle("hide", !isShip);
  addressEl.required = isShip;
  if (!isShip) addressEl.value = "";
});

checkoutBtn.addEventListener("click", () => {
  renderCart();
  dlg.showModal();
});

orderForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(orderForm);
  const delivery = data.get("delivery");
  const address = data.get("address") || "";
  const name = data.get("name");
  const phone = data.get("phone");
  const payment = data.get("payment");
  const notes = data.get("notes") || "";

  // Crear líneas de productos
  const productLines = CART.map(
    (item) => `• ${item.name} x${item.qty} = $${money(item.price * item.qty)}`,
  );

  const lines = [
    "Hola! Quiero hacer un pedido en *Dulce Antojo* 💕",
    ...productLines,
    `• Entrega: ${delivery}`,
    delivery === "Envío" ? `• Dirección: ${address}` : null,
    `• Nombre: ${name}`,
    `• Mi WhatsApp: ${phone}`,
    `• Forma de pago: ${payment}`,
    notes.trim() ? `• Notas: ${notes.trim()}` : null,
  ].filter(Boolean);

  const text = encodeURIComponent(lines.join("\n"));
  const url = `https://wa.me/${WHATSAPP_TO}?text=${text}`;
  window.open(url, "_blank");

  // Limpiar carrito después de enviar
  CART = [];
  updateCartUI();
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
