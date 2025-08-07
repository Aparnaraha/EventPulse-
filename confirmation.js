// Confirmation page functionality
class ConfirmationPage {
    constructor() {
        this.bookingData = null;
        this.init();
    }
    
    init() {
        this.loadBookingData();
        this.generateQRCode();
        this.bindEvents();
        this.sendConfirmationEmail();
    }
    
    loadBookingData() {
        // Get booking data from session storage
        const storedData = sessionStorage.getItem('bookingData');
        
        if (storedData) {
            this.bookingData = JSON.parse(storedData);
            this.populateConfirmationDetails();
        } else {
            // Fallback demo data
            this.bookingData = {
                reference: 'EP' + Date.now().toString(36).toUpperCase(),
                customer: {
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com',
                    phone: '+1 555 123 4567'
                },
                tickets: {
                    'general': 2
                },
                total: 262.50,
                event: {
                    title: 'Neon Nights Festival 2025',
                    date: 'March 15, 2025',
                    time: '6:00 PM',
                    location: 'Ocean Drive Arena, Miami Beach'
                }
            };
            this.populateConfirmationDetails();
        }
    }
    
    populateConfirmationDetails() {
        const data = this.bookingData;
        
        // Booking reference
        const referenceEl = document.getElementById('bookingReference');
        if (referenceEl) {
            referenceEl.textContent = data.reference;
        }
        
        // Ticket details
        document.getElementById('ticketEventTitle').textContent = data.event.title;
        document.getElementById('ticketDate').textContent = data.event.date;
        document.getElementById('ticketTime').textContent = data.event.time;
        document.getElementById('ticketVenue').textContent = data.event.location;
        document.getElementById('ticketHolder').textContent = `${data.customer.firstName} ${data.customer.lastName}`;
        
        // Customer information
        document.getElementById('customerName').textContent = `${data.customer.firstName} ${data.customer.lastName}`;
        document.getElementById('customerEmail').textContent = data.customer.email;
        document.getElementById('customerPhone').textContent = data.customer.phone;
        document.getElementById('bookingDate').textContent = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Order breakdown
        this.populateOrderBreakdown();
        
        // Barcode number
        document.getElementById('barcodeNumber').textContent = data.reference.replace(/[A-Z]/g, '').padEnd(12, '0');
    }
    
    populateOrderBreakdown() {
        const data = this.bookingData;
        const breakdownEl = document.getElementById('orderBreakdown');
        
        const ticketTypes = {
            'early-bird': { name: 'Early Bird', price: 99 },
            'general': { name: 'General Admission', price: 125 },
            'vip': { name: 'VIP Experience', price: 299 },
            'backstage': { name: 'Backstage Pass', price: 599 }
        };
        
        let html = '';
        let subtotal = 0;
        
        Object.entries(data.tickets).forEach(([ticketType, quantity]) => {
            const ticket = ticketTypes[ticketType];
            const total = ticket.price * quantity;
            subtotal += total;
            
            html += `
                <div class="breakdown-item">
                    <span>${ticket.name} × ${quantity}</span>
                    <span>$${total.toFixed(2)}</span>
                </div>
            `;
        });
        
        const serviceFee = subtotal * 0.05;
        const grandTotal = subtotal + serviceFee;
        
        html += `
            <div class="breakdown-item">
                <span>Service Fee</span>
                <span>$${serviceFee.toFixed(2)}</span>
            </div>
            <div class="breakdown-item total">
                <span>Total</span>
                <span>$${grandTotal.toFixed(2)}</span>
            </div>
        `;
        
        breakdownEl.innerHTML = html;
    }
    
