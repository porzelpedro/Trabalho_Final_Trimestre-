'use strict';

// ==================== BASE DE PRODUTOS ====================
const products = [
  {
    id: 1,
    name: 'Colômbia Huila',
    price: 74.90,
    image: 'img/colombia.png',
    roast: 'Média',
    location: 'Huila, Colômbia',
    altitude: '1.700 m',
    process: 'Lavado',
    desc: 'Chocolate, caramelo e laranja. Notas intensas, origem única.'
  },
  {
    id: 2,
    name: 'Brasil Mogiana',
    price: 64.90,
    image: 'img/brasil.png',
    roast: 'Média',
    location: 'São Paulo, Brasil',
    altitude: '1.100 m',
    process: 'Natural',
    desc: 'Avelã, cacau e melado. O mais vendido da casa.'
  },
  {
    id: 3,
    name: 'Etiópia Sidamo',
    price: 92.90,
    image: 'img/etiopia.png',
    roast: 'Clara',
    location: 'Sidamo, Etiópia',
    altitude: '1.900 m',
    process: 'Lavado',
    desc: 'Jasmim, pêssego e chá preto. Acidez cítrica vibrante.'
  },
  {
    id: 4,
    name: 'Guatemala Antigua',
    price: 72.90,
    image: 'img/guatemala.png',
    roast: 'Média',
    location: 'Antigua, Guatemala',
    altitude: '1.500 m',
    process: 'Lavado',
    desc: 'Cacau e canela cercados de especiarias doces, com corpo aveludado e acidez suave. Cultivado em solo vulcânico, fica excelente na prensa francesa.'
  },
  {
    id: 5,
    name: 'Costa Rica Tarrazu',
    price: 78.90,
    image: 'img/costarica.png',
    roast: 'Média-Clara',
    location: 'Tarrazu, Costa Rica',
    altitude: '1.600 m',
    process: 'Honey',
    desc: 'Cítrico, mel e floral. Cultivado em grandes altitudes.'
  },
  {
    id: 6,
    name: 'Blend da Casa',
    price: 59.90,
    image: 'img/blend_casa.png',
    roast: 'Média-Escura',
    location: 'Várias Origens',
    altitude: 'Blend',
    process: 'Misto',
    desc: 'Equilíbrio, encorpado e final doce. Perfeito para o dia a dia.'
  },
  {
    id: 7,
    name: 'Quênia Nyeri AA',
    price: 89.90,
    image: 'img/quenia.png',
    roast: 'Média-Clara',
    location: 'Nyeri, Quênia',
    altitude: '1.800 m',
    process: 'Lavado',
    desc: 'Mirtilo, limão doce e floral. Extraordinária complexidade.'
  },
  {
    id: 8,
    name: 'Sul de Minas Amarelo',
    price: 62.90,
    image: 'img/sul_minas.png',
    roast: 'Média',
    location: 'Minas Gerais, Brasil',
    altitude: '1.200 m',
    process: 'Natural',
    desc: 'Mel, caramelo e nozes. Torra artesanal balanceada.'
  },
  {
    id: 9,
    name: 'Honduras Marcala',
    price: 82.90,
    image: 'img/honduras.png',
    roast: 'Média-Escura',
    location: 'Marcala, Honduras',
    altitude: '1.450 m',
    process: 'Lavado',
    desc: 'Jasmim, pêssego e chá preto. Orgânico e encorpado.'
  },
  {
    id: 10,
    name: 'Descafeinado Suave',
    price: 69.90,
    image: 'img/descafeinado.png',
    roast: 'Escura',
    location: 'Colômbia',
    altitude: '1.500 m',
    process: 'Swiss Water',
    desc: 'Chocolate ao leite e amêndoas. Sem cafeína, muito sabor.'
  },
  {
    id: 11,
    name: 'Blend Espresso Intenso',
    price: 64.90,
    image: 'img/espresso.png',
    roast: 'Escura',
    location: 'Brasil e Índia',
    altitude: 'Blend',
    process: 'Natural',
    desc: 'Cacau amargo, especiarias e creme denso. Ideal para espresso.'
  },
  {
    id: 12,
    name: 'Panamá Geisha',
    price: 149.90,
    image: 'img/panama.png',
    roast: 'Clara',
    location: 'Boquete, Panamá',
    altitude: '1.750 m',
    process: 'Lavado',
    desc: 'Bergamota, jasmim e chá de flor. A joia rara dos cafés.'
  }
];

