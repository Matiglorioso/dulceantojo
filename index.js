// ✅ WhatsApp destino (Argentina: 54 + 9 + área + número)
const WHATSAPP_TO = "5493512468459";

// Config: pedidos con anticipación mínima (días)
const minLeadDays = 2;

// DOM
const gridTartas = document.getElementById("grid-tartas");
const gridBudines = document.getElementById("grid-budines");
const tabBtns = document.querySelectorAll(".tab-btn");
const sectionTartas = document.getElementById("section-tartas");
const sectionBudines = document.getElementById("section-budines");
const dlg = document.getElementById("dlg");
const closeBtn = document.getElementById("closeBtn");
const orderForm = document.getElementById("orderForm");
const cartItemsEl = document.getElementById("cartItems");
const cartIcon = document.getElementById("cartIcon");
const cartBadge = document.getElementById("cartBadge");
const siteHeader = document.querySelector(".site-header");
const toastEl = document.getElementById("toast");
const totalAmountEl = document.getElementById("totalAmount");

const addrWrap = document.getElementById("addrWrap");
const addressEl = document.getElementById("address");
const hintEl = document.getElementById("hint");
const thankYouDlg = document.getElementById("thankYouDlg");
const thankYouCloseBtn = document.getElementById("thankYouCloseBtn");
const thankYouSummary = document.getElementById("thankYouSummary");
let PRODUCTS = {
  tartas: [],
  budines: [],
};
let CART = []; // Carrito de compras
let toastTimeout = null;

// Helpers
const money = (n) => new Intl.NumberFormat("es-AR").format(n);