    generateQRCode() {
        const canvas = document.getElementById('qrCode');
        const data = this.bookingData;
        
        // QR code data includes booking reference and basic event info
        const qrData = JSON.stringify({
            ref: data.reference,
            event: data.event.title,
            date: data.event.date,
            holder: `${data.customer.firstName} ${data.customer.lastName}`,
            tickets: Object.values(data.tickets).reduce((a, b) => a + b, 0)
        });
        
        if (typeof QRCode !== 'undefined') {
            QRCode.toCanvas(canvas, qrData, {
                width: 120,
                margin: 1,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            }, (error) => {
                if (error) {
                    console.error('QR Code generation error:', error);
                    // Fallback to simple text
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, 120, 120);
                    ctx.fillStyle = '#000000';
                    ctx.font = '12px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('QR Code', 60, 60);
                }
            });
        }
    }
    
    bindEvents() {
        // Copy reference button
        const copyBtn = document.getElementById('copyReference');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const reference = document.getElementById('bookingReference').textContent;
                navigator.clipboard.writeText(reference).then(() => {
                    this.showNotification('Booking reference copied to clipboard!', 'success');
                    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => {
                        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                    }, 2000);
                });
            });
        }
        
        // Download PDF button
        const downloadBtn = document.getElementById('downloadPDF');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                this.downloadPDF();
            });
        }
        
        // Add to calendar button
        const calendarBtn = document.getElementById('addToCalendar');
        if (calendarBtn) {
            calendarBtn.addEventListener('click', () => {
                this.addToCalendar();
            });
        }
        
        // Share booking button
        const shareBtn = document.getElementById('shareBooking');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                this.shareBooking();
            });
        }
    }
    
    downloadPDF() {
        if (typeof jsPDF === 'undefined') {
            this.showNotification('PDF generation not available', 'error');
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const data = this.bookingData;
        
        // PDF Header
        doc.setFontSize(20);
        doc.setTextColor(139, 92, 246);
        doc.text('EventPulse', 20, 30);
        
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('Event Ticket Confirmation', 20, 45);
        
        // Booking Reference
        doc.setFontSize(12);
        doc.text(`Booking Reference: ${data.reference}`, 20, 60);
        
        // Event Details
        doc.setFontSize(14);
        doc.text('Event Details:', 20, 80);
        doc.setFontSize(12);
        doc.text(`Event: ${data.event.title}`, 25, 95);
        doc.text(`Date: ${data.event.date}`, 25, 105);
        doc.text(`Time: ${data.event.time}`, 25, 115);
        doc.text(`Venue: ${data.event.location}`, 25, 125);
        
        // Customer Details
        doc.setFontSize(14);
        doc.text('Customer Details:', 20, 145);
        doc.setFontSize(12);
        doc.text(`Name: ${data.customer.firstName} ${data.customer.lastName}`, 25, 160);
        doc.text(`Email: ${data.customer.email}`, 25, 170);
        doc.text(`Phone: ${data.customer.phone}`, 25, 180);
        
        // Ticket Summary
        doc.setFontSize(14);
        doc.text('Ticket Summary:', 20, 200);
        
        let yPosition = 215;
        const ticketTypes = {
            'early-bird': { name: 'Early Bird', price: 99 },
            'general': { name: 'General Admission', price: 125 },
            'vip': { name: 'VIP Experience', price: 299 },
            'backstage': { name: 'Backstage Pass', price: 599 }
        };
        
        Object.entries(data.tickets).forEach(([ticketType, quantity]) => {
            const ticket = ticketTypes[ticketType];
            const total = ticket.price * quantity;
            doc.setFontSize(12);
            doc.text(`${ticket.name} x ${quantity}: $${total.toFixed(2)}`, 25, yPosition);
            yPosition += 10;
        });
        
        // Total
        doc.text(`Total: $${data.total.toFixed(2)}`, 25, yPosition + 10);
        
        // Important Notes
        doc.setFontSize(14);
        doc.text('Important Notes:', 20, yPosition + 35);
        doc.setFontSize(10);
        doc.text('• Please bring a valid photo ID matching the ticket holder name', 25, yPosition + 50);
        doc.text('• Arrive 30-60 minutes before the event start time', 25, yPosition + 60);
        doc.text('• Present this ticket (digital or printed) at the entrance', 25, yPosition + 70);
        doc.text('• For support, contact: support@eventpulse.com or +1 (555) 123-4567', 25, yPosition + 80);
        
        // Save the PDF
        doc.save(`EventPulse-Ticket-${data.reference}.pdf`);
        
        this.showNotification('PDF ticket downloaded successfully!', 'success');
    }
    
    addToCalendar() {
        const data = this.bookingData;
        const eventDate = new Date(data.event.date + ' ' + data.event.time);
        const endDate = new Date(eventDate.getTime() + 4 * 60 * 60 * 1000); // 4 hours later
        
        const formatDate = (date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };
        
        const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE` +
            `&text=${encodeURIComponent(data.event.title)}` +
            `&dates=${formatDate(eventDate)}/${formatDate(endDate)}` +
            `&details=${encodeURIComponent(`Booking Reference: ${data.reference}\n\nDon't forget to bring your ID and arrive early!`)}` +
            `&location=${encodeURIComponent(data.event.location)}`;
        
        window.open(calendarUrl, '_blank');
        this.showNotification('Opening Google Calendar...', 'info');
    }
    
    shareBooking() {
        const data = this.bookingData;
        const shareText = `🎉 I'm going to ${data.event.title}! Join me at this amazing event on ${data.event.date}. Get your tickets at EventPulse!`;
        
        if (navigator.share) {
            navigator.share({
                title: `${data.event.title} - EventPulse`,
                text: shareText,
                url: window.location.origin
            }).then(() => {
                this.showNotification('Thanks for sharing!', 'success');
            }).catch(() => {
                this.fallbackShare(shareText);
            });
        } else {
            this.fallbackShare(shareText);
        }
    }
    
    fallbackShare(text) {
        // Copy to clipboard as fallback
        navigator.clipboard.writeText(text + ' ' + window.location.origin).then(() => {
            this.showNotification('Share text copied to clipboard!', 'success');
        }).catch(() => {
            // Show share modal as last resort
            this.showShareModal(text);
        });
    }
    
    showShareModal(text) {
        const modal = document.createElement('div');
        modal.className = 'share-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Share Event</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Share this event with your friends:</p>
                    <textarea readonly>${text} ${window.location.origin}</textarea>
                    <div class="share-buttons">
                        <a href="https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}" target="_blank" class="share-btn facebook">
                            <i class="fab fa-facebook"></i> Facebook
                        </a>
                        <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.origin)}" target="_blank" class="share-btn twitter">
                            <i class="fab fa-twitter"></i> Twitter
                        </a>
                        <a href="https://wa.me/?text=${encodeURIComponent(text + ' ' + window.location.origin)}" target="_blank" class="share-btn whatsapp">
                            <i class="fab fa-whatsapp"></i> WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal
        modal.querySelector('.modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    sendConfirmationEmail() {
        // Simulate sending confirmation email
        setTimeout(() => {
            this.showNotification('Confirmation email sent! Check your inbox.', 'success');
        }, 2000);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `confirmation-notification confirmation-notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        const autoRemove = setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);
        
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

// Confirmation page styles
const confirmationStyles = `
    .confirmation-section {
        padding: 120px 0 60px;
        background: var(--bg-primary);
        min-height: 100vh;
    }
    
    .confirmation-header {
        text-align: center;
        margin-bottom: 60px;
    }
    
    .success-icon {
        width: 80px;
        height: 80px;
        background: var(--gradient-secondary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 30px;
        font-size: 2.5rem;
        color: white;
        box-shadow: var(--shadow-glow);
        animation: successPulse 2s infinite;
    }
    
    @keyframes successPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    .confirmation-title {
        font-family: var(--font-primary);
        font-size: 3rem;
        font-weight: 900;
        background: var(--gradient-neon);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 15px;
    }
    
    .confirmation-subtitle {
        font-size: 1.2rem;
        color: var(--text-secondary);
        margin-bottom: 30px;
    }
    
    .booking-reference {
        background: var(--bg-card);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        padding: 20px 30px;
        display: inline-flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 20px;
    }
    
    .reference-label {
        color: var(--text-secondary);
        font-weight: 600;
    }
    
    .reference-number {
        font-family: var(--font-primary);
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--neon-cyan);
        letter-spacing: 2px;
    }
    
    .copy-btn {
        background: transparent;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 8px;
        border-radius: 8px;
        transition: var(--transition-fast);
    }
    
    .copy-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
    }
    
    .confirmation-content {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 40px;
        margin-bottom: 60px;
    }
    
    .ticket-details .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        flex-wrap: wrap;
        gap: 20px;
    }
    
    .ticket-actions {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
    }
    
    .digital-ticket {
        background: linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%);
        border: 2px solid var(--primary-purple);
        border-radius: 20px;
        overflow: hidden;
        box-shadow: var(--shadow-card);
        margin-bottom: 30px;
        color: #000;
    }
    
    .ticket-header {
        background: var(--gradient-primary);
        color: white;
        padding: 20px 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .ticket-logo {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 1.5rem;
        font-weight: 700;
    }
    
    .ticket-type {
        background: rgba(255, 255, 255, 0.2);
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 600;
    }
    
    .ticket-content {
        padding: 30px;
        display: flex;
        gap: 30px;
        align-items: center;
    }
    
    .event-info {
        flex: 1;
    }
    
    .event-title {
        font-size: 1.8rem;
        font-weight: 700;
        margin-bottom: 20px;
        color: #000;
    }
    
    .event-details {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    
    .detail-row {
        display: flex;
        gap: 15px;
    }
    
    .detail-label {
        font-weight: 600;
        color: #666;
        min-width: 80px;
    }
    
    .detail-value {
        color: #000;
        font-weight: 500;
    }
    
    .ticket-qr {
        text-align: center;
        padding: 20px;
        background: rgba(139, 92, 246, 0.1);
        border-radius: 15px;
        border: 2px dashed var(--primary-purple);
    }
    
    .qr-text {
        margin-top: 10px;
        font-size: 12px;
        color: #666;
        font-weight: 600;
    }
    
    .ticket-footer {
        background: #F8F9FA;
        border-top: 1px dashed #DDD;
        padding: 20px 30px;
        text-align: center;
    }
    
    .barcode-lines {
        display: flex;
        justify-content: center;
        gap: 2px;
        margin-bottom: 10px;
    }
    
    .barcode-lines span {
        width: 3px;
        height: 40px;
        background: #000;
        display: block;
    }
    
    .barcode-lines span:nth-child(odd) {
        height: 35px;
    }
    
    .barcode-number {
        font-family: var(--font-primary);
        font-size: 14px;
        font-weight: 700;
        color: #000;
        letter-spacing: 2px;
        margin: 0;
    }
    
    .booking-summary {
        background: var(--bg-card);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 30px;
        height: fit-content;
        position: sticky;
        top: 120px;
    }
    
    .booking-summary h3 {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 25px;
        color: var(--text-primary);
    }
    
    .summary-card {
        display: flex;
        flex-direction: column;
        gap: 30px;
    }
    
    .customer-info h4,
    .order-breakdown h4 {
        font-size: 1.2rem;
        font-weight: 700;
        margin-bottom: 15px;
        color: var(--neon-purple);
    }
    
    .info-grid {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    
    .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .info-item:last-child {
        border-bottom: none;
    }
    
    .info-label {
        color: var(--text-secondary);
        font-weight: 500;
    }
    
    .info-value {
        color: var(--text-primary);
        font-weight: 600;
    }
    
    .breakdown-items {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    
    .breakdown-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        color: var(--text-secondary);
    }
    
    .breakdown-item.total {
        font-size: 1.2rem;
        font-weight: 700;
        color: var(--text-primary);
        border-top: 1px solid rgba(255, 255, 255, 0.2);
        padding-top: 15px;
        margin-top: 10px;
    }
    
    .important-info {
        background: var(--bg-card);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 40px;
        margin-bottom: 40px;
    }
    
    .important-info h3 {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 30px;
        color: var(--text-primary);
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .important-info h3 i {
        color: var(--neon-orange);
    }
    
    .important-info .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 25px;
    }
    
    .info-card {
        display: flex;
        gap: 15px;
        padding: 20px;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        transition: var(--transition-smooth);
    }
    
    .info-card:hover {
        background: rgba(255, 255, 255, 0.05);
        transform: translateY(-2px);
    }
    
    .info-icon {
        width: 50px;
        height: 50px;
        background: var(--gradient-secondary);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        color: white;
        flex-shrink: 0;
    }
    
    .info-content h4 {
        font-size: 1.1rem;
        font-weight: 700;
        margin-bottom: 8px;
        color: var(--text-primary);
    }
    
    .info-content p {
        color: var(--text-secondary);
        line-height: 1.5;
        font-size: 14px;
    }
    
    .next-steps {
        background: var(--bg-card);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 40px;
        margin-bottom: 40px;
    }
    
    .next-steps h3 {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 30px;
        color: var(--text-primary);
        text-align: center;
    }
    
    .steps-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 30px;
    }
    
    .step {
        text-align: center;
        position: relative;
    }
    
    .step-number {
        width: 50px;
        height: 50px;
        background: var(--gradient-primary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: 700;
        color: white;
        margin: 0 auto 20px;
        box-shadow: var(--shadow-glow);
    }
    
    .step-content h4 {
        font-size: 1.2rem;
        font-weight: 700;
        margin-bottom: 10px;
        color: var(--text-primary);
    }
    
    .step-content p {
        color: var(--text-secondary);
        line-height: 1.5;
    }
    
    .confirmation-actions {
        text-align: center;
        display: flex;
        justify-content: center;
        gap: 20px;
        flex-wrap: wrap;
    }
    
    .btn-success {
        background: linear-gradient(135deg, var(--neon-green), #10B981);
        color: white;
        border: none;
        padding: 16px 32px;
        border-radius: 50px;
        font-weight: 600;
        cursor: pointer;
        transition: var(--transition-smooth);
        display: flex;
        align-items: center;
        gap: 8px;
        text-decoration: none;
        font-size: 16px;
    }
    
    .btn-success:hover {
        transform: translateY(-2px);
        box-shadow: 0 0 30px rgba(16, 185, 129, 0.5);
    }
    
    .booking-status {
        display: flex;
        align-items: center;
        gap: 8px;
        background: var(--gradient-secondary);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 600;
    }
    
    .confirmation-notification {
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
    
    .confirmation-notification.show {
        transform: translateX(0);
    }
    
    .confirmation-notification-success {
        border-left: 4px solid var(--neon-green);
    }
    
    .confirmation-notification-error {
        border-left: 4px solid #EF4444;
    }
    
    .confirmation-notification-warning {
        border-left: 4px solid var(--neon-orange);
    }
    
    .confirmation-notification-info {
        border-left: 4px solid var(--neon-cyan);
    }
    
    .share-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    }
    
    .modal-content {
        background: var(--bg-card);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 30px;
        max-width: 500px;
        width: 90%;
        position: relative;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
    
    .modal-close {
        background: none;
        border: none;
        color: var(--text-secondary);
        font-size: 24px;
        cursor: pointer;
    }
    
    .modal-body textarea {
        width: 100%;
        height: 100px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: var(--text-primary);
        padding: 15px;
        border-radius: 8px;
        resize: none;
        margin-bottom: 20px;
    }
    
    .share-buttons {
        display: flex;
        gap: 15px;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .share-btn {
        padding: 12px 20px;
        border-radius: 8px;
        text-decoration: none;
        color: white;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: var(--transition-smooth);
    }
    
    .share-btn.facebook {
        background: #1877F2;
    }
    
    .share-btn.twitter {
        background: #1DA1F2;
    }
    
    .share-btn.whatsapp {
        background: #25D366;
    }
    
    .share-btn:hover {
        transform: translateY(-2px);
        opacity: 0.9;
    }
    
    @media (max-width: 1024px) {
        .confirmation-content {
            grid-template-columns: 1fr;
        }
        
        .booking-summary {
            position: static;
            order: -1;
        }
    }
    
    @media (max-width: 768px) {
        .confirmation-title {
            font-size: 2rem;
        }
        
        .ticket-content {
            flex-direction: column;
            text-align: center;
        }
        
        .ticket-actions {
            justify-content: center;
        }
        
        .confirmation-actions {
            flex-direction: column;
            align-items: center;
        }
        
        .confirmation-actions > * {
            width: 100%;
            max-width: 300px;
        }
        
        .steps-container {
            grid-template-columns: 1fr;
        }
        
        .confirmation-notification {
            left: 20px;
            right: 20px;
            max-width: none;
        }
    }
`;

// Inject confirmation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = confirmationStyles;
document.head.appendChild(styleSheet);

// Initialize confirmation page when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.confirmation-section')) {
        new ConfirmationPage();
    }
});