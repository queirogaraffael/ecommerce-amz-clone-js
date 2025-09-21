export function addToCart(state, productId) {
    const productToAdd = state.products.find(p => p.id === productId);
    const existingItem = state.cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        state.cart.push({ ...productToAdd, quantity: 1 });
    }
}

export function updateQuantity(state, productId, delta) {
    const item = state.cart.find(i => i.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeItem(state, productId);
        }
    }
}

export function removeItem(state, productId) {
    state.cart = state.cart.filter(i => i.id !== productId);
}