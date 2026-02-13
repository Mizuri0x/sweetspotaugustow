// ==========================================
// SWEET SPOT - Macaron Flavor Picker (Inline Accordion)
// ==========================================

const MACARON_FLAVORS = [
    { id: 50, name: "Mango-Marakuja", emoji: "🥭" },
    { id: 51, name: "Czekolada-Pralina", emoji: "🍫" },
    { id: 52, name: "Pistacjowy", emoji: "🌰" },
    { id: 53, name: "Śmietankowy", emoji: "🤍" }
];

const MACARON_BOX_IDS = [60, 61];
let flavorSelection = {};
let currentBoxProduct = null;
let requiredCount = 0;
let activeAccordionEl = null;

function isMacaronBox(productId) {
    return MACARON_BOX_IDS.includes(productId);
}

// ===== Open accordion below the product card =====
function openFlavorAccordion(boxProductId) {
    closeFlavorAccordion(true);

    currentBoxProduct = getProductById(boxProductId);
    if (!currentBoxProduct) return;

    requiredCount = boxProductId === 60 ? 6 : 12;
    flavorSelection = {};
    MACARON_FLAVORS.forEach(f => flavorSelection[f.id] = 0);

    const card = document.querySelector('[data-product-id="' + boxProductId + '"]');
    if (!card) return;

    const accordion = document.createElement('div');
    accordion.className = 'flavor-accordion';
    accordion.innerHTML = buildAccordionHTML();
    card.insertAdjacentElement('afterend', accordion);
    activeAccordionEl = accordion;

    // Animate open
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            accordion.style.maxHeight = accordion.scrollHeight + 'px';
            accordion.classList.add('open');
        });
    });

    setTimeout(() => {
        accordion.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 200);
}

// ===== Build accordion inner HTML =====
function buildAccordionHTML() {
    const total = getTotalSelected();
    const pct = requiredCount > 0 ? Math.round((total / requiredCount) * 100) : 0;

    const flavorsHTML = MACARON_FLAVORS.map(f => {
        const qty = flavorSelection[f.id] || 0;
        const activeClass = qty > 0 ? ' active' : '';
        const minusOff = qty === 0 ? ' disabled' : '';
        const plusOff = total >= requiredCount ? ' disabled' : '';
        return `
            <div class="flavor-pill${activeClass}" data-flavor-id="${f.id}">
                <span class="flavor-pill-emoji">${f.emoji}</span>
                <span class="flavor-pill-name">${f.name}</span>
                <div class="flavor-pill-controls">
                    <button class="flavor-pill-btn minus" data-flavor-id="${f.id}" data-delta="-1"${minusOff}>−</button>
                    <span class="flavor-pill-qty">${qty}</span>
                    <button class="flavor-pill-btn plus" data-flavor-id="${f.id}" data-delta="1"${plusOff}>+</button>
                </div>
            </div>`;
    }).join('');

    return `
        <div class="flavor-accordion-inner">
            <div class="flavor-accordion-header">
                <h3>🌈 Wybierz smaki makaroników</h3>
                <p class="flavor-accordion-subtitle">${currentBoxProduct.name} — wybierz ${requiredCount} szt.</p>
            </div>
            <div class="flavor-grid">${flavorsHTML}</div>
            <div class="flavor-progress-wrap">
                <div class="flavor-progress-bar">
                    <div class="flavor-progress-fill" style="width:${pct}%"></div>
                </div>
                <span class="flavor-accordion-count">Wybrano: <strong class="flavor-count-num">${total}</strong> / ${requiredCount}</span>
            </div>
            <div class="flavor-accordion-actions">
                <button class="flavor-cancel-btn" onclick="closeFlavorAccordion()">Anuluj</button>
                <button class="flavor-confirm-btn" onclick="confirmFlavorSelection()"${total !== requiredCount ? ' disabled' : ''}>Potwierdź i dodaj do koszyka 🛒</button>
            </div>
        </div>`;
}

// ===== Close accordion =====
function closeFlavorAccordion(immediate) {
    if (!activeAccordionEl) return;
    const el = activeAccordionEl;

    if (immediate) {
        if (el.parentNode) el.parentNode.removeChild(el);
        activeAccordionEl = null;
        currentBoxProduct = null;
        return;
    }

    el.style.maxHeight = '0';
    el.classList.remove('open');

    const cleanup = () => {
        if (el.parentNode) el.parentNode.removeChild(el);
        if (activeAccordionEl === el) {
            activeAccordionEl = null;
            currentBoxProduct = null;
        }
    };
    el.addEventListener('transitionend', cleanup, { once: true });
    setTimeout(cleanup, 500);
}

