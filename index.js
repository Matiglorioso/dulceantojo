// ─── Config centralizado (escalable: WhatsApp hoy, API después) ───
const CONFIG = {
  WHATSAPP_TO: "5493515147985",
  minLeadDays: 2,
  PRODUCTS_URL: "./products.json",
  // Placeholders para futuro backend:
  // API_ORDERS_URL: "",
  // USE_API: false,
};

// DOM
const gridTartas = document.getElementById("grid-tartas");
const gridBudines = document.getElementById("grid-budines");
const dlg = document.getElementById("dlg");
const closeBtn = document.getElementById("closeBtn");
const orderForm = document.getElementById("orderForm");
const cartItemsEl = document.getElementById("cartItems");
const cartIcon = document.getElementById("cartIcon");
const cartBadge = document.getElementById("cartBadge");
const siteHeader = document.querySelector(".site-header");
const totalAmountEl = document.getElementById("totalAmount");
const submitOrderBtn = document.getElementById("submitOrderBtn");

const addrWrap = document.getElementById("addrWrap");
const addressEl = document.getElementById("address");
const hintEl = document.getElementById("hint");
const thankYouDlg = document.getElementById("thankYouDlg");
const thankYouCloseBtn = document.getElementById("thankYouCloseBtn");
const thankYouSummary = document.getElementById("thankYouSummary");
const imageLightbox = document.getElementById("imageLightbox");
const lightboxCarousel = imageLightbox && imageLightbox.querySelector(".lightbox-carousel");
const lightboxSlides = imageLightbox && imageLightbox.querySelector(".lightbox-slides");
const lightboxImg1 = document.getElementById("lightboxImg1");
const lightboxImg2 = document.getElementById("lightboxImg2");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
const lightboxDotsEl = document.getElementById("lightboxDots");
let PRODUCTS = {
  tartas: [],
  budines: [],
};
let CART = []; // Carrito de compras

// Helpers
const money = (n) => new Intl.NumberFormat("es-AR").format(n);