function renderSection(grid, products) {
  grid.innerHTML = "";
  products.forEach((p) => {
    const item = document.createElement("div");
    item.className = "menu-item";
    item.innerHTML = `
      <div class="menu-header">
        <div class="menu-title-desc">
          <strong class="menu-title">${p.name}</strong>
          <div class="menu-desc">${p.desc}</div>
        </div>
      </div>
      <div class="menu-footer">
        <div class="menu-price">$ ${money(p.price)}</div>
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

function render() {
  renderSection(gridTartas, PRODUCTS.tartas);
  renderSection(gridBudines, PRODUCTS.budines);
}

function addToCart(productId, quantity) {
  // Buscar en ambas secciones
  let product = PRODUCTS.tartas.find((p) => p.id === productId);
  if (!product) {
    product = PRODUCTS.budines.find((p) => p.id === productId);
  }
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
  const total = price * quantity;

  // Crear elemento temporal para la notificación
  const tempToast = document.createElement("div");
  tempToast.className = "toast";
  tempToast.innerHTML = `
    <div class="toast-button" aria-label="Ver resumen del pedido">
      <button class="toast-close" aria-label="Cerrar">✕</button>
      <div class="toast-body">
        <span class="toast-label">Agregado al carrito</span>
        <span class="toast-product">${productName}</span>
        <span class="toast-detail">x${quantity} · $ ${money(total)}</span>
      </div>
    </div>
  `;
  document.body.appendChild(tempToast);

  // Función para cerrar el toast
  const closeToast = () => {
    tempToast.classList.remove("show");
    setTimeout(() => {
      tempToast.remove();
    }, 400);
  };

  // Evento del botón X
  tempToast.querySelector(".toast-close").addEventListener("click", (e) => {
    e.stopPropagation();
    closeToast();
  });

  // Evento para hacer clicable todo el toast y abrir el modal
  tempToast.querySelector(".toast-button").addEventListener("click", (e) => {
    e.preventDefault();
    closeToast();
    if (CART.length > 0) {
      renderCart();
      initRadioButtons(); // Inicializar radio buttons
      dlg.showModal();
    }
  });

  // Trigger animación
  setTimeout(() => {
    tempToast.classList.add("show");
  }, 10);

  // Remover después de 5 segundos
  setTimeout(() => {
    closeToast();
  }, 5000);
}

function updateCartUI() {
  // Calcular cantidad total de productos
  const totalItems = CART.reduce((sum, item) => sum + item.qty, 0);

  // Actualizar badge del carrito
  cartBadge.textContent = totalItems;
  cartBadge.style.display = totalItems > 0 ? "flex" : "none";
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
        <input type="number" class="qty-input" value="${item.qty}" data-id="${item.id}" min="1" />
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

  // Eventos para cambio directo en el input
  cartItemsEl.querySelectorAll(".qty-input").forEach((input) => {
    input.addEventListener("change", () => {
      const id = input.dataset.id;
      const qty = parseInt(input.value) || 1;
      const item = CART.find((x) => x.id === id);
      if (!item) return;

      if (qty < 1) {
        input.value = 1;
        item.qty = 1;
      } else {
        item.qty = qty;
      }

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

function renderThankYouSummary(orderSummary, total) {
  thankYouSummary.innerHTML = `
    <h3>Resumen del pedido</h3>
    ${orderSummary.map(item => `
      <div class="thank-you-summary-item">
        <span>${item.name} x${item.qty}</span>
        <span>$ ${money(item.total)}</span>
      </div>
    `).join('')}
    <div class="thank-you-summary-item">
      <span>Total</span>
      <span>$ ${money(total)}</span>
    </div>
  `;
}

// Events
closeBtn.addEventListener("click", () => dlg.close());
thankYouCloseBtn.addEventListener("click", () => thankYouDlg.close());

// Cerrar modal del carrito al hacer clic fuera
dlg.addEventListener("click", (e) => {
  if (e.target === dlg) {
    dlg.close();
  }
});

// Cerrar modal de agradecimiento al hacer clic fuera
thankYouDlg.addEventListener("click", (e) => {
  if (e.target === thankYouDlg) {
    thankYouDlg.close();
  }
});

// Abrir modal con el icono del carrito
cartIcon.addEventListener("click", () => {
  if (CART.length > 0) {
    renderCart();
    initRadioButtons(); // Inicializar radio buttons
    dlg.showModal();
  }
});

// Inicializar radio buttons - asegurar que ninguno esté seleccionado por defecto
function initRadioButtons() {
  // Deseleccionar todos los radio buttons
  document.querySelectorAll('input[type="radio"][name="delivery"]').forEach(radio => {
    radio.checked = false;
  });
  document.querySelectorAll('input[type="radio"][name="payment"]').forEach(radio => {
    radio.checked = false;
  });
  
  // Ocultar campo de dirección inicialmente
  addrWrap.classList.add("hide");
  addressEl.required = false;
  addressEl.value = "";
  
  // Agregar listeners para mostrar/ocultar dirección según entrega
  document.querySelectorAll('input[type="radio"][name="delivery"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const isShip = radio.value === "Envío";
      if (addrWrap) {
        addrWrap.classList.toggle("hide", !isShip);
        addressEl.required = isShip;
        if (!isShip && addressEl) addressEl.value = "";
      }
    });
  });
}

orderForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(orderForm);
  
  // Obtener valores de los radio buttons
  const delivery = data.get("delivery");
  const payment = data.get("payment");
  
  // Validar que se hayan seleccionado los radio buttons
  if (!delivery) {
    alert("Por favor selecciona una opción de entrega");
    return;
  }
  if (!payment) {
    alert("Por favor selecciona una forma de pago");
    return;
  }
  
  const address = data.get("address") || "";
  const name = data.get("name").trim();
  const phone = data.get("phone").trim();
  const notes = data.get("notes") || "";

  // Validar nombre (mínimo 3 caracteres, solo letras)
  if (name.length < 3) {
    alert("El nombre debe tener al menos 3 caracteres");
    return;
  }
  if (!/^[a-zA-Záéíóúñ\s]+$/.test(name)) {
    alert("El nombre solo puede contener letras y espacios");
    return;
  }

  // Validar WhatsApp (solo números)
  if (!/^[0-9]+$/.test(phone)) {
    alert("El WhatsApp solo puede contener números");
    return;
  }
  if (phone.length < 7) {
    alert("Por favor ingresa un número de WhatsApp válido");
    return;
  }
  
  // Validar dirección si es envío
  if (delivery === "Envío" && !address.trim()) {
    alert("Por favor ingresa la dirección de entrega");
    return;
  }

  // Calcular total del pedido
  const totalPrice = CART.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // Crear líneas de productos
  const productLines = CART.map(
    (item) => `• ${item.name} x${item.qty} = $${money(item.price * item.qty)}`,
  );

  const lines = [
    "Hola! Quiero hacer un pedido en *Dulce Antojo* 💕",
    ...productLines,
    `• Entrega: ${delivery}`,
    delivery === "Envío" && address ? `• Dirección: ${address}` : null,
    `• Nombre: ${name}`,
    `• Mi WhatsApp: ${phone}`,
    `• Forma de pago: ${payment}`,
    `• Total: $${money(totalPrice)}`,
    notes.trim() ? `• Notas: ${notes.trim()}` : null,
  ].filter(Boolean);

  const text = encodeURIComponent(lines.join("\n"));
  const url = `https://wa.me/${WHATSAPP_TO}?text=${text}`;
  window.open(url, "_blank");

  // Guardar resumen del pedido antes de limpiar el carrito
  const orderSummary = CART.map(item => ({
    name: item.name,
    qty: item.qty,
    price: item.price,
    total: item.price * item.qty
  }));
  const orderTotal = totalPrice;

  // Limpiar carrito después de enviar
  CART = [];
  updateCartUI();
  dlg.close();
  
  // Mostrar resumen en el modal de agradecimiento
  renderThankYouSummary(orderSummary, orderTotal);
  
  // Mostrar modal de agradecimiento después de cerrar el modal del carrito
  setTimeout(() => {
    thankYouDlg.showModal();
  }, 300);
});

// Tab Handler
function initTabs() {
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabName = btn.dataset.tab;

      // Remover clase active de todos los botones
      tabBtns.forEach((b) => b.classList.remove("active"));
      // Agregar clase active al botón clickeado
      btn.classList.add("active");

      // Ocultar todas las secciones
      sectionTartas.classList.remove("active");
      sectionBudines.classList.remove("active");

      // Mostrar la sección correspondiente
      if (tabName === "tartas") {
        sectionTartas.classList.add("active");
      } else if (tabName === "budines") {
        sectionBudines.classList.add("active");
      }
    });
  });
}

// Los radio buttons ya no necesitan inicialización especial aquí
// La función initRadioButtons() se llama cuando se abre el modal

// Load products
async function init() {
  initTabs();

  try {
    const res = await fetch("./products.json", { cache: "no-store" });
    if (!res.ok)
      throw new Error(`No se pudo cargar products.json (${res.status})`);
    PRODUCTS = await res.json();
    render();
  } catch (err) {
    const errorMsg = `<p class="muted">Error cargando productos. Revisá products.json o el deploy.</p>`;
    gridTartas.innerHTML = errorMsg;
    gridBudines.innerHTML = errorMsg;
    console.error(err);
  }
}

init();

// Header se contrae al hacer scroll
const SCROLL_THRESHOLD = 60;
function updateHeaderScroll() {
  if (siteHeader) {
    if (window.scrollY > SCROLL_THRESHOLD) {
      siteHeader.classList.add("scrolled");
    } else {
      siteHeader.classList.remove("scrolled");
    }
  }
}
window.addEventListener("scroll", updateHeaderScroll, { passive: true });
updateHeaderScroll(); // estado inicial
