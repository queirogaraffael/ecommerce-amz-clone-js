import { renderProducts } from './product.js';
import { showSection, updateCartDisplay, openNav, closeNav } from './ui.js';
import { addToCart, updateQuantity, removeItem } from './cart.js';
import { setupCheckoutEvents } from './checkout.js';

// Função para carregar os produtos do arquivo JSON
async function fetchProducts() {
    try {
        const response = await fetch('data/products.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Não foi possível carregar os produtos:", error);
        return [];
    }
}

// Estado da aplicação
const state = {
    products: [],
    cart: [],
    currentFilter: "all"
};

// Funções para manipular a exibição de detalhes e a lógica do carrinho
function showProductDetail(productId) {
    showSection('product-detail');
    const product = state.products.find(p => p.id === productId);
    const detailContainer = document.getElementById("product-detail");
    detailContainer.innerHTML = `
        <button id="back-to-products" style="margin-bottom: 20px;">← Voltar</button>
        <div class="detail-container">
            <div class="detail-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="detail-info">
                <h2>${product.name}</h2>
                <p class="detail-price">R$ ${product.price.toFixed(2).replace('.', ',')}</p>
                <p class="detail-description">${product.description}</p>
                <button id="add-to-cart-detail-btn" class="add-to-cart-btn" data-product-id="${product.id}">Adicionar ao Carrinho</button>
            </div>
        </div>
    `;

    document.getElementById("back-to-products").addEventListener('click', () => showSection('products-container'));
    document.getElementById("add-to-cart-detail-btn").addEventListener('click', () => {
        addToCart(state, productId);
        updateCartDisplay(state.cart);
    });
}

function handleAddToCartClick(productId) {
    addToCart(state, productId);
    updateCartDisplay(state.cart);
}

// Inicialização e Event Listeners
document.addEventListener('DOMContentLoaded', async () => {
    state.products = await fetchProducts();
    if (state.products.length > 0) {
        renderProducts(state.products, 'products-container', showProductDetail, handleAddToCartClick);
    } else {
        document.getElementById("products-container").innerHTML = "<p style='text-align: center; font-size: 1.2em;'>Não foi possível carregar os produtos. Tente novamente mais tarde.</p>";
    }
    updateCartDisplay(state.cart);

    // Eventos do menu hambúrguer
    document.getElementById("open-nav-btn").addEventListener('click', openNav);
    document.getElementById("close-nav-btn").addEventListener('click', closeNav);

    // Configuração dos eventos de busca e filtro da barra fixa
    document.getElementById("search-input").addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = state.products.filter(p => 
            p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
        );
        renderProducts(filtered, 'products-container', showProductDetail, handleAddToCartClick);
    });

    document.querySelectorAll(".fixed-categories .category-item").forEach(item => {
        item.addEventListener('click', (e) => {
            const category = e.target.getAttribute('data-category');
            showSection('products-container');
            
            let filtered = state.products;

            if (category === 'all') {
                filtered = state.products;
            } else if (category === 'ofertas') {
                filtered = state.products.filter(p => p.is_offer);
            } else {
                filtered = state.products.filter(p => p.category === category);
            }

            renderProducts(filtered, 'products-container', showProductDetail, handleAddToCartClick);
            document.querySelectorAll(".fixed-categories .category-item").forEach(el => el.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    // Eventos da barra lateral (sidebar)
    document.querySelectorAll(".sidebar-link").forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = e.target.getAttribute('data-section');
            const filterType = e.target.getAttribute('data-filter');
            
            showSection(sectionId);
            let filteredProducts = state.products;

            if (filterType === 'best_sellers') {
                filteredProducts = state.products.filter(p => p.is_best_seller);
            } else if (filterType === 'new') {
                filteredProducts = state.products.filter(p => p.is_new);
            } else if (filterType === 'offers') {
                filteredProducts = state.products.filter(p => p.is_offer);
            } else {
                // Lógica para as categorias de produto
                filteredProducts = state.products.filter(p => p.category === filterType);
            }
            
            renderProducts(filteredProducts, 'products-container', showProductDetail, handleAddToCartClick);
            closeNav(); // Fecha a sidebar após o clique
        });
    });

    document.getElementById("cart-icon").addEventListener("click", () => {
        showSection('cart-container');
        updateCartDisplay(state.cart);
    });

    // Eventos de manipulação de quantidade no carrinho
    document.getElementById("cart-items-list").addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('cart-quantity-btn')) {
            const productId = parseInt(target.getAttribute('data-id'));
            const action = target.getAttribute('data-action');
            if (action === 'increase') {
                updateQuantity(state, productId, 1);
            } else if (action === 'decrease') {
                updateQuantity(state, productId, -1);
            }
            updateCartDisplay(state.cart);
        } else if (target.classList.contains('remove-item-btn')) {
            const productId = parseInt(target.getAttribute('data-id'));
            removeItem(state, productId);
            updateCartDisplay(state.cart);
        }
    });

    // Evento do botão "Finalizar Compra" no carrinho
    document.getElementById("checkout-btn").addEventListener('click', () => {
        showSection('checkout-container');
    });

    document.getElementById("checkout-form").addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Compra finalizada com sucesso! Obrigado!");
        state.cart = [];
        updateCartDisplay(state.cart);
        showSection('products-container');
    });

    // Configura os eventos do checkout
    setupCheckoutEvents();
});