// ==================== ESTADO E UTILITÁRIOS ====================
const STORAGE_KEYS = {
  cart: 'cart',
  discount: 'discountMultiplier',
  coupon: 'discountCoupon',
  lastOrder: 'lastOrder',
  lastDiscount: 'lastDiscount',
  lastPayment: 'lastPayment',
  lastOrderNumber: 'lastOrderNumber'
};

function readJSON(key, fallback) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key));
    return parsed === null ? fallback : parsed;
  } catch (error) {
    return fallback;
  }
}

function readCart() {
  const stored = readJSON(STORAGE_KEYS.cart, []);

  if (!Array.isArray(stored)) {
    return [];
  }

  return stored
    .filter(item =>
      item &&
      typeof item.name === 'string' &&
      Number.isFinite(Number(item.price))
    )
    .map(item => ({
      ...item,
      price: Number(item.price),
      quantity: Math.max(1, Math.floor(Number(item.quantity) || 1))
    }));
}

let cart = readCart();
let currentCategory = 'Todas';
let currentSearch = '';
let currentSort = 'default';

let discountMultiplier = Math.max(
  0,
  Math.min(
    0.10,
    Number(localStorage.getItem(STORAGE_KEYS.discount)) || 0
  )
);

let selectedPayment = 'pix';

function money(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(Number(value) || 0);
}

function priceNumber(value) {
  return (Number(value) || 0).toFixed(2).replace('.', ',');
}

function persistCart() {
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const countElement = document.getElementById('cart-count');

  if (countElement) {
    countElement.textContent = String(totalItems);
  }
}

function showToast(message) {
  let toast = document.getElementById('site-toast');

  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'site-toast';
    toast.className = 'site-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('visible');

  window.clearTimeout(showToast.timer);

  showToast.timer = window.setTimeout(() => {
    toast.classList.remove('visible');
  }, 2600);
}

function shippingFor(subtotal) {
  return subtotal >= 200 ? 0 : 19.90;
}

