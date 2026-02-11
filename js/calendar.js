// ==========================================
// SWEET SPOT - Calendar & Booking System
// ==========================================

let selectedDate = null;
let selectedTime = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let currentStep = 1;

// Minimum days in advance for orders (production time)
const MIN_LEAD_DAYS = 2;

// Available time slots by day of week
const TIME_SLOTS = {
    weekday: ["10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00"],
    saturday: ["10:00-12:00", "12:00-14:00", "14:00-16:00"],
    sunday: ["12:00-14:00", "14:00-16:00"]
};

// Blocked dates (holidays, vacations, etc.)
const BLOCKED_DATES = [
    // Add dates in format "YYYY-MM-DD"
    // "2026-12-25", "2026-12-26", "2026-01-01"
];

// Polish month names
const MONTH_NAMES = [
    "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
    "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
];

// Polish day names
const DAY_NAMES = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Ndz"];

// ========== STEP NAVIGATION ==========
function goToStep(step) {
    currentStep = step;
    showStep(step);
}

function nextStep() {
    // Walidacja biezacego kroku przed przejsciem dalej
    if (currentStep === 1) {
        if (!selectedDate) {
            showStepError("Wybierz datę odbioru");
            return;
        }
    } else if (currentStep === 2) {
        if (!selectedTime) {
            showStepError("Wybierz godzinę odbioru");
            return;
        }
    } else if (currentStep === 3) {
        const name = document.getElementById('customerName');
        const phone = document.getElementById('customerPhone');
        const nameVal = name ? name.value.trim() : '';
        const phoneVal = phone ? phone.value.trim() : '';
        if (!nameVal) {
            showStepError("Podaj imię i nazwisko");
            if (name) name.focus();
            return;
        }
        if (!phoneVal || phoneVal.length < 9) {
            showStepError("Podaj prawidłowy numer telefonu");
            if (phone) phone.focus();
            return;
        }
        // Krok 3->4: zloz zamowienie!
        if (typeof submitOrder === 'function') {
            submitOrder();
        }
        goToStep(4);
        return;
    }

    if (currentStep < 4) {
        goToStep(currentStep + 1);
    }
}

// Pomocnicza funkcja do wyswietlania bledow walidacji
function showStepError(message) {
    const existing = document.querySelector('.step-error');
    if (existing) existing.remove();

    const errorDiv = document.createElement('div');
    errorDiv.className = 'step-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = 'color: #e74c3c; text-align: center; padding: 0.75rem; margin: 0.5rem 0; background: #ffeaea; border-radius: 8px; font-size: 0.9rem;';

    const modalBody = document.querySelector('.modal-body');
    const actions = document.getElementById('modalActions');
    if (modalBody && actions) {
        modalBody.insertBefore(errorDiv, actions);
        setTimeout(function() { errorDiv.remove(); }, 3000);
    }
}

function prevStep() {
    if (currentStep > 1) {
        goToStep(currentStep - 1);
    }
}


function showStep(step) {
    // Ukryj wszystkie kroki
    for (let i = 1; i <= 4; i++) {
        const stepEl = document.getElementById('step' + i);
        if (stepEl) stepEl.style.display = "none";
    }

    // Pokaz aktualny krok
    const currentStepEl = document.getElementById('step' + step);
    if (currentStepEl) currentStepEl.style.display = "block";

    // K07 FIX: Aktualizuj step dots
    document.querySelectorAll('.step-dot').forEach(function(dot, i) {
        dot.classList.toggle('active', i < step);
    });

    // K08 FIX: Zarzadzaj przyciskami nawigacji
    var prevBtn = document.getElementById('prevBtn');
    var nextBtn = document.getElementById('nextBtn');
    var modalActions = document.getElementById('modalActions');

    if (prevBtn) {
        prevBtn.style.display = (step > 1 && step < 4) ? '' : 'none';
    }
    if (nextBtn) {
        nextBtn.style.display = step < 4 ? '' : 'none';
        var span = nextBtn.querySelector('span');
        if (span) {
            span.textContent = step === 3 ? 'Złóż zamówienie' : 'Dalej';
        }
    }
    if (modalActions) {
        modalActions.style.display = step < 4 ? '' : 'none';
    }

    // Usun ewentualne stare bledy walidacji
    document.querySelectorAll('.step-error').forEach(function(el) { el.remove(); });
}

// ========== CALENDAR FUNCTIONS ==========

