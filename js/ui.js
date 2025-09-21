export function showSection(sectionId) {
    const sections = document.querySelectorAll('section');
    sections.forEach(s => s.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
}

export function openNav() {
    document.getElementById("mySidebar").classList.add("open");
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

export function closeNav() {
    document.getElementById("mySidebar").classList.remove("open");
    document.body.style.backgroundColor = "white";
}

export function updateCartDisplay(cart) {
    const cartItemsList = document.getElementById("cart-items-list");
    const cartTotalElement = document.getElementById("cart-total");
    const cartCountElement = document.getElementById("cart-count");
    const emptyMessage = document.getElementById("cart-empty-message");

    if (cart.length === 0) {
        cartItemsList.innerHTML = '';
        emptyMessage.style.display = 'block';
        document.getElementById("cart-summary").style.display = 'none';
    } else {
        cartItemsList.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p>R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="cart-quantity-btn" data-action="decrease" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="cart-quantity-btn" data-action="increase" data-id="${item.id}">+</button>
                    <button class="remove-item-btn" data-id="${item.id}">Remover</button>
                </div>
            </div>
        `).join('');
        emptyMessage.style.display = 'none';
        document.getElementById("cart-summary").style.display = 'block';
    }
    
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotalElement.textContent = total.toFixed(2).replace('.', ',');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
}