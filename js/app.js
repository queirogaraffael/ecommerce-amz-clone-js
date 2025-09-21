import { renderProducts } from './product.js';
import { showSection, updateCartDisplay, openNav, closeNav } from './ui.js';
import { addToCart, updateQuantity, removeItem } from './cart.js';
import { setupCheckoutEvents, validateCheckoutForm } from './checkout.js';

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

const state = {
    products: [],
    cart: [],
    currentFilter: "all"
};

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

    document.getElementById("add-to-cart-detail-btn").addEventListener('click', () => {
        addToCart(state, productId);
        updateCartDisplay(state.cart);
    });
}

function handleAddToCartClick(productId) {
    addToCart(state, productId);
    updateCartDisplay(state.cart);
}

function applyFiltersAndSearch(filter = null, query = null) {
    const category = filter || document.getElementById("category-filter").value;
    const searchQuery = query || document.getElementById("search-input").value.toLowerCase();

    state.currentFilter = category; 
    showSection('products-container'); 

    let filteredProducts = state.products;

    if (category !== 'all') {
        if (category === 'ofertas') {
            filteredProducts = filteredProducts.filter(p => p.is_offer);
        } else if (category === 'best_sellers') {
            filteredProducts = filteredProducts.filter(p => p.is_best_seller);
        } else if (category === 'new') {
            filteredProducts = filteredProducts.filter(p => p.is_new);
        } else {
            filteredProducts = filteredProducts.filter(p => p.category === category);
        }
    }

    if (searchQuery) {
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(searchQuery) || p.category.toLowerCase().includes(searchQuery)
        );
    }

    renderProducts(filteredProducts, 'products-container', showProductDetail, handleAddToCartClick);

    document.querySelectorAll(".fixed-categories .category-item").forEach(el => el.classList.remove('active'));
    const activeItem = document.querySelector(`.fixed-categories .category-item[data-category="${category}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

function populateCategoryFilter() {
    const categoryFilter = document.getElementById("category-filter");
    const uniqueCategories = [...new Set(state.products.map(product => product.category))];

    const categoryNames = {
        "eletronicos": "Eletrônicos",
        "livros": "Livros",
        "moda": "Moda",
        "casa": "Casa",
        "esportes": "Esportes",
        "roupas": "Roupas",
        "calcados": "Calçados"
    };

    uniqueCategories.sort().forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
        categoryFilter.appendChild(option);
    });
}


document.addEventListener('DOMContentLoaded', async () => {
    state.products = await fetchProducts();
    if (state.products.length > 0) {
        populateCategoryFilter(); 
        applyFiltersAndSearch(); 
    } else {
        document.getElementById("products-container").innerHTML = "<p style='text-align: center; font-size: 1.2em;'>Não foi possível carregar os produtos. Tente novamente mais tarde.</p>";
    }
    updateCartDisplay(state.cart);

    document.getElementById("open-nav-btn").addEventListener('click', openNav);
    document.getElementById("close-nav-btn").addEventListener('click', closeNav);

    document.getElementById("search-input").addEventListener("input", () => applyFiltersAndSearch(null, document.getElementById("search-input").value));
    document.getElementById("category-filter").addEventListener("change", () => applyFiltersAndSearch(document.getElementById("category-filter").value, null));

    document.querySelectorAll(".fixed-categories .category-item").forEach(item => {
        item.addEventListener('click', (e) => {
            const category = e.target.getAttribute('data-category');
            document.getElementById("category-filter").value = "all"; 
            applyFiltersAndSearch(category, null);
        });
    });

    document.querySelectorAll(".sidebar-link").forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const filterType = e.target.getAttribute('data-filter');
            document.getElementById("category-filter").value = "all"; // Limpa o seletor
            applyFiltersAndSearch(filterType, null);
            closeNav();
        });
    });

    document.getElementById("cart-icon").addEventListener("click", () => {
        showSection('cart-container');
        updateCartDisplay(state.cart);
    });
    
    document.getElementById("back-to-products-from-cart").addEventListener('click', () => {
        applyFiltersAndSearch(state.currentFilter);
    });

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

    document.getElementById("checkout-btn").addEventListener('click', () => {
        showSection('checkout-container');
    });

    document.getElementById("checkout-form").addEventListener("submit", (e) => {
        e.preventDefault();
        if (validateCheckoutForm()) {
            alert("Compra finalizada com sucesso! Obrigado!");
            state.cart = [];
            updateCartDisplay(state.cart);
            applyFiltersAndSearch(); 
        }
    });

    document.getElementById("product-detail").addEventListener('click', (e) => {
        if (e.target.id === "back-to-products") {
            applyFiltersAndSearch(state.currentFilter);
        }
    });

    setupCheckoutEvents();

    document.addEventListener('click', (e) => {
        const sidebar = document.getElementById("mySidebar");
        const openBtn = document.getElementById("open-nav-btn");
        
        if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== openBtn) {
            closeNav();
        }
    });
});