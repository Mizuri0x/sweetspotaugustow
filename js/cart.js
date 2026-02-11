// ==========================================
// SWEET SPOT - Shopping Cart
// ==========================================

let cart = [];

// Load cart from localStorage
function loadCart() {
    try {
        var saved = localStorage.getItem("sweetspot_cart");
        if (saved) {
            cart = JSON.parse(saved);
            if (!Array.isArray(cart)) cart = [];
        }
    } catch (e) {
        console.error('Dane koszyka uszkodzone, resetuje:', e);
        cart = [];
        localStorage.removeItem("sweetspot_cart");
    }
    updateCartUI();
}

// Save cart to localStorage
function saveCart() {
    try {
        localStorage.setItem("sweetspot_cart", JSON.stringify(cart));
    } catch (e) {
        console.error('Nie udalo sie zapisac koszyka:', e);
    }
}

// Add item to cart
function addToCart(productId) {
    const product = getProductById(productId);
    if (!product) return;

    const existingItem = cart.find(item => String(item.id) === String(productId));

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            emoji: product.emoji,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    showAddedNotification(product.name);
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => String(item.id) !== String(productId));
    saveCart();
    updateCartUI();
}

// Update item quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => String(item.id) === String(productId));
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        updateCartUI();
    }
}

// Calculate total
function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Get total items count
function getCartCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Update cart UI
function updateCartUI() {
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");
    const checkoutBtn = document.getElementById("checkoutBtn");

    // Update count badge
    if (cartCount) {
        cartCount.textContent = getCartCount();
        cartCount.style.display = getCartCount() > 0 ? "block" : "none";
    }

    // Update total
    if (cartTotal) {
        cartTotal.textContent = `${getCartTotal()} PLN`;
    }

    // Enable/disable checkout button
    if (checkoutBtn) {
        checkoutBtn.disabled = cart.length === 0;
        checkoutBtn.style.opacity = cart.length === 0 ? '0.5' : '1';
        checkoutBtn.style.pointerEvents = cart.length === 0 ? 'none' : 'auto';
    }

    // Render cart items
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="cart-empty">
                    <div class="cart-empty-icon">🛒</div>
                    <p>Twój koszyk jest pusty</p>
                    <p>Dodaj coś słodkiego!</p>
                </div>
            `;
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-image">${item.emoji}</div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${item.price} PLN</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">−</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                            <button class="delete-btn" onclick="removeFromCart('${item.id}')">🗑</button>
                        </div>
                    </div>
                </div>
            `).join("");
        }
    }
}

// Toggle cart sidebar
function toggleCart() {
    const sidebar = document.getElementById("cartSidebar");
    const overlay = document.getElementById("cartOverlay");

    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");

    // Prevent body scroll when cart is open
    document.body.style.overflow = sidebar.classList.contains("active") ? "hidden" : "";
}

// Show "added to cart" notification
function showAddedNotification(productName) {
    var el = document.getElementById('addedNotification');
    if (!el) return;

    el.textContent = (productName || 'Produkt') + ' dodano do koszyka!';
    el.classList.add('show');

    // Wyczysc poprzedni timeout jesli istnieje
    if (el._hideTimeout) clearTimeout(el._hideTimeout);
    el._hideTimeout = setTimeout(function() {
        el.classList.remove('show');
    }, 2500);
}

// Add animation styles
const style = document.createElement("style");
style.textContent = `
    @keyframes slideUp {
        from { opacity: 0; transform: translateX(-50%) translateY(20px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    @keyframes fadeOut {
        to { opacity: 0; transform: translateX(-50%) translateY(20px); }
    }
`;
document.head.appendChild(style);

// Clear cart
function clearCart() {
    cart = [];
    saveCart();
    updateCartUI();
}

// Get cart for order
function getCartForOrder() {
    return {
        items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity
        })),
        total: getCartTotal()
    };
}

// Initialize cart on load
document.addEventListener("DOMContentLoaded", loadCart);