function totalFor(subtotal, discountRate) {
  return Math.max(
    0,
    subtotal + shippingFor(subtotal) - subtotal * discountRate
  );
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function imageMarkup(src, alt, className = '') {
  return `<img${className ? ` class="${className}"` : ''} src="${escapeHTML(src || '')}" alt="${escapeHTML(alt || '')}" onerror="this.style.display='none'">`;
}

// ==================== VITRINE, PESQUISA E FILTROS ====================
function setCategory(category, btnElement) {
  currentCategory = category;

  document.querySelectorAll('.filter-btn').forEach(button => {
    const isActive = button === btnElement;

    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  renderProducts();
}

function handleSearch(event) {
  currentSearch = String(event.target.value || '')
    .trim()
    .toLocaleLowerCase('pt-BR');

  renderProducts();
}

function handleSort(sortValue) {
  currentSort = sortValue;
  renderProducts();
}

function renderProducts() {
  const listCafes = document.getElementById('product-list');
  const listHome = document.getElementById('product-list-home');
  const list = listCafes || listHome;

  if (!list) {
    return;
  }

  let visibleProducts = [...products];

  if (listCafes) {
    visibleProducts = visibleProducts.filter(product => {
      const matchesCategory =
        currentCategory === 'Todas' ||
        product.roast === currentCategory;

      const searchableText = `
        ${product.name}
        ${product.desc}
        ${product.location}
        ${product.roast}
        ${product.process}
      `.toLocaleLowerCase('pt-BR');

      return matchesCategory &&
        searchableText.includes(currentSearch);
    });

    if (currentSort === 'asc') {
      visibleProducts.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'desc') {
      visibleProducts.sort((a, b) => b.price - a.price);
    } else {
      visibleProducts.sort((a, b) => a.id - b.id);
    }

    const resultCount = document.getElementById('results-count');

    if (resultCount) {
      resultCount.textContent =
        `${visibleProducts.length} ` +
        `${visibleProducts.length === 1 ? 'café encontrado' : 'cafés encontrados'}`;
    }
  } else {
    visibleProducts = visibleProducts.slice(0, 6);
  }

  if (visibleProducts.length === 0) {
    list.innerHTML = `
      <p class="empty-results">
        Nenhum café encontrado com estes filtros. Tente outra busca.
      </p>
    `;
    return;
  }

  list.innerHTML = visibleProducts.map(product => `
    <article
      class="product-card"
      tabindex="0"
      role="button"
      aria-label="Ver detalhes de ${escapeHTML(product.name)}"
      onclick="openModal(${product.id})"
      onkeydown="handleProductCardKey(event, ${product.id})"
    >
      ${imageMarkup(product.image, product.name)}

      <p class="roast-badge">
        TORRA ${escapeHTML(product.roast.toLocaleUpperCase('pt-BR'))}
      </p>

      <h3>${escapeHTML(product.name)}</h3>

      <p class="desc">
        ${escapeHTML(
          product.desc.length > 85
            ? `${product.desc.slice(0, 82)}...`
            : product.desc
        )}
      </p>

      <div class="price">${money(product.price)}</div>

      <button
        class="add-to-cart-card"
        type="button"
        onclick="event.stopPropagation(); addToCart(${product.id})"
      >
        ADICIONAR À SACOLA
      </button>
    </article>
  `).join('');
}

function handleProductCardKey(event, id) {
  if (event.target.closest('button')) {
    return;
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openModal(id);
  }
}

function openModal(id) {
  const product = products.find(item => item.id === Number(id));
  const modal = document.getElementById('product-modal');
  const details = document.getElementById('modal-details');

  if (!product || !modal || !details) {
    return;
  }

  details.innerHTML = `
    <div class="modal-img">
      ${imageMarkup(product.image, product.name)}
    </div>

    <div class="modal-info">
      <p class="eyebrow eyebrow-dark">CAFÉ ESPECIAL • 250 G</p>

      <h2>${escapeHTML(product.name)}</h2>

      <p class="modal-desc">${escapeHTML(product.desc)}</p>

      <hr>

      <div class="modal-icons-grid">
        <div>📍 ${escapeHTML(product.location)}</div>
        <div>⛰️ ${escapeHTML(product.altitude)}</div>
        <div>💧 ${escapeHTML(product.process)}</div>
        <div>🔥 Torra ${escapeHTML(product.roast)}</div>
      </div>

      <hr>

      <div class="modal-price-area">
        <span class="price">${money(product.price)}</span>
        <span class="weight">250 g • grãos inteiros</span>
      </div>

      <button
        class="add-to-cart-card"
        type="button"
        onclick="addToCart(${product.id})"
      >
        ADICIONAR À SACOLA
      </button>

      <p class="frete-gratis">
        🚚 Frete grátis em compras a partir de R$ 200,00.
      </p>
    </div>
  `;

  modal.classList.add('active');
  document.body.classList.add('modal-open');

  const closeButton = modal.querySelector('.close-btn');

  if (closeButton) {
    closeButton.focus();
  }
}

function closeModal() {
  const modal = document.getElementById('product-modal');

  if (modal) {
    modal.classList.remove('active');
  }

  document.body.classList.remove('modal-open');
}

// ==================== ASSINATURAS E CARRINHO ====================
function subscribePlan(planName, price) {
  const normalizedPlan = String(planName || '').trim();
  const amount = Number(price);

  if (!normalizedPlan || !Number.isFinite(amount) || amount <= 0) {
    return;
  }

  // O identificador estável evita adicionar o mesmo plano repetidamente.
  const planId = `plano-${normalizedPlan
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')}`;

  const itemInCart = cart.find(item => item.id === planId);

  if (!itemInCart) {
    cart.push({
      id: planId,
      name: `Assinatura ${normalizedPlan}`,
      price: amount,
      image: 'img/logo.png',
      quantity: 1,
      kind: 'subscription'
    });
  }

  persistCart();
  window.location.href = 'checkout.html';
}

function addToCart(id) {
  const product = products.find(item => item.id === Number(id));

  if (!product) {
    return;
  }

  const itemInCart = cart.find(item => item.id === product.id);

  if (itemInCart) {
    itemInCart.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
      kind: 'product'
    });
  }

  persistCart();
  closeModal();
  showToast(`${product.name} adicionado à sua sacola.`);
}

function renderCart() {
  const cartItemsDiv = document.getElementById('cart-items');
  const totalDiv = document.getElementById('total-price');

  if (!cartItemsDiv || !totalDiv) {
    return;
  }

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = `
      <div class="empty-cart">
        <p>Sua sacola está vazia.</p>
        <p>Explore os cafés e encontre o seu favorito.</p>
      </div>
    `;

    totalDiv.textContent = '0,00';

    const checkoutLink = document.getElementById('go-checkout');

    if (checkoutLink) {
      checkoutLink.classList.add('is-disabled');
      checkoutLink.setAttribute('aria-disabled', 'true');
      checkoutLink.setAttribute('tabindex', '-1');
    }

    return;
  }

  cartItemsDiv.innerHTML = cart.map((item, index) => {
    const subtotal = item.price * item.quantity;

    return `
      <div class="cart-item">
        <div class="cart-product-info">
          <strong>${escapeHTML(item.name)}</strong>
          <small>${money(item.price)} por unidade</small>
        </div>

        <label class="visually-hidden" for="quantity-${index}">
          Quantidade de ${escapeHTML(item.name)}
        </label>

        <input
          id="quantity-${index}"
          type="number"
          min="1"
          max="99"
          step="1"
          value="${item.quantity}"
          inputmode="numeric"
          onchange="changeQty(${index}, this.value)"
          aria-label="Quantidade"
        >

        <div class="cart-item-subtotal">${money(subtotal)}</div>

        <button
          class="btn-remove"
          type="button"
          onclick="removeFromCart(${index})"
        >
          Remover
        </button>
      </div>
    `;
  }).join('');

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  totalDiv.textContent = priceNumber(subtotal);

  const checkoutLink = document.getElementById('go-checkout');

  if (checkoutLink) {
    checkoutLink.classList.remove('is-disabled');
    checkoutLink.removeAttribute('aria-disabled');
    checkoutLink.removeAttribute('tabindex');
  }
}

