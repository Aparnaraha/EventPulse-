// Booking functionality
class BookingSystem {
    constructor() {
        this.tickets = {
            'early-bird': { name: 'Early Bird', price: 99, max: 10, available: 25 },
            'general': { name: 'General Admission', price: 125, max: 10, available: 1800 },
            'vip': { name: 'VIP Experience', price: 299, max: 6, available: 150 },
            'backstage': { name: 'Backstage Pass', price: 599, max: 4, available: 25 }
        };
        
        this.cart = {};
        this.currentStep = 1;
        this.customerData = {};
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateDisplay();
        this.startReservationTimer();
    }
    
    bindEvents() {
        // Quantity controls
        document.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const ticketType = btn.dataset.ticket;
                const isPlus = btn.classList.contains('plus');
                this.updateQuantity(ticketType, isPlus ? 1 : -1);
            });
        });
        
        // Direct input changes
        document.querySelectorAll('.qty-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const ticketType = input.dataset.ticket;
                const quantity = parseInt(e.target.value) || 0;
                this.setQuantity(ticketType, quantity);
            });
        });
        
        // Continue button
        const continueBtn = document.getElementById('continueBtn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                this.proceedToDetails();
            });
        }
        
        // Back button
        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.goBackToTickets();
            });
        }
        
        // Form submission
        const bookingForm = document.getElementById('bookingForm');
        if (bookingForm) {
            bookingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.proceedToPayment();
            });
        }
    }
    
    updateQuantity(ticketType, change) {
        const currentQty = this.cart[ticketType] || 0;
        const newQty = Math.max(0, currentQty + change);
        const maxQty = this.tickets[ticketType].max;
        
        if (newQty <= maxQty) {
            this.setQuantity(ticketType, newQty);
        } else {
            this.showNotification(`Maximum ${maxQty} tickets allowed per person`, 'warning');
        }
    }
    
    setQuantity(ticketType, quantity) {
        const maxQty = this.tickets[ticketType].max;
        const available = this.tickets[ticketType].available;
        
        quantity = Math.max(0, Math.min(quantity, maxQty, available));
        
        if (quantity === 0) {
            delete this.cart[ticketType];
        } else {
            this.cart[ticketType] = quantity;
        }
        
        this.updateDisplay();
        this.updateContinueButton();
    }
    
    updateDisplay() {
        // Update quantity inputs
        Object.keys(this.tickets).forEach(ticketType => {
            const input = document.querySelector(`input[data-ticket="${ticketType}"]`);
            if (input) {
                input.value = this.cart[ticketType] || 0;
            }
        });
        
        // Update order summary
        this.updateOrderSummary();
        
        // Update availability displays
        this.updateAvailability();
    }
    
    updateOrderSummary() {
        const summaryItems = document.getElementById('summaryItems');
        const subtotalEl = document.getElementById('subtotal');
        const serviceFeeEl = document.getElementById('serviceFee');
        const totalEl = document.getElementById('total');
        
        if (!summaryItems) return;
        
        let html = '';
        let subtotal = 0;
        
        if (Object.keys(this.cart).length === 0) {
            html = '<div class="summary-item"><span>No tickets selected</span></div>';
        } else {
            Object.entries(this.cart).forEach(([ticketType, quantity]) => {
                const ticket = this.tickets[ticketType];
                const itemTotal = ticket.price * quantity;
                subtotal += itemTotal;
                
                html += `
                    <div class="summary-item">
                        <div>
                            <strong>${ticket.name}</strong><br>
                            <small>${quantity} × $${ticket.price}</small>
                        </div>
                        <span>$${itemTotal.toFixed(2)}</span>
                    </div>
                `;
            });
        }
        
        summaryItems.innerHTML = html;
        
        const serviceFee = subtotal * 0.05; // 5% service fee
        const total = subtotal + serviceFee;
        
        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        if (serviceFeeEl) serviceFeeEl.textContent = `$${serviceFee.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    }
    
    updateAvailability() {
        Object.keys(this.tickets).forEach(ticketType => {
            const ticketElement = document.querySelector(`[data-ticket="${ticketType}"]`).closest('.ticket-type');
            const availabilityText = ticketElement.querySelector('.availability-text');
            const availabilityFill = ticketElement.querySelector('.availability-fill');
            
            const ticket = this.tickets[ticketType];
            const reserved = this.cart[ticketType] || 0;
            const remaining = ticket.available - reserved;
            
            if (availabilityText) {
                if (remaining <= 10) {
                    availabilityText.textContent = `Only ${remaining} left!`;
                    availabilityText.style.color = '#F97316';
                } else {
                    availabilityText.textContent = `${remaining} available`;
                }
            }
            
            // Update progress bar (simulate booking percentage)
            if (availabilityFill) {
                const bookedPercentage = ((1000 - remaining) / 1000) * 100;
                availabilityFill.style.width = `${Math.min(bookedPercentage, 95)}%`;
            }
        });
    }
    
    updateContinueButton() {
        const continueBtn = document.getElementById('continueBtn');
        const hasTickets = Object.keys(this.cart).length > 0;
        
        if (continueBtn) {
            continueBtn.disabled = !hasTickets;
            if (hasTickets) {
                continueBtn.innerHTML = '<i class="fas fa-arrow-right"></i> Continue to Details';
            } else {
                continueBtn.innerHTML = '<i class="fas fa-ticket-alt"></i> Select Tickets First';
            }
        }
    }
    
    proceedToDetails() {
        if (Object.keys(this.cart).length === 0) {
            this.showNotification('Please select at least one ticket', 'warning');
            return;
        }
        
        // Update progress
        this.currentStep = 2;
        this.updateProgressBar();
        
        // Hide ticket selection, show customer details
        const ticketSelection = document.querySelector('.ticket-selection').parentElement;
        const customerDetails = document.getElementById('customerDetails');
        
        if (ticketSelection && customerDetails) {
            ticketSelection.style.display = 'none';
            customerDetails.style.display = 'block';
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        // Clone sidebar to customer details section
        this.cloneSidebar();
    }
    
    goBackToTickets() {
        this.currentStep = 1;
        this.updateProgressBar();
        
        const ticketSelection = document.querySelector('.ticket-selection').parentElement;
        const customerDetails = document.getElementById('customerDetails');
        
        if (ticketSelection && customerDetails) {
            ticketSelection.style.display = 'block';
            customerDetails.style.display = 'none';
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    proceedToPayment() {
        // Validate form
        const form = document.getElementById('bookingForm');
        const formData = new FormData(form);
        
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const email = formData.get('email');
        const phone = formData.get('phone');
        
        if (!firstName || !lastName || !email || !phone) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        if (!this.validateEmail(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Store customer data
        this.customerData = {
            firstName,
            lastName,
            email,
            phone,
            dateOfBirth: formData.get('dateOfBirth'),
            newsletter: formData.get('newsletter') === 'on',
            whatsapp: formData.get('whatsapp') === 'on'
        };
        
        // Simulate payment processing
        this.processPayment();
    }
    
    processPayment() {
        // Show loading state
        const submitBtn = document.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Payment...';
        submitBtn.disabled = true;
        
        // Simulate payment delay
        setTimeout(() => {
            // Generate booking reference
            const bookingRef = this.generateBookingReference();
            
            // Redirect to confirmation page with booking data
            const bookingData = {
                reference: bookingRef,
                customer: this.customerData,
                tickets: this.cart,
                total: this.calculateTotal(),
                event: this.getEventData()
            };
            
            // Store booking data for confirmation page
            sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
            
            // Redirect to confirmation
            window.location.href = 'confirmation.html';
        }, 3000);
    }
    
    cloneSidebar() {
        const originalSidebar = document.querySelector('.event-sidebar');
        const customerDetailsSection = document.getElementById('customerDetails');
        const existingSidebar = customerDetailsSection.querySelector('.event-sidebar');
        
        if (originalSidebar && customerDetailsSection && !existingSidebar) {
            const clonedSidebar = originalSidebar.cloneNode(true);
            const container = customerDetailsSection.querySelector('.booking-container');
            container.insertBefore(clonedSidebar, container.firstChild);
        }
    }
    
    updateProgressBar() {
        const steps = document.querySelectorAll('.progress-step');
        steps.forEach((step, index) => {
            if (index < this.currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        // Update header progress text
        const progressText = document.querySelector('.booking-progress span');
        if (progressText) {
            progressText.textContent = `Step ${this.currentStep} of 3`;
        }
    }
    
    startReservationTimer() {
        let timeLeft = 15 * 60; // 15 minutes in seconds
        
        const updateTimer = () => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            
            // Update timer display if exists
            const timerElement = document.querySelector('.reservation-timer');
            if (timerElement) {
                timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
            
            if (timeLeft <= 0) {
                this.showNotification('Your ticket reservation has expired. Please start over.', 'error');
                setTimeout(() => {
                    window.location.href = 'events.html';
                }, 3000);
                return;
            }
            
            timeLeft--;
        };
        
        updateTimer();
        setInterval(updateTimer, 1000);
    }
    
    calculateTotal() {
        let subtotal = 0;
        Object.entries(this.cart).forEach(([ticketType, quantity]) => {
            subtotal += this.tickets[ticketType].price * quantity;
        });
        
        const serviceFee = subtotal * 0.05;
        return subtotal + serviceFee;
    }
    
    getEventData() {
        // Get event data from URL parameters or default
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get('event') || '1';
        
        // This would typically come from a database
        const events = {
            '1': {
                id: '1',
                title: 'Neon Nights Festival 2025',
                date: 'March 15, 2025',
                time: '6:00 PM',
                location: 'Ocean Drive Arena, Miami Beach',
                image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400'
            }
        };
        
        return events[eventId] || events['1'];
    }
    
    generateBookingReference() {
        return 'EP' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 5).toUpperCase();
    }
    
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `booking-notification booking-notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto remove
        const autoRemove = setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);
        
        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(autoRemove);
            this.removeNotification(notification);
        });
    }
    
    removeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// Additional booking page styles