// Initialize calendar
function initCalendar() {
    renderCalendar();
}

// Render calendar
function renderCalendar() {
    const calendar = document.getElementById("calendar");
    if (!calendar) return;

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startingDay = (firstDay.getDay() + 6) % 7; // Monday-first: Mon=0, Sun=6
    const totalDays = lastDay.getDate();

    let html = `
        <div class="calendar-header">
            <button class="calendar-nav" onclick="changeMonth(-1)">←</button>
            <span class="calendar-title">${MONTH_NAMES[currentMonth]} ${currentYear}</span>
            <button class="calendar-nav" onclick="changeMonth(1)">→</button>
        </div>
        <div class="calendar-grid">
    `;

    // Day names header
    DAY_NAMES.forEach(day => {
        html += `<div class="calendar-day-name">${day}</div>`;
    });

    // Empty cells before first day
    for (let i = 0; i < startingDay; i++) {
        html += `<div class="calendar-day empty"></div>`;
    }

    // Days of month
    for (let day = 1; day <= totalDays; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const dateStr = formatDate(date);
        const isDisabled = !isDateAvailable(date);
        const isSelected = selectedDate === dateStr;

        html += `
            <div class="calendar-day ${isDisabled ? "disabled" : ""} ${isSelected ? "selected" : ""}" 
                 ${!isDisabled ? `onclick="selectDate('${dateStr}')"` : ""}>
                ${day}
            </div>
        `;
    }

    html += `</div>`;
    calendar.innerHTML = html;
}

// Change month
function changeMonth(delta) {
    let newMonth = currentMonth + delta;
    let newYear = currentYear;

    if (newMonth > 11) {
        newMonth = 0;
        newYear++;
    } else if (newMonth < 0) {
        newMonth = 11;
        newYear--;
    }

    // S11: Block navigation to past months
    const now = new Date();
    if (newYear < now.getFullYear() || (newYear === now.getFullYear() && newMonth < now.getMonth())) {
        return;
    }

    currentMonth = newMonth;
    currentYear = newYear;
    renderCalendar();
}

// Check if date is available
function isDateAvailable(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate minimum date (today + lead time)
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + MIN_LEAD_DAYS);

    // Check if date is in the past or too soon
    if (date < minDate) return false;

    // Check if date is blocked
    const dateStr = formatDate(date);
    if (BLOCKED_DATES.includes(dateStr)) return false;

    // Don't allow dates more than 60 days in advance
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 60);
    if (date > maxDate) return false;

    return true;
}

// Format date as YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

// Format date for display (Polish)
function formatDateDisplay(dateStr) {
    const date = new Date(dateStr);
    const dayName = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"][date.getDay()];
    const day = date.getDate();
    const month = MONTH_NAMES[date.getMonth()];
    return `${dayName}, ${day} ${month}`;
}

// Select date
function selectDate(dateStr) {
    selectedDate = dateStr;
    selectedTime = null;
    renderCalendar();
    renderTimeSlots();
    goToStep(2);
}

// Get time slots for selected date
function getTimeSlotsForDate(dateStr) {
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();

    if (dayOfWeek === 0) return TIME_SLOTS.sunday;
    if (dayOfWeek === 6) return TIME_SLOTS.saturday;
    return TIME_SLOTS.weekday;
}

// Render time slots
function renderTimeSlots() {
    const container = document.getElementById("timeSlots");
    if (!container || !selectedDate) return;

    const slots = getTimeSlotsForDate(selectedDate);

    let html = `<p style="margin-bottom: 1rem; color: var(--color-text-light);">📅 ${formatDateDisplay(selectedDate)}</p>`;

    html += slots.map(slot => `
        <div class="time-slot ${selectedTime === slot ? "selected" : ""}" 
             onclick="selectTimeSlot('${slot}')">
            🕐 ${slot}
        </div>
    `).join("");

    container.innerHTML = html;
}

// Select time slot
function selectTimeSlot(slot) {
    selectedTime = slot;
    renderTimeSlots();
    goToStep(3);
}

// Get selected booking info
function getBookingInfo() {
    return {
        date: selectedDate,
        dateDisplay: selectedDate ? formatDateDisplay(selectedDate) : null,
        time: selectedTime
    };
}

// Reset booking
function resetBooking() {
    selectedDate = null;
    selectedTime = null;
    currentMonth = new Date().getMonth();
    currentYear = new Date().getFullYear();
}