function changeQty(index, newQty) {
  if (!cart[index]) {
    return;
  }

  const parsedQty = Math.floor(Number(newQty));

  cart[index].quantity = Number.isFinite(parsedQty)
    ? Math.min(99, Math.max(1, parsedQty))
    : 1;

  persistCart();
  renderCart();
  renderCheckoutSummary();
}

function removeFromCart(index) {
  if (index < 0 || index >= cart.length) {
    return;
  }

  const removed = cart[index];

  cart.splice(index, 1);

  persistCart();
  renderCart();
  renderCheckoutSummary();

  showToast(`${removed.name} removido da sacola.`);
}

// ==================== CUPOM E RESUMO DO CHECKOUT ====================
function applyCoupon() {
  const input = document.getElementById('coupon-input');
  const feedback = document.getElementById('coupon-feedback');

  if (!input) {
    return;
  }

  const coupon = input.value.trim().toLocaleLowerCase('pt-BR');

  if (coupon === 'cafe10') {
    discountMultiplier = 0.10;

    localStorage.setItem(STORAGE_KEYS.discount, '0.1');
    localStorage.setItem(STORAGE_KEYS.coupon, 'CAFE10');

    if (feedback) {
      feedback.textContent =
        'Cupom aplicado: 10% de desconto nos produtos.';
    }
  } else {
    discountMultiplier = 0;

    localStorage.setItem(STORAGE_KEYS.discount, '0');
    localStorage.removeItem(STORAGE_KEYS.coupon);

    if (feedback) {
      feedback.textContent = coupon
        ? 'Cupom inválido. Confira o código e tente novamente.'
        : 'Digite um cupom para aplicar o desconto.';
    }
  }

  renderCheckoutSummary();
}

