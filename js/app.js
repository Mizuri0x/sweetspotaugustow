// ==========================================
// SWEET SPOT - Main Application
// ==========================================

// ========== CONFIGURATION ==========
const CONFIG = {
    // Notification settings (configure one)
    notifications: {
        // Option 1: Telegram Bot (recommended - free)
        telegram: {
            enabled: false,
            botToken: "YOUR_BOT_TOKEN",
            chatId: "YOUR_CHAT_ID"
        },
        // Option 2: SMS via SMSAPI.pl
        sms: {
            enabled: false,
            apiToken: "YOUR_SMSAPI_TOKEN",
            phoneNumber: "+48XXXXXXXXX"
        },
        // Option 3: Email fallback
        email: {
            enabled: true,
            address: "sweetspotaugustow@gmail.com"
        }
    },
    // Business info
    business: {
        name: "Sweet Spot Augustów",
        phone: "+48 XXX XXX XXX",
        instagram: "@sweetspotaugustow"
    }
};

// ========== ORDER MODAL ==========
function openOrderModal() {
    const modal = document.getElementById("orderModal");
    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Close cart sidebar
    const cartSidebar = document.getElementById("cartSidebar");
    const cartOverlay = document.getElementById("cartOverlay");
    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");

    // Initialize calendar and show step 1
    currentStep = 1;
    initCalendar();
    showStep(1);
}

function closeOrderModal() {
    const modal = document.getElementById("orderModal");
    modal.classList.remove("active");
    document.body.style.overflow = "";

    // Reset for next order
    resetBooking();
    currentStep = 1;
    showStep(1);
}

// ========== ORDER FORM SUBMISSION ==========
// submitOrder() jest wywolywana z nextStep() w calendar.js
// gdy uzytkownik przechodzi z kroku 3 do 4
// Event listener na form nie jest potrzebny - flow kontroluje stepper

async function submitOrder() {
    const booking = getBookingInfo();
    const cartData = getCartForOrder();
    var paymentRadio = document.querySelector('input[name="payment"]:checked');
    var paymentMethod = paymentRadio ? paymentRadio.value : 'cash';

    const order = {
        id: generateOrderId(),
        timestamp: new Date().toISOString(),
        customer: {
            name: document.getElementById("customerName").value,
            phone: document.getElementById("customerPhone").value,
            email: document.getElementById("customerEmail").value || null,
            notes: document.getElementById("customerNotes").value || null
        },
        items: cartData.items,
        total: cartData.total,
        pickup: {
            date: booking.date,
            dateDisplay: booking.dateDisplay,
            time: booking.time
        },
        payment: {
            method: paymentMethod,
            amount: paymentMethod === "deposit" ? Math.ceil(cartData.total * 0.3) : cartData.total,
            status: "pending"
        }
    };

    // Save order locally
    saveOrder(order);

    // Send notifications
    await sendOrderNotification(order);

    // Show confirmation
    showOrderConfirmation(order);

    // Clear cart
    clearCart();
}

// Generate order ID
function generateOrderId() {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `SS-${dateStr}-${random}`;
}

// Save order to localStorage
function saveOrder(order) {
    const orders = JSON.parse(localStorage.getItem("sweetspot_orders") || "[]");
    orders.push(order);
    localStorage.setItem("sweetspot_orders", JSON.stringify(orders));
}

// ========== NOTIFICATIONS ==========
async function sendOrderNotification(order) {
    const message = formatOrderMessage(order);

    // Try Telegram first
    if (CONFIG.notifications.telegram.enabled) {
        await sendTelegramNotification(message);
    }

    // Try SMS
    if (CONFIG.notifications.sms.enabled) {
        await sendSMSNotification(message);
    }

    // Log to console for testing
    console.log("📱 Order Notification:", message);
    console.log("📦 Full Order Data:", order);
}

function formatOrderMessage(order) {
    const items = order.items.map(i => `• ${i.quantity}x ${i.name} (${i.subtotal} PLN)`).join("\n");

    return `🧁 NOWE ZAMÓWIENIE!

📋 Nr: ${order.id}
👤 ${order.customer.name}
📱 ${order.customer.phone}

🛒 Produkty:
${items}

💰 SUMA: ${order.total} PLN
💳 Płatność: ${order.payment.method === "prepay" ? "Online" : "Zaliczka 30%"}

📅 Odbiór: ${order.pickup.dateDisplay}
🕐 Godzina: ${order.pickup.time}

${order.customer.notes ? "📝 Uwagi: " + order.customer.notes : ""}`;
}

// Telegram notification
async function sendTelegramNotification(message) {
    const { botToken, chatId } = CONFIG.notifications.telegram;

    try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: "HTML"
            })
        });

        if (response.ok) {
            console.log("✅ Telegram notification sent");
        }
    } catch (error) {
        console.error("❌ Telegram error:", error);
    }
}

// SMS notification (via backend proxy)
async function sendSMSNotification(message) {
    console.log("📱 SMS would be sent:", message);
}

// ========== ORDER CONFIRMATION ==========
function showOrderConfirmation(order) {
    goToStep(4);

    const summary = document.getElementById("orderSummary");
    if (summary) {
        summary.innerHTML = `
            <p><strong>Nr zamówienia:</strong> ${order.id}</p>
            <p><strong>Data odbioru:</strong> ${order.pickup.dateDisplay}</p>
            <p><strong>Godzina:</strong> ${order.pickup.time}</p>
            <p><strong>Suma:</strong> ${order.total} PLN</p>
            ${order.payment.method === "deposit" ? 
                `<p><strong>Zaliczka do wpłaty:</strong> ${order.payment.amount} PLN</p>` : 
                `<p><strong>Do zapłaty online:</strong> ${order.payment.amount} PLN</p>`
            }
            <hr style="margin: 1rem 0; border: none; border-top: 1px solid var(--color-pink-light);">
            <p style="font-size: 0.9rem; color: var(--color-text-light);">
                📱 Skontaktujemy się z Tobą w celu potwierdzenia zamówienia.
            </p>
        `;
    }
}

// Mobile menu - handled in inline script

// Smooth scroll and navbar - handled in inline script

// ========== UTILITY FUNCTIONS ==========

// Close modal on escape key
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeOrderModal();
        const cartSidebar = document.getElementById("cartSidebar");
        if (cartSidebar.classList.contains("active")) {
            toggleCart();
        }
    }
});

// Close modal on outside click
document.addEventListener("click", (e) => {
    const modal = document.getElementById("orderModal");
    if (e.target === modal) {
        closeOrderModal();
    }
});

console.log("🧁 Sweet Spot Augustów - Website loaded!");
console.log("📦 Configure notifications in CONFIG object");
