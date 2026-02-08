// ==========================================
// SWEET SPOT - Product Catalog
// ==========================================

const PRODUCTS = [
    // === MONOPORCJE ===
    {
        id: 1,
        name: "Malinowa Chmurka",
        description: "Delikatny mus malinowy na biszkopcie migdałowym z kremem waniliowym",
        price: 18,
        category: "monoporcje",
        emoji: "🍓",
        badge: "Bestseller"
    },
    {
        id: 2,
        name: "Pistacjowa Rozkosz",
        description: "Intensywny krem pistacjowy z malinową wkładką i chrupiącą bazą",
        price: 22,
        category: "monoporcje",
        emoji: "🥜",
        badge: null
    },
    {
        id: 3,
        name: "Czekoladowa Pokusa",
        description: "Ciemna czekolada 70% z solonym karmelem i orzechami laskowymi",
        price: 20,
        category: "monoporcje",
        emoji: "🍫",
        badge: null
    },
    {
        id: 4,
        name: "Mango Passion",
        description: "Egzotyczny mus mango z marakują na kokosowym biszkopcie",
        price: 21,
        category: "monoporcje",
        emoji: "🥭",
        badge: "Nowość"
    },
    {
        id: 5,
        name: "Cytrynowa Tarta",
        description: "Klasyczny krem cytrynowy z delikatną bezą włoską",
        price: 19,
        category: "monoporcje",
        emoji: "🍋",
        badge: null
    },
    {
        id: 6,
        name: "Tiramisu",
        description: "Klasyczne włoskie tiramisu z mascarpone i kawą",
        price: 20,
        category: "monoporcje",
        emoji: "☕",
        badge: null
    },

    // === TARTALETKI ===
    {
        id: 10,
        name: "Tartaletka Owocowa",
        description: "Kruche ciasto z kremem patisserie i świeżymi owocami sezonowymi",
        price: 16,
        category: "tartaletki",
        emoji: "🍇",
        badge: null
    },
    {
        id: 11,
        name: "Tartaletka Czekoladowa",
        description: "Ganache z ciemnej czekolady na kruchym spodzie",
        price: 17,
        category: "tartaletki",
        emoji: "🍫",
        badge: null
    },
    {
        id: 12,
        name: "Tartaletka Cytrynowa",
        description: "Świeży krem cytrynowy z delikatną bezą",
        price: 16,
        category: "tartaletki",
        emoji: "🍋",
        badge: null
    },
    {
        id: 13,
        name: "Tartaletka Karmelowa",
        description: "Solony karmel z orzechami pekan na maślanym cieście",
        price: 18,
        category: "tartaletki",
        emoji: "🥧",
        badge: "Nowość"
    },

    // === CHEESECAKE STICKS ===
    {
        id: 20,
        name: "Classic Cheesecake Stick",
        description: "Kremowy sernik nowojorski w formie eleganckiego batona",
        price: 14,
        category: "cheesecake",
        emoji: "🧀",
        badge: null
    },
    {
        id: 21,
        name: "Cheesecake Stick Malina",
        description: "Sernik z warstwą musu malinowego i świeżymi owocami",
        price: 16,
        category: "cheesecake",
        emoji: "🍓",
        badge: "Bestseller"
    },
    {
        id: 22,
        name: "Cheesecake Stick Oreo",
        description: "Sernik z kawałkami ciastek Oreo i czekoladową polewą",
        price: 16,
        category: "cheesecake",
        emoji: "🍪",
        badge: null
    },
    {
        id: 23,
        name: "Cheesecake Stick Mango",
        description: "Egzotyczny sernik z musem mango i marakują",
        price: 17,
        category: "cheesecake",
        emoji: "🥭",
        badge: null
    },

    // === CIASTA ===
    {
        id: 30,
        name: "Sernik Baskijski",
        description: "Kultowy spalony sernik - kremowy w środku, karmelowy na wierzchu",
        price: 85,
        category: "ciasta",
        emoji: "🥮",
        badge: "Hit",
        unit: "cały"
    },
    {
        id: 31,
        name: "Szarlotka Tatrzańska",
        description: "Klasyczna szarlotka z górą jabłek i kruchym ciastem",
        price: 75,
        category: "ciasta",
        emoji: "🍎",
        badge: null,
        unit: "cały"
    },
    {
        id: 32,
        name: "Sernik Lotus",
        description: "Kremowy sernik z ciasteczkami Lotus i karmelową polewą",
        price: 90,
        category: "ciasta",
        emoji: "🍪",
        badge: "Nowość",
        unit: "cały"
    },
    {
        id: 33,
        name: "Drożdżówka ze Śliwkami",
        description: "Puszysty drożdżowiec ze śliwkami i kruszonką",
        price: 65,
        category: "ciasta",
        emoji: "🫐",
        badge: null,
        unit: "cały"
    },
    {
        id: 34,
        name: "Brownie",
        description: "Intensywnie czekoladowe brownie z orzechami włoskimi",
        price: 70,
        category: "ciasta",
        emoji: "🍫",
        badge: null,
        unit: "cały"
    },

    // === SEZONOWE ===
    {
        id: 40,
        name: "Sernik Truskawkowy",
        description: "Lekki sernik z musem truskawkowym i świeżymi truskawkami",
        price: 24,
        category: "sezonowe",
        emoji: "🍓",
        badge: "Lato 2026"
    },
    {
        id: 41,
        name: "Pavlova Owocowa",
        description: "Chrupiąca beza z bitą śmietaną i owocami sezonowymi",
        price: 26,
        category: "sezonowe",
        emoji: "🍰",
        badge: "Lato 2026"
    },
    {
        id: 42,
        name: "Sorbet Mango-Marakuja",
        description: "Orzeźwiający sorbet owocowy - idealna letnia przekąska",
        price: 15,
        category: "sezonowe",
        emoji: "🍨",
        badge: "Lato 2026"
    }
];

// Render products to grid
function renderProducts(category = "all") {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;

    const filtered = category === "all" 
        ? PRODUCTS 
        : PRODUCTS.filter(p => p.category === category);

    grid.innerHTML = filtered.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                ${product.emoji}
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">${product.price} PLN${product.unit ? ` / ${product.unit}` : ""}</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})" title="Dodaj do koszyka">
                        +
                    </button>
                </div>
            </div>
        </div>
    `).join("");
}

// Get product by ID
function getProductById(id) {
    return PRODUCTS.find(p => p.id === id);
}

// Initialize category filters
function initCategoryFilters() {
    const pills = document.querySelectorAll(".category-pill");

    pills.forEach(pill => {
        pill.addEventListener("click", () => {
            // Update active state
            pills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");

            // Filter products
            const category = pill.dataset.category;
            renderProducts(category);
        });
    });
}

// Initialize on load
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    initCategoryFilters();
});
