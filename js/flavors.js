
// ==========================================
// SWEET SPOT - Macaron Flavor Picker
// ==========================================

// Available macaron flavors (single pieces)
const MACARON_FLAVORS = [
    { id: 50, name: "Mango-Marakuja", emoji: "🥭" },
    { id: 51, name: "Czekolada-Pralina", emoji: "🍫" },
    { id: 52, name: "Pistacjowy", emoji: "🌰" },
    { id: 53, name: "Śmietankowy", emoji: "🤍" }
];

// Box product IDs
const MACARON_BOX_IDS = [60, 61]; // 6 szt, 12 szt

// Current selection state
let flavorSelection = {};
let currentBoxProduct = null;
let requiredCount = 0;

// Check if product is a macaron box
function isMacaronBox(productId) {
    return MACARON_BOX_IDS.includes(productId);
}

// Open flavor picker modal
function openFlavorModal(boxProductId) {
    currentBoxProduct = getProductById(boxProductId);
    if (!currentBoxProduct) return;

    // Determine required count from product
    requiredCount = boxProductId === 60 ? 6 : 12;

    // Reset selection
    flavorSelection = {};
    MACARON_FLAVORS.forEach(f => flavorSelection[f.id] = 0);

    // Update subtitle
    document.getElementById("flavorSubtitle").textContent = 
        `Wybierz ${requiredCount} makaroników do ${currentBoxProduct.name}`;
    document.getElementById("flavorTotal").textContent = requiredCount;

    // Render flavor options
    renderFlavorOptions();
    updateFlavorCounter();

    // Show modal
    document.getElementById("flavorModal").classList.add("active");
    document.body.style.overflow = "hidden";
}

// Close flavor modal
function closeFlavorModal() {
    document.getElementById("flavorModal").classList.remove("active");
    document.body.style.overflow = "";
    currentBoxProduct = null;
}

// Render flavor options
function renderFlavorOptions() {
    const container = document.getElementById("flavorOptions");
    container.innerHTML = MACARON_FLAVORS.map(flavor => `
        <div class="flavor-option">
            <div class="flavor-info">
                <span class="flavor-emoji">${flavor.emoji}</span>
                <span class="flavor-name">${flavor.name}</span>
            </div>
            <div class="flavor-controls">
                <button class="flavor-btn" onclick="changeFlavorQty(${flavor.id}, -1)" 
                    ${flavorSelection[flavor.id] === 0 ? "disabled" : ""}>−</button>
                <span class="flavor-qty">${flavorSelection[flavor.id]}</span>
                <button class="flavor-btn" onclick="changeFlavorQty(${flavor.id}, 1)"
                    ${getTotalSelected() >= requiredCount ? "disabled" : ""}>+</button>
            </div>
        </div>
    `).join("");
}

// Change flavor quantity
function changeFlavorQty(flavorId, delta) {
    const newQty = flavorSelection[flavorId] + delta;
    const totalSelected = getTotalSelected();

    // Validate
    if (newQty < 0) return;
    if (delta > 0 && totalSelected >= requiredCount) return;

    flavorSelection[flavorId] = newQty;
    renderFlavorOptions();
    updateFlavorCounter();
}

// Get total selected
function getTotalSelected() {
    return Object.values(flavorSelection).reduce((sum, qty) => sum + qty, 0);
}

// Update counter display
function updateFlavorCounter() {
    const total = getTotalSelected();
    document.getElementById("flavorCount").textContent = total;

    const status = document.getElementById("flavorStatus");
    const confirmBtn = document.getElementById("flavorConfirmBtn");

    if (total === requiredCount) {
        status.textContent = "✅ Gotowe!";
        status.className = "flavor-status ready";
        confirmBtn.disabled = false;
    } else if (total < requiredCount) {
        status.textContent = `❌ Wybierz jeszcze ${requiredCount - total}`;
        status.className = "flavor-status";
        confirmBtn.disabled = true;
    }
}

// Confirm selection and add to cart
function confirmFlavorSelection() {
    if (getTotalSelected() !== requiredCount) return;

    // Build flavor description
    const selectedFlavors = MACARON_FLAVORS
        .filter(f => flavorSelection[f.id] > 0)
        .map(f => `${flavorSelection[f.id]}x ${f.name}`)
        .join(", ");

    // Create custom cart item
    const cartItem = {
        id: currentBoxProduct.id + "_" + Date.now(), // Unique ID for each box
        name: currentBoxProduct.name,
        price: currentBoxProduct.price,
        emoji: currentBoxProduct.emoji,
        quantity: 1,
        flavors: selectedFlavors,
        flavorDetails: {...flavorSelection}
    };

    // Add to cart directly
    cart.push(cartItem);
    saveCart();
    updateCartUI();

    // Close modal and show notification
    closeFlavorModal();
    showAddedNotification(currentBoxProduct.name + " (" + selectedFlavors + ")");
}

// Override addToCart for box products
const originalAddToCart = addToCart;
addToCart = function(productId) {
    if (isMacaronBox(productId)) {
        openFlavorModal(productId);
    } else {
        originalAddToCart(productId);
    }
};

// Close on escape
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeFlavorModal();
    }
});

// Close on overlay click
document.addEventListener("click", (e) => {
    if (e.target.id === "flavorModal") {
        closeFlavorModal();
    }
});

console.log("🌈 Macaron Flavor Picker loaded!");
