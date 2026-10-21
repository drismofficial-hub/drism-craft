// DRISM CRAFT - Product Catalog & Inquiry Handler with Decap CMS JSON Support

let products = [];

// DOM Elements
const productGrid = document.getElementById('product-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const purchaseModal = document.getElementById('purchase-modal');
const modalTitle = document.getElementById('modal-title');
const modalItemName = document.getElementById('modal-item-name');
const selectedItemInput = document.getElementById('selected-item');
const closeMoalBtn = document.getElementById('close-modal');
const cancelModalBtn = document.getElementById('cancel-modal');
const purchaseForm = document.getElementById('purchase-form');

// Initialize Gallery & Fetch JSON Data
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  setupFilters();
  setupModalHandlers();
});

async function loadProducts() {
  try {
    const response = await fetch('content/products.json');
    const data = await response.json();
    products = data.products || [];
    renderProducts('all');
  } catch (error) {
    console.error('Error loading products:', error);
    productGrid.innerHTML = '<p class="col-span-3 text-center text-gray-500 py-12">Failed to load catalog. Please try again later.</p>';
  }
}

// Render Products
function renderProducts(category) {
  productGrid.innerHTML = '';

  const filtered = category === 'all'
    ? products
    : products.filter(p => p.category === category);

  if (filtered.length === 0) {
    productGrid.innerHTML = '<p class="col-span-3 text-center text-gray-500 py-12">No items found in this category.</p>';
    return;
  }

  filtered.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card bg-white rounded-2xl overflow-hidden border border-amber-900/10 shadow-sm flex flex-col';
    card.innerHTML = `
      <div class="relative h-64 overflow-hidden bg-amber-50">
        <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105">
        <span class="absolute top-3 right-3 bg-amber-900/80 text-amber-50 text-xs px-3 py-1 rounded-full uppercase tracking-wider font-semibold backdrop-blur-sm">
          ${product.category}
        </span>
      </div>
      <div class="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-serif text-xl font-bold text-amber-950">${product.title}</h3>
            <span class="text-amber-800 font-bold text-lg">${product.price}</span>
          </div>
          <p class="text-gray-600 text-sm mb-4 line-clamp-2">${product.description}</p>
          <p class="text-xs text-amber-900/70 bg-amber-50 p-2 rounded-lg mb-6">${product.specs || ''}</p>
        </div>
        <button onclick="openPurchaseModal(${product.id})" class="w-full bg-amber-900 hover:bg-amber-950 text-amber-50 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
          Inquire / Purchase
        </button>
      </div>
    `;
    productGrid.appendChild(card);
  });
}

// Setup Filters
function setupFilters() {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-amber-900', 'text-amber-50', 'shadow-md');
        b.classList.add('bg-white', 'text-amber-900', 'border', 'border-amber-900/20');
      });
      btn.classList.remove('bg-white', 'text-amber-900', 'border', 'border-amber-900/20');
      btn.classList.add('bg-amber-900', 'text-amber-50', 'shadow-md');

      const category = btn.getAttribute('data-filter');
      renderProducts(category);
    });
  });
}

// Modal Handlers
function openPurchaseModal(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  modalItemName.textContent = `${product.title} (${product.price})`;
  selectedItemInput.value = `${product.title} - ${product.price}`;

  purchaseModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closePurchaseModal() {
  purchaseModal.classList.add('hidden');
  document.body.style.overflow = 'auto';
  purchaseForm.reset();
}

function setupModalHandlers() {
  closeMoalBtn.addEventListener('click', closePurchaseModal);
  cancelModalBtn.addEventListener('click', closePurchaseModal);

  purchaseModal.addEventListener('click', (e) => {
    if (e.target === purchaseModal) {
      closePurchaseModal();
    }
  });

  // Handle Form Submission -> WhatsApp or Email
  purchaseForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('cust-name').value;
    const email = document.getElementById('cust-email').value;
    const phone = document.getElementById('cust-phone').value;
    const notes = document.getElementById('cust-notes').value;
    const item = selectedItemInput.value;
    const sendMethod = document.getElementById('send-method').value;

    if (sendMethod === 'whatsapp') {
      const ownerWhatsApp = "233547577681"; // DRISM CRAFT WhatsApp number
      const message = `Hello DRISM CRAFT! 👋\n\nI would like to inquire about / purchase:\n*Item:* ${item}\n\n*My Details:*\n- Name: ${name}\n- Email: ${email}\n- Phone: ${phone}\n- Notes: ${notes || 'None'}\n\nPlease get in touch with me!`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${ownerWhatsApp}?text=${encodedMessage}`;

      window.open(whatsappUrl, '_blank');
      closePurchaseModal();
      alert('Redirecting you to WhatsApp with your order details!');
    } else {
      // Email simulation or Formspree integration
      alert(`Thank you, ${name}! Your inquiry for "${item}" has been prepared. We will contact you at ${email} shortly.`);
      closePurchaseModal();
    }
  });
}
