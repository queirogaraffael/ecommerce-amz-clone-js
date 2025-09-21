class Product {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.price = data.price;
        this.category = data.category;
        this.description = data.description;
        this.image = data.image;
    }

    createCard() {
        const card = document.createElement("div");
        card.className = "product-card";
        card.setAttribute("data-id", this.id);
        card.innerHTML = `
            <img src="${this.image}" alt="${this.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${this.name}</h3>
                <p class="product-price">R$ ${this.price.toFixed(2).replace('.', ',')}</p>
                <button class="add-to-cart-btn" data-product-id="${this.id}">Adicionar ao Carrinho</button>
            </div>
        `;
        return card;
    }
}

export { Product };

export function renderProducts(products, containerId, onCardClick, onAddToCart) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = "<p style='text-align: center; font-size: 1.2em;'>Nenhum produto encontrado.</p>";
    } else {
        products.forEach(productData => {
            const product = new Product(productData);
            const card = product.createCard();
            
            card.addEventListener('click', () => onCardClick(product.id));
            card.querySelector('.add-to-cart-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                onAddToCart(product.id);
            });

            container.appendChild(card);
        });
    }
}