function renderCheckoutSummary() {
  const summaryItems = document.getElementById('checkout-items');

  if (!summaryItems) {
    return;
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  summaryItems.innerHTML = cart.length
    ? cart.map(item => `
        <div class="checkout-item">
          ${imageMarkup(item.image, '')}

          <div class="checkout-item-info">
            <strong>${escapeHTML(item.name.toLocaleUpperCase('pt-BR'))}</strong>
            <br>
            Qtd. ${item.quantity}
          </div>

          <div class="checkout-item-price">
            ${money(item.price * item.quantity)}
          </div>
        </div>
      `).join('')
    : '<p class="empty-summary">Sua sacola está vazia.</p>';

  const shipping = shippingFor(subtotal);
  const discountValue = subtotal * discountMultiplier;
  const total = totalFor(subtotal, discountMultiplier);

  setText('summary-subtotal', money(subtotal));
  setText(
    'summary-shipping',
    shipping === 0 ? 'Grátis' : money(shipping)
  );
  setText('summary-discount', `- ${money(discountValue)}`);
  setText('summary-total', money(total));

  const discountRow = document.getElementById('summary-discount-row');

  if (discountRow) {
    discountRow.hidden = discountMultiplier <= 0 || subtotal <= 0;
  }

  const payButton = document.getElementById('btn-pagar');

  if (payButton) {
    payButton.textContent = cart.length === 0
      ? 'Voltar à loja'
      : `Finalizar pedido • ${money(total)}`;

    payButton.disabled = false;
  }

  const checkoutForm = document.getElementById('checkout-form');

  if (checkoutForm) {
    checkoutForm
      .querySelectorAll('input[required], select[required]')
      .forEach(field => {
        field.disabled = cart.length === 0;
      });
  }

  const feedback = document.getElementById('coupon-feedback');
  const couponInput = document.getElementById('coupon-input');

  if (
    feedback &&
    localStorage.getItem(STORAGE_KEYS.coupon) === 'CAFE10' &&
    discountMultiplier > 0
  ) {
    feedback.textContent =
      'Cupom aplicado: 10% de desconto nos produtos.';

    if (couponInput) {
      couponInput.value = 'CAFE10';
    }
  }
}

function selectPayment(method, btnElement) {
  if (!['pix', 'credit', 'debit'].includes(method)) {
    return;
  }

  selectedPayment = method;

  document.querySelectorAll('.pay-btn').forEach(button => {
    const isActive = button === btnElement;

    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  const cardDetails = document.getElementById('card-details');
  const installmentsGroup = document.getElementById('installments-group');
  const message = document.getElementById('payment-msg');

  const cardInputs = cardDetails
    ? cardDetails.querySelectorAll('input')
    : [];

  const installments = document.getElementById('installments');
  const needsCard = method === 'credit' || method === 'debit';

  if (cardDetails) {
    cardDetails.classList.toggle('hidden', !needsCard);
  }

  if (message) {
    message.classList.toggle('hidden', needsCard);
  }

  cardInputs.forEach(input => {
    input.disabled = !needsCard;
    input.required = needsCard;
  });

  const useInstallments = method === 'credit';

  if (installmentsGroup) {
    installmentsGroup.classList.toggle('hidden', !useInstallments);
  }

  if (installments) {
    installments.disabled = !useInstallments;
    installments.required = false;
  }
}

function processCheckout(event) {
  event.preventDefault();

  if (cart.length === 0) {
    window.location.href = 'index.html';
    return;
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const orderNumber =
    `EC-${Math.floor(100000 + Math.random() * 900000)}`;

  localStorage.setItem(
    STORAGE_KEYS.lastOrder,
    JSON.stringify(cart)
  );

  localStorage.setItem(
    STORAGE_KEYS.lastDiscount,
    String(discountMultiplier)
  );

  localStorage.setItem(
    STORAGE_KEYS.lastPayment,
    selectedPayment
  );

  localStorage.setItem(
    STORAGE_KEYS.lastOrderNumber,
    orderNumber
  );

  localStorage.setItem('lastOrderSubtotal', String(subtotal));

  cart = [];
  persistCart();

  localStorage.setItem(STORAGE_KEYS.discount, '0');
  localStorage.removeItem(STORAGE_KEYS.coupon);

  window.location.href = 'sucesso.html';
}

// ==================== RECIBO DA PÁGINA DE SUCESSO ====================
function renderSuccessReceipt() {
  const receiptItems = document.getElementById('receipt-items');

  if (!receiptItems) {
    return;
  }

  const lastOrder = readJSON(STORAGE_KEYS.lastOrder, []);

  if (!Array.isArray(lastOrder) || lastOrder.length === 0) {
    window.location.replace('index.html');
    return;
  }

  const lastDiscount = Math.max(
    0,
    Math.min(
      0.1,
      Number(localStorage.getItem(STORAGE_KEYS.lastDiscount)) || 0
    )
  );

  const subtotal = lastOrder.reduce(
    (sum, item) =>
      sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  const shipping = shippingFor(subtotal);
  const discountValue = subtotal * lastDiscount;
  const total = Math.max(0, subtotal + shipping - discountValue);

  receiptItems.innerHTML = lastOrder.map(item => `
    <div class="receipt-row">
      <span>
        ${Number(item.quantity) || 1}x
        ${escapeHTML(String(item.name || 'Produto').toLocaleUpperCase('pt-BR'))}
      </span>

      <span>
        ${money(
          (Number(item.price) || 0) * (Number(item.quantity) || 1)
        )}
      </span>
    </div>
  `).join('');

  const discountRow = document.getElementById('receipt-discount-row');

  if (discountRow) {
    discountRow.hidden = lastDiscount <= 0;
  }

  setText('receipt-discount', `- ${money(discountValue)}`);
  setText('receipt-subtotal', money(subtotal));
  setText(
    'receipt-shipping',
    shipping === 0 ? 'Grátis' : money(shipping)
  );
  setText('receipt-total', money(total));

  setText(
    'order-number',
    localStorage.getItem(STORAGE_KEYS.lastOrderNumber) || 'EC-DEMO'
  );

  const paymentNames = {
    pix: 'Pix (simulado)',
    credit: 'Crédito (simulado)',
    debit: 'Débito (simulado)'
  };

  setText(
    'receipt-payment',
    paymentNames[localStorage.getItem(STORAGE_KEYS.lastPayment)] ||
      'Pix (simulado)'
  );
}

function setText(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = String(value);
  }
}

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderProducts();
  renderCart();
  renderCheckoutSummary();
  renderSuccessReceipt();

  const searchInput = document.getElementById('search-input');

  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
  }

  const sortDropdown = document.getElementById('sort-dropdown');

  if (sortDropdown) {
    sortDropdown.addEventListener('change', event => {
      handleSort(event.target.value);
    });
  }

  const checkoutForm = document.getElementById('checkout-form');

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', processCheckout);
  }

  const modal = document.getElementById('product-modal');

  if (modal) {
    modal.addEventListener('click', event => {
      if (event.target === modal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeModal();
    }
  });

  const goCheckout = document.getElementById('go-checkout');

  if (goCheckout) {
    goCheckout.addEventListener('click', event => {
      if (cart.length === 0) {
        event.preventDefault();
      }
    });
  }

  const paymentButton = document.querySelector(
    '.pay-btn[data-payment="pix"]'
  );

  if (paymentButton) {
    selectPayment('pix', paymentButton);
  }

  const checkoutButton = document.getElementById('btn-pagar');

  if (checkoutButton) {
    checkoutButton.addEventListener('click', event => {
      if (cart.length === 0) {
        event.preventDefault();
        window.location.href = 'index.html';
      }
    });
  }
});