import { renderProducts } from './product.js';
import { showSection, updateCartDisplay, openNav, closeNav } from './ui.js';
import { addToCart, updateQuantity, removeItem } from './cart.js';
import { setupCheckoutEvents, validateCheckoutForm } from './checkout.js';

const REMOTE_PRODUCTS_URL = 'https://fakestoreapi.com/products'; 
const LOCAL_PRODUCTS_URL = 'data/products.json';
const FETCH_TIMEOUT_MS = 8000;

async function fetchWithTimeout(url, timeout = FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(id);
  }
}

export async function loadProducts() {
  const productsContainer = document.getElementById('products');
  if (productsContainer) productsContainer.innerHTML = '<p>Carregando produtos...</p>';

  try {
    const remote = await fetchWithTimeout(REMOTE_PRODUCTS_URL, FETCH_TIMEOUT_MS);
    const mapped = remote.map(p => ({
      id: p.id,
      name: p.title || p.name || `Produto ${p.id}`,
      price: (p.price != null) ? Number(p.price) : 0,
      category: p.category || 'outros',
      description: p.description || '',
      image: p.image || p.images?.[0] || 'assets/default-product.png'
    }));

    return mapped;
  } catch (err) {
    console.warn('Falha ao buscar API remota, tentando fallback local:', err.message);
  }

  try {
    const local = await fetchWithTimeout(LOCAL_PRODUCTS_URL, FETCH_TIMEOUT_MS);
    return local;
  } catch (err) {
    console.error('Falha ao carregar produtos localmente:', err.message);
    throw new Error('Não foi possível carregar os produtos. Verifique a conexão ou o arquivo data/products.json');
  }
}

async function init() {
  const state = {
    products: [],
    cart: []
  };

  try {
    state.products = await loadProducts();
    renderProducts(state.products, onAddToCartClicked);
  } catch (err) {
    const container = document.getElementById('products');
    if (container) container.innerHTML = `<p style="color:red">Erro ao carregar produtos: ${err.message}</p>`;
    console.error(err);
  }

  function onAddToCartClicked(productId) {
    addToCart(state, productId);
    updateCartDisplay(state.cart);
  }

  document.addEventListener('click', (e) => {
    const t = e.target;
    if (t.matches('.add-to-cart-btn')) {
      const id = parseInt(t.dataset.id, 10);
      onAddToCartClicked(id);
    }

    if (t.matches('.open-nav')) openNav();
    if (t.matches('.close-nav')) closeNav();
  });

  setupCheckoutEvents();
}

document.addEventListener('DOMContentLoaded', init);

export default { loadProducts };