const bookingStyles = `
    .booking-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-card);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 15px 20px;
        color: var(--text-primary);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 350px;
        box-shadow: var(--shadow-card);
    }
    
    .booking-notification.show {
        transform: translateX(0);
    }
    
    .booking-notification-success {
        border-left: 4px solid var(--neon-green);
    }
    
    .booking-notification-error {
        border-left: 4px solid #EF4444;
    }
    
    .booking-notification-warning {
        border-left: 4px solid var(--neon-orange);
    }
    
    .booking-notification-info {
        border-left: 4px solid var(--neon-cyan);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .notification-content i:first-child {
        font-size: 18px;
        flex-shrink: 0;
    }
    
    .booking-notification-success .notification-content i:first-child {
        color: var(--neon-green);
    }
    
    .booking-notification-error .notification-content i:first-child {
        color: #EF4444;
    }
    
    .booking-notification-warning .notification-content i:first-child {
        color: var(--neon-orange);
    }
    
    .booking-notification-info .notification-content i:first-child {
        color: var(--neon-cyan);
    }
    
    .notification-close {
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        margin-left: auto;
        flex-shrink: 0;
        padding: 4px;
        border-radius: 4px;
        transition: var(--transition-fast);
    }
    
    .notification-close:hover {
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
    }
    
    .reservation-timer {
        color: var(--neon-orange);
        font-weight: 700;
        font-family: var(--font-primary);
    }
    
    .customer-details {
        padding: 120px 0 60px;
        background: var(--bg-primary);
        min-height: 100vh;
    }
    
    .details-form {
        background: var(--bg-card);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 40px;
    }
    
    .booking-form {
        margin-top: 30px;
    }
    
    .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 20px;
    }
    
    .form-group {
        margin-bottom: 20px;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
        color: var(--text-primary);
    }
    
    .form-group input {
        width: 100%;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: var(--text-primary);
        padding: 15px 20px;
        border-radius: 8px;
        font-size: 16px;
        transition: var(--transition-fast);
    }
    
    .form-group input:focus {
        outline: none;
        border-color: var(--primary-purple);
        background: rgba(255, 255, 255, 0.08);
    }
    
    .form-group small {
        display: block;
        margin-top: 5px;
        color: var(--text-secondary);
        font-size: 14px;
    }
    
    .checkbox-group {
        display: flex;
        align-items: flex-start;
        gap: 12px;
    }
    
    .checkbox-label {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        cursor: pointer;
        line-height: 1.5;
        margin-bottom: 0;
    }
    
    .checkbox-label input[type="checkbox"] {
        width: auto;
        margin: 0;
    }
    
    .checkmark {
        width: 20px;
        height: 20px;
        background: rgba(255, 255, 255, 0.05);
        border: 2px solid rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        position: relative;
        flex-shrink: 0;
        margin-top: 2px;
    }
    
    .checkbox-label input[type="checkbox"]:checked + .checkmark {
        background: var(--primary-purple);
        border-color: var(--primary-purple);
    }
    
    .checkbox-label input[type="checkbox"]:checked + .checkmark::after {
        content: '✓';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-weight: bold;
        font-size: 12px;
    }
    
    .checkbox-label input[type="checkbox"] {
        display: none;
    }
    
    .form-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 40px;
        gap: 20px;
        flex-wrap: wrap;
    }
    
    .back-btn {
        background: transparent;
        border: 2px solid rgba(255, 255, 255, 0.2);
        color: var(--text-secondary);
    }
    
    .back-btn:hover {
        border-color: var(--text-secondary);
        color: var(--text-primary);
        background: transparent;
    }
    
    @media (max-width: 768px) {
        .form-grid {
            grid-template-columns: 1fr;
        }
        
        .form-actions {
            flex-direction: column;
        }
        
        .form-actions button {
            width: 100%;
        }
        
        .booking-notification {
            left: 20px;
            right: 20px;
            max-width: none;
        }
    }
`;

// Inject booking styles
const styleSheet = document.createElement('style');
styleSheet.textContent = bookingStyles;
document.head.appendChild(styleSheet);

// Initialize booking system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.booking-section')) {
        new BookingSystem();
    }
});