// ===== Flavor quantity helpers =====
function getTotalSelected() {
    return Object.values(flavorSelection).reduce((sum, qty) => sum + qty, 0);
}

function changeFlavorQty(flavorId, delta) {
    const newQty = (flavorSelection[flavorId] || 0) + delta;
    const totalSelected = getTotalSelected();

    if (newQty < 0) return;
    if (delta > 0 && totalSelected >= requiredCount) return;

    flavorSelection[flavorId] = newQty;
    updateAccordionUI();
}

// ===== Update accordion UI without full rebuild =====
function updateAccordionUI() {
    if (!activeAccordionEl) return;

    const total = getTotalSelected();
    const pct = requiredCount > 0 ? Math.round((total / requiredCount) * 100) : 0;

    MACARON_FLAVORS.forEach(f => {
        const pill = activeAccordionEl.querySelector('.flavor-pill[data-flavor-id="' + f.id + '"]');
        if (!pill) return;

        const qty = flavorSelection[f.id] || 0;
        pill.classList.toggle('active', qty > 0);
        pill.querySelector('.flavor-pill-qty').textContent = qty;
        pill.querySelector('.minus').disabled = qty === 0;
        pill.querySelector('.plus').disabled = total >= requiredCount;
    });

    const fill = activeAccordionEl.querySelector('.flavor-progress-fill');
    if (fill) fill.style.width = pct + '%';

    const countNum = activeAccordionEl.querySelector('.flavor-count-num');
    if (countNum) countNum.textContent = total;

    const confirmBtn = activeAccordionEl.querySelector('.flavor-confirm-btn');
    if (confirmBtn) confirmBtn.disabled = total !== requiredCount;

    activeAccordionEl.style.maxHeight = activeAccordionEl.scrollHeight + 'px';
}

// ===== Confirm selection and add to cart =====
function confirmFlavorSelection() {
    if (getTotalSelected() !== requiredCount) return;

    const selectedFlavors = MACARON_FLAVORS
        .filter(f => flavorSelection[f.id] > 0)
        .map(f => `${flavorSelection[f.id]}x ${f.name}`)
        .join(', ');

    const cartItem = {
        id: "macaron-box-" + currentBoxProduct.id + "-" +
            MACARON_FLAVORS.filter(f => flavorSelection[f.id] > 0)
                .map(f => f.id + "x" + flavorSelection[f.id]).sort().join("-"),
        name: currentBoxProduct.name,
        price: currentBoxProduct.price,
        emoji: currentBoxProduct.emoji,
        quantity: 1,
        flavors: selectedFlavors,
        flavorDetails: { ...flavorSelection }
    };

    const existingItem = cart.find(item => String(item.id) === String(cartItem.id));
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(cartItem);
    }
    saveCart();
    updateCartUI();

    const productName = currentBoxProduct.name;
    closeFlavorAccordion();
    showAddedNotification(productName + " (" + selectedFlavors + ")");
}

// ===== Event Delegation for +/- buttons =====
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.flavor-pill-btn');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();

    const flavorId = parseInt(btn.dataset.flavorId);
    const delta = parseInt(btn.dataset.delta);
    if (!isNaN(flavorId) && !isNaN(delta)) {
        changeFlavorQty(flavorId, delta);
    }
});

// Close on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeFlavorAccordion();
});

// Close when category filter changes
document.addEventListener('click', (e) => {
    if (e.target.closest('.category-pill')) {
        closeFlavorAccordion(true);
    }
});

// ===== Override addToCart for box products =====
document.addEventListener('DOMContentLoaded', () => {
    function overrideAddToCart() {
        if (typeof window.originalAddToCart === 'undefined' && typeof addToCart === 'function') {
            window.originalAddToCart = addToCart;
            window.addToCart = function(productId) {
                if (isMacaronBox(productId)) {
                    openFlavorAccordion(productId);
                } else {
                    window.originalAddToCart(productId);
                }
            };
            console.log('Macaron flavor accordion: addToCart override ready!');
            return true;
        }
        return false;
    }
    if (!overrideAddToCart()) {
        let attempts = 0;
        const maxAttempts = 50;
        function retryOverride() {
            if (overrideAddToCart() || ++attempts >= maxAttempts) return;
            requestAnimationFrame(retryOverride);
        }
        requestAnimationFrame(retryOverride);
    }
});

console.log('🌈 Macaron Flavor Accordion loaded!');