function renderSection(grid, products) {
  grid.innerHTML = "";
  products.forEach((p) => {
    const item = document.createElement("div");
    item.className = "menu-item";
    const hasImg = !!p.image;
    const hasBadge = !!p.badge;
    const imgBlock = hasImg
      ? (hasBadge
        ? `<div class="menu-item-img-wrap"><img class="menu-item-img" src="${p.image}" alt="${p.name}" loading="lazy" data-src="${p.image}" /><span class="menu-item-badge">${p.badge}</span></div>`
        : `<img class="menu-item-img" src="${p.image}" alt="${p.name}" loading="lazy" data-src="${p.image}" />`)
      : "";
    const badgeBlock = !hasImg && hasBadge ? `<span class="menu-item-badge">${p.badge}</span>` : "";
    item.innerHTML = `
      ${imgBlock}
      <div class="menu-header">
        <div class="menu-title-desc">
          ${badgeBlock}
          <div class="menu-title-row">
            <strong class="menu-title">${p.name}</strong>
            <span class="menu-price">$ ${money(p.price)}</span>
          </div>
          <div class="menu-desc">${p.desc}</div>
        </div>
      </div>
      <div class="menu-footer">
        <div class="counter">
          <button class="counter-btn" type="button" data-action="minus" data-id="${p.id}">−</button>
          <input class="counter-input" type="number" min="1" value="1" data-id="${p.id}" readonly />
          <button class="counter-btn" type="button" data-action="plus" data-id="${p.id}">+</button>
        </div>
        <button class="btn primary btn-add" data-id="${p.id}" aria-label="Agregar al carrito"><span class="btn-add-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></span><span class="btn-add-text">Agregar</span></button>
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
      addToCart(id, qty, btn);
    });
  });
}

function render() {
  renderSection(gridTartas, PRODUCTS.tartas);
  renderSection(gridBudines, PRODUCTS.budines);
}

function addToCart(productId, quantity, addToCartBtn) {
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

  if (addToCartBtn) {
    addToCartBtn.classList.add("added");
    setTimeout(() => addToCartBtn.classList.remove("added"), 400);
  }

  flyToCart(product, addToCartBtn);
  updateCartUI();
}

function flyToCart(product, addToCartBtn) {
  if (!cartIcon) return;

  const menuItem = addToCartBtn ? addToCartBtn.closest(".menu-item") : null;
  const sourceImg = menuItem ? menuItem.querySelector(".menu-item-img") : null;
  const size = 52;

  const flyEl = document.createElement("div");
  flyEl.className = "fly-to-cart";
  flyEl.setAttribute("aria-hidden", "true");

  if (sourceImg && product.image) {
    const img = document.createElement("img");
    img.src = product.image;
    img.alt = "";
    img.width = size;
    img.height = size;
    flyEl.appendChild(img);
  } else {
    flyEl.classList.add("fly-to-cart-placeholder");
    flyEl.textContent = product.name.charAt(0).toUpperCase();
  }

  const sourceRect = sourceImg ? sourceImg.getBoundingClientRect() : addToCartBtn.getBoundingClientRect();
  const destRect = cartIcon.getBoundingClientRect();

  const startX = sourceRect.left + sourceRect.width / 2 - size / 2;
  const startY = sourceRect.top + sourceRect.height / 2 - size / 2;
  const endX = destRect.left + destRect.width / 2 - size / 2;
  const endY = destRect.top + destRect.height / 2 - size / 2;
  const dx = endX - startX;
  const dy = endY - startY;

  flyEl.style.cssText = `
    position: fixed;
    left: ${startX}px;
    top: ${startY}px;
    width: ${size}px;
    height: ${size}px;
    z-index: 9999;
    pointer-events: none;
    transform: translate(0, 0) scale(1);
    transition: transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  `;

  document.body.appendChild(flyEl);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      flyEl.style.transform = `translate(${dx}px, ${dy}px) scale(0.3)`;
    });
  });

  let done = false;
  const onEnd = () => {
    if (done) return;
    done = true;
    flyEl.remove();
    if (cartIcon) {
      cartIcon.classList.remove("cart-bump");
      void cartIcon.offsetWidth;
      cartIcon.classList.add("cart-bump");
      setTimeout(() => cartIcon.classList.remove("cart-bump"), 450);
    }
  };

  flyEl.addEventListener("transitionend", onEnd);
  setTimeout(onEnd, 620);
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
const thankYouCta = document.getElementById("thankYouCta");
if (thankYouCta) {
  thankYouCta.addEventListener("click", () => thankYouDlg.close());
}

const headerMenuBtn = document.getElementById("headerMenuBtn");
if (headerMenuBtn) {
  headerMenuBtn.addEventListener("click", () => {
    document.getElementById("productos").scrollIntoView({ behavior: "smooth" });
  });
}

// Lightbox: abrir imagen de producto al tocar/clicar la miniatura
function getSecondImagePath(path) {
  if (!path) return null;
  if (/2\.(jpe?g)$/i.test(path)) return path.replace(/2\.(jpe?g)$/i, ".$1");
  return path.replace(/(\.(jpe?g))$/i, "2$1");
}

let lightboxSlideIndex = 0;
let lightboxTotalSlides = 1;
const LIGHTBOX_SLIDE_GAP_PX = 20;

function updateLightboxCarousel() {
  if (!lightboxSlides || lightboxTotalSlides <= 1) return;
  const offsetPx = lightboxSlideIndex * LIGHTBOX_SLIDE_GAP_PX;
  lightboxSlides.style.transform = `translateX(calc(-${lightboxSlideIndex * 100}% - ${offsetPx}px))`;
  if (lightboxDotsEl) {
    lightboxDotsEl.querySelectorAll(".dot").forEach((d, i) => {
      d.classList.toggle("active", i === lightboxSlideIndex);
      d.setAttribute("aria-current", i === lightboxSlideIndex ? "true" : "false");
    });
  }
  if (lightboxPrev) {
    lightboxPrev.classList.toggle("lightbox-arrow-visible", lightboxSlideIndex >= 1);
  }
  if (lightboxNext) {
    lightboxNext.classList.toggle("lightbox-arrow-visible", lightboxSlideIndex === 0);
  }
}

function openImageLightbox(src, alt, secondSrc) {
  if (!lightboxImg1 || !imageLightbox) return;
  const hasSecond = Boolean(secondSrc);
  lightboxImg1.src = src;
  lightboxImg1.alt = alt || "";
  if (lightboxImg2) {
    if (hasSecond) {
      lightboxImg2.src = secondSrc;
      lightboxImg2.alt = alt ? `${alt} (2)` : "";
      lightboxImg2.style.display = "";
    } else {
      lightboxImg2.removeAttribute("src");
      lightboxImg2.style.display = "none";
    }
  }
  lightboxSlideIndex = 0;
  lightboxTotalSlides = hasSecond ? 2 : 1;
  if (lightboxSlides) {
    lightboxSlides.style.transform = hasSecond ? "" : "translateX(0)";
  }
  if (lightboxCarousel) {
    lightboxCarousel.classList.toggle("is-single", !hasSecond);
  }
  if (lightboxDotsEl) {
    lightboxDotsEl.innerHTML = "";
    if (hasSecond) {
      for (let i = 0; i < 2; i++) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "dot" + (i === 0 ? " active" : "");
        dot.setAttribute("aria-label", `Imagen ${i + 1} de 2`);
        dot.setAttribute("aria-current", i === 0 ? "true" : "false");
        dot.addEventListener("click", () => {
          lightboxSlideIndex = i;
          updateLightboxCarousel();
        });
        lightboxDotsEl.appendChild(dot);
      }
    }
  }
  updateLightboxCarousel();
  imageLightbox.classList.add("is-open");
  imageLightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeImageLightbox() {
  if (!imageLightbox) return;
  imageLightbox.classList.remove("is-open");
  imageLightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

if (imageLightbox) {
  const backdrop = imageLightbox.querySelector(".lightbox-backdrop");
  if (lightboxClose) lightboxClose.addEventListener("click", closeImageLightbox);
  if (backdrop) backdrop.addEventListener("click", closeImageLightbox);
  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", (e) => {
      e.stopPropagation();
      if (lightboxTotalSlides <= 1) return;
      lightboxSlideIndex = lightboxSlideIndex === 0 ? lightboxTotalSlides - 1 : lightboxSlideIndex - 1;
      updateLightboxCarousel();
    });
  }
  if (lightboxNext) {
    lightboxNext.addEventListener("click", (e) => {
      e.stopPropagation();
      if (lightboxTotalSlides <= 1) return;
      lightboxSlideIndex = lightboxSlideIndex >= lightboxTotalSlides - 1 ? 0 : lightboxSlideIndex + 1;
      updateLightboxCarousel();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (!imageLightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") {
      closeImageLightbox();
      return;
    }
    if (lightboxTotalSlides > 1) {
      if (e.key === "ArrowLeft") {
        lightboxSlideIndex = lightboxSlideIndex === 0 ? lightboxTotalSlides - 1 : lightboxSlideIndex - 1;
        updateLightboxCarousel();
      } else if (e.key === "ArrowRight") {
        lightboxSlideIndex = lightboxSlideIndex >= lightboxTotalSlides - 1 ? 0 : lightboxSlideIndex + 1;
        updateLightboxCarousel();
      }
    }
  });
}
function hasSecondImage(dataSrc) {
  if (!dataSrc) return false;
  const noSecond = ["keylime", "choco", "pastafrola"];
  return !noSecond.some((name) => dataSrc.toLowerCase().includes(name));
}

function handleProductImageOpen(e) {
  const img = e.target && e.target.classList.contains("menu-item-img") ? e.target : null;
  if (!img || !img.src) return;
  e.preventDefault();
  const dataSrc = img.getAttribute("data-src");
  const secondSrc = dataSrc && hasSecondImage(dataSrc) ? getSecondImagePath(dataSrc) : null;
  openImageLightbox(img.src, img.alt, secondSrc);
}
document.addEventListener("click", handleProductImageOpen);
document.addEventListener("touchend", (e) => {
  if (e.target && e.target.classList.contains("menu-item-img")) {
    handleProductImageOpen(e);
    e.preventDefault();
  }
}, { passive: false });

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
    initRadioButtons();
    dlg.showModal();
  }
});

// Scroll suave para enlaces internos (fajas y menú categorías)
document.querySelectorAll(".products-faja-link, .nav-categories-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (href && href.startsWith("#")) {
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  });
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

  const totalPrice = CART.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // Payload de pedido reutilizable (WhatsApp hoy; API/DB después)
  const orderPayload = {
    customer: { name, phone },
    delivery: { type: delivery, address: delivery === "Envío" ? address.trim() : null },
    payment,
    items: CART.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: item.qty,
      total: item.price * item.qty,
    })),
    total: totalPrice,
    notes: notes.trim() || null,
  };

  // Envío por WhatsApp (cuando tengas API: enviar orderPayload a CONFIG.API_ORDERS_URL)
  const productLines = orderPayload.items.map(
    (item) => `• ${item.name} x${item.qty} = $${money(item.total)}`,
  );
  const lines = [
    "Hola! Quiero hacer un pedido en *Dulce Antojo* 💕",
    ...productLines,
    `• Entrega: ${orderPayload.delivery.type}`,
    orderPayload.delivery.address ? `• Dirección: ${orderPayload.delivery.address}` : null,
    `• Nombre: ${orderPayload.customer.name}`,
    `• Mi WhatsApp: ${orderPayload.customer.phone}`,
    `• Forma de pago: ${orderPayload.payment}`,
    `• Total: $${money(orderPayload.total)}`,
    orderPayload.notes ? `• Notas: ${orderPayload.notes}` : null,
  ].filter(Boolean);
  const text = encodeURIComponent(lines.join("\n"));
  const waUrl = `https://wa.me/${CONFIG.WHATSAPP_TO}?text=${text}`;

  // Estado de carga en el botón
  if (submitOrderBtn) {
    submitOrderBtn.classList.add("is-loading");
    submitOrderBtn.disabled = true;
  }
  window.open(waUrl, "_blank");

  // Quitar estado de carga tras un momento (WhatsApp ya abierto)
  setTimeout(() => {
    if (submitOrderBtn) {
      submitOrderBtn.classList.remove("is-loading");
      submitOrderBtn.disabled = false;
    }
  }, 1500);

  const orderSummary = orderPayload.items.map(({ name, qty, total }) => ({ name, qty, total }));
  const orderTotal = orderPayload.total;

  CART = [];
  updateCartUI();
  dlg.close();

  renderThankYouSummary(orderSummary, orderTotal);
  setTimeout(() => {
    thankYouDlg.showModal();
  }, 300);
});

// Load products
async function init() {

  try {
    const res = await fetch(CONFIG.PRODUCTS_URL, { cache: "no-store" });
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

// Banner carrusel: auto-play 3 tartas, 2 budines, 1 muffin
const bannerTrack = document.getElementById("bannerTrack");
const bannerDotsEl = document.getElementById("bannerDots");
const BANNER_SLIDES = 6;
const BANNER_INTERVAL_MS = 4500;
let bannerIndex = 0;
let bannerTimer = null;

function updateBanner() {
  if (!bannerTrack) return;
  bannerTrack.style.transform = `translateX(-${bannerIndex * 100}%)`;
  if (bannerDotsEl) {
    bannerDotsEl.querySelectorAll(".banner-dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === bannerIndex);
      dot.setAttribute("aria-current", i === bannerIndex ? "true" : "false");
    });
  }
}

function advanceBanner() {
  bannerIndex = (bannerIndex + 1) % BANNER_SLIDES;
  updateBanner();
}

function startBannerTimer() {
  stopBannerTimer();
  bannerTimer = setInterval(advanceBanner, BANNER_INTERVAL_MS);
}
function stopBannerTimer() {
  if (bannerTimer) {
    clearInterval(bannerTimer);
    bannerTimer = null;
  }
}

if (bannerTrack && bannerDotsEl) {
  for (let i = 0; i < BANNER_SLIDES; i++) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "banner-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", `Ir a imagen ${i + 1} de ${BANNER_SLIDES}`);
    dot.setAttribute("aria-current", i === 0 ? "true" : "false");
    dot.addEventListener("click", () => {
      bannerIndex = i;
      updateBanner();
      startBannerTimer();
    });
    bannerDotsEl.appendChild(dot);
  }
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReducedMotion) {
    startBannerTimer();
    const heroBanner = bannerTrack.closest(".hero-banner");
    if (heroBanner) {
      heroBanner.addEventListener("mouseenter", stopBannerTimer);
      heroBanner.addEventListener("mouseleave", startBannerTimer);
    }
  }
}
