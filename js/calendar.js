// ==========================================
// SWEET SPOT - Calendar & Booking System
// ==========================================

let selectedDate = null;
let selectedTime = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

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
const DAY_NAMES = ["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "So"];

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
    const startingDay = firstDay.getDay();
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
    currentMonth += delta;

    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }

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
