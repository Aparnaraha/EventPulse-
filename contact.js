// Contact page functionality
class ContactPage {
    constructor() {
        this.chatWidget = null;
        this.chatMessages = [];
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.initializeLiveChat();
    }
    
    bindEvents() {
        // Contact form submission
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(e.target);
            });
        }
        
        // Live chat button
        const liveChatBtn = document.getElementById('liveChatBtn');
        if (liveChatBtn) {
            liveChatBtn.addEventListener('click', () => {
                this.openLiveChat();
            });
        }
        
        // Priority level change
        const prioritySelect = document.getElementById('priority');
        if (prioritySelect) {
            prioritySelect.addEventListener('change', (e) => {
                this.updatePriorityInfo(e.target.value);
            });
        }
        
        // Subject change
        const subjectSelect = document.getElementById('subject');
        if (subjectSelect) {
            subjectSelect.addEventListener('change', (e) => {
                this.updateSubjectInfo(e.target.value);
            });
        }
    }
    
    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validate required fields
        if (!this.validateForm(data)) {
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            this.showNotification('Message sent successfully! We\'ll get back to you within 2 hours.', 'success');
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Show confirmation modal
            this.showConfirmationModal(data);
        }, 2000);
    }
    
    validateForm(data) {
        const required = ['firstName', 'lastName', 'email', 'subject', 'message'];
        const missing = required.filter(field => !data[field] || data[field].trim() === '');
        
        if (missing.length > 0) {
            this.showNotification(`Please fill in all required fields: ${missing.join(', ')}`, 'error');
            return false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return false;
        }
        
        return true;
    }
    
    updatePriorityInfo(priority) {
        const priorityInfo = {
            'low': 'Response within 24 hours',
            'medium': 'Response within 4 hours',
            'high': 'Response within 1 hour',
            'emergency': 'Immediate response - Call us directly'
        };
        
        // Show priority info
        let infoElement = document.querySelector('.priority-info');
        if (!infoElement) {
            infoElement = document.createElement('div');
            infoElement.className = 'priority-info';
            document.getElementById('priority').parentNode.appendChild(infoElement);
        }
        
        infoElement.innerHTML = `<i class="fas fa-info-circle"></i> ${priorityInfo[priority]}`;
        infoElement.className = `priority-info priority-${priority}`;
        
        // Show emergency contact for emergency priority
        if (priority === 'emergency') {
            this.showEmergencyContact();
        }
    }
    
    updateSubjectInfo(subject) {
        const subjectInfo = {
            'booking': 'Please include your booking reference number if you have one.',
            'refund': 'Refund requests are processed within 5-7 business days.',
            'event-info': 'Check our FAQ section for common event questions.',
            'technical': 'Please describe the issue and what device/browser you\'re using.',
            'accessibility': 'We\'re committed to making our events accessible to everyone.',
            'media': 'Media inquiries will be forwarded to our PR team.',
            'partnership': 'Partnership proposals will be reviewed by our business development team.',
            'feedback': 'We value your feedback and use it to improve our services.'
        };
        
        if (subjectInfo[subject]) {
            let infoElement = document.querySelector('.subject-info');
            if (!infoElement) {
                infoElement = document.createElement('div');
                infoElement.className = 'subject-info';
                document.getElementById('subject').parentNode.appendChild(infoElement);
            }
            
            infoElement.innerHTML = `<i class="fas fa-lightbulb"></i> ${subjectInfo[subject]}`;
        }
    }
    
    showEmergencyContact() {
        const modal = document.createElement('div');
        modal.className = 'emergency-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-exclamation-triangle"></i> Emergency Support</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>For emergency support (events happening within 24 hours), please call us directly:</p>
                    <div class="emergency-contact">
                        <a href="tel:+975553629" class="btn-primary btn-lg">
                            <i class="fas fa-phone"></i>
                            Call Now: +1 (555) 123-4567
                        </a>
                    </div>
                    <p>Or use WhatsApp for immediate assistance:</p>
                    <div class="emergency-contact">
                        <a href="https://wa.me/975553629" class="btn-success btn-lg" target="_blank">
                            <i class="fab fa-whatsapp"></i>
                            WhatsApp Support
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
    
    showConfirmationModal(data) {
        const ticketNumber = 'SUP' + Date.now().toString(36).toUpperCase();
        
        const modal = document.createElement('div');
        modal.className = 'confirmation-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-check-circle"></i> Message Sent Successfully!</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="ticket-info">
                        <p>Your support ticket has been created:</p>
                        <div class="ticket-number">
                            <strong>Ticket #${ticketNumber}</strong>
                            <button class="copy-ticket" data-ticket="${ticketNumber}">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                    </div>
                    <div class="response-time">
                        <i class="fas fa-clock"></i>
                        <span>Expected response time: ${this.getResponseTime(data.priority)}</span>
                    </div>
                    <div class="next-steps">
                        <h4>What happens next?</h4>
                        <ul>
                            <li>We'll review your message and assign it to the right team</li>
                            <li>You'll receive a confirmation email with your ticket number</li>
                            <li>Our support team will respond within the expected timeframe</li>
                            <li>You can track your ticket status via email updates</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Copy ticket number
        modal.querySelector('.copy-ticket').addEventListener('click', (e) => {
            const ticketNum = e.target.dataset.ticket;
            navigator.clipboard.writeText(ticketNum);
            this.showNotification('Ticket number copied!', 'success');
        });
        
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
    
    getResponseTime(priority) {
        const times = {
            'low': '24 hours',
            'medium': '4 hours',
            'high': '1 hour',
            'emergency': '15 minutes'
        };
        return times[priority] || '4 hours';
    }
    
    initializeLiveChat() {
        this.chatWidget = document.getElementById('liveChatWidget');
        const chatClose = document.getElementById('chatClose');
        const chatSend = document.getElementById('chatSend');
        const chatInput = document.getElementById('chatInput');
        
        if (chatClose) {
            chatClose.addEventListener('click', () => {
                this.closeLiveChat();
            });
        }
        
        if (chatSend) {
            chatSend.addEventListener('click', () => {
                this.sendChatMessage();
            });
        }
        
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendChatMessage();
                }
            });
        }
    }
    
    openLiveChat() {
        if (this.chatWidget) {
            this.chatWidget.classList.add('active');
            document.getElementById('chatInput').focus();
        }
    }
    
    closeLiveChat() {
        if (this.chatWidget) {
            this.chatWidget.classList.remove('active');
        }
    }
    
    sendChatMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addChatMessage(message, 'user');
        input.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            this.handleBotResponse(message);
        }, 1000);
    }
    
    addChatMessage(message, sender) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${sender}`;
        
        const avatar = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageElement.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <p>${message}</p>
                <span class="message-time">${time}</span>
            </div>
        `;
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    handleBotResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        let response = '';
        
        if (lowerMessage.includes('booking') || lowerMessage.includes('ticket')) {
            response = 'I can help you with booking issues! Do you have a booking reference number? If so, please share it and I\'ll look up your reservation.';
        } else if (lowerMessage.includes('refund') || lowerMessage.includes('cancel')) {
            response = 'For refund requests, I can guide you through the process. Refunds are typically processed within 5-7 business days. What\'s your booking reference?';
        } else if (lowerMessage.includes('event') || lowerMessage.includes('schedule')) {
            response = 'I can provide information about our events! Which event are you interested in? You can also check our events page for detailed schedules and information.';
        } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            response = 'Hello! I\'m here to help with any questions about EventPulse. What can I assist you with today?';
        } else if (lowerMessage.includes('help')) {
            response = 'I\'m here to help! I can assist with booking issues, event information, refunds, and general questions. What do you need help with?';
        } else {
            response = 'Thanks for your message! For complex issues, I\'d recommend connecting with our human support team. Would you like me to transfer you to a live agent?';
        }
        
        this.addChatMessage(response, 'bot');
        
        // Add quick action buttons for common responses
        if (lowerMessage.includes('booking') || lowerMessage.includes('refund')) {
            setTimeout(() => {
                this.addQuickActions();
            }, 500);
        }
    }
    
    addQuickActions() {
        const messagesContainer = document.getElementById('chatMessages');
        const actionsElement = document.createElement('div');
        actionsElement.className = 'chat-quick-actions';
        actionsElement.innerHTML = `
            <p>Quick actions:</p>
            <div class="quick-buttons">
                <button class="quick-btn" data-action="human">Talk to Human</button>
                <button class="quick-btn" data-action="email">Send Email</button>
                <button class="quick-btn" data-action="phone">Call Support</button>
            </div>
        `;
        
        messagesContainer.appendChild(actionsElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Handle quick action clicks
        actionsElement.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleQuickAction(action);
            });
        });
    }
    
    handleQuickAction(action) {
        switch (action) {
            case 'human':
                this.addChatMessage('Connecting you to a human agent...', 'bot');
                setTimeout(() => {
                    this.addChatMessage('A support agent will be with you shortly. Average wait time is 2-3 minutes.', 'bot');
                }, 1000);
                break;
            case 'email':
                this.closeLiveChat();
                document.getElementById('contactForm').scrollIntoView({ behavior: 'smooth' });
                break;
            case 'phone':
                window.open('tel:+975553629');
                break;
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `contact-notification contact-notification-${type}`;
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

// Contact page styles
const contactStyles = `
    .contact-section {
        padding: 60px 0;
        background: var(--bg-primary);
    }
    
    .contact-methods {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
        margin-bottom: 80px;
    }
    
    .contact-card {
        background: var(--bg-card);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 40px 30px;
        text-align: center;
        transition: var(--transition-smooth);
    }
    
    .contact-card:hover {
        transform: translateY(-10px);
        box-shadow: var(--shadow-neon);
        border-color: var(--primary-purple);
    }
    
    .contact-icon {
        width: 80px;
        height: 80px;
        background: var(--gradient-primary);
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        color: white;
        margin: 0 auto 20px;
        box-shadow: var(--shadow-glow);
    }
    
    .contact-card h3 {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 15px;
        color: var(--text-primary);
    }
    
    .contact-card p {
        color: var(--text-secondary);
        margin-bottom: 25px;
        line-height: 1.6;
    }
    
    .contact-buttons {
        display: flex;
        flex-direction: column;
        gap: 15px;
        align-items: center;
    }
    
    .whatsapp-btn {
        background: #25D366 !important;
    }
    
    .whatsapp-btn:hover {
        background: #128C7E !important;
    }
    
    .contact-content {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 60px;
    }
    
    .contact-form-section {
        background: var(--bg-card);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 40px;
    }
    
    .contact-form {
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
    
    .form-group input,
    .form-group select,
    .form-group textarea {
        width: 100%;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: var(--text-primary);
        padding: 15px 20px;
        border-radius: 8px;
        font-size: 16px;
        transition: var(--transition-fast);
        font-family: inherit;
    }
    
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: var(--primary-purple);
        background: rgba(255, 255, 255, 0.08);
    }
    
    .form-group textarea {
        resize: vertical;
        min-height: 120px;
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
        display: none;
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
    
    .priority-info,
    .subject-info {
        margin-top: 8px;
        padding: 10px 15px;
        border-radius: 8px;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .priority-info {
        background: rgba(6, 182, 212, 0.1);
        border: 1px solid var(--neon-cyan);
        color: var(--neon-cyan);
    }
    
    .priority-info.priority-high {
        background: rgba(249, 115, 22, 0.1);
        border-color: var(--neon-orange);
        color: var(--neon-orange);
    }
    
    .priority-info.priority-emergency {
        background: rgba(239, 68, 68, 0.1);
        border-color: #EF4444;
        color: #EF4444;
    }
    
    .subject-info {
        background: rgba(139, 92, 246, 0.1);
        border: 1px solid var(--primary-purple);
        color: var(--primary-purple);
    }
    
    .contact-info-section {
        display: flex;
        flex-direction: column;
        gap: 30px;
    }
    
    .contact-info-card,
    .office-hours-card,
    .faq-links-card {
        background: var(--bg-card);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 30px;
    }
    
    .contact-info-card h3,
    .office-hours-card h3,
    .faq-links-card h3 {
        font-size: 1.3rem;
        font-weight: 700;
        margin-bottom: 25px;
        color: var(--text-primary);
    }
    
    .info-items {
        display: flex;
        flex-direction: column;
        gap: 25px;
    }
    
    .info-item {
        display: flex;
        gap: 15px;
        align-items: flex-start;
    }
    
    .info-icon {
        width: 45px;
        height: 45px;
        background: var(--gradient-secondary);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        color: white;
        flex-shrink: 0;
    }
    
    .info-content h4 {
        font-size: 1.1rem;
        font-weight: 700;
        margin-bottom: 5px;
        color: var(--text-primary);
    }
    
    .info-content p {
        color: var(--text-secondary);
        margin-bottom: 5px;
    }
    
    .info-content a {
        color: var(--neon-purple);
        text-decoration: none;
    }
    
    .info-content small {
        color: var(--text-muted);
        font-size: 12px;
    }
    
    .hours-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    
    .hours-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .hours-item:last-child {
        border-bottom: none;
    }
    
    .emergency-note {
        margin-top: 20px;
        padding: 15px;
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid #EF4444;
        border-radius: 8px;
        display: flex;
        align-items: flex-start;
        gap: 10px;
        color: #EF4444;
        font-size: 14px;
    }
    
    .faq-links {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-bottom: 25px;
    }
    
    .faq-link {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 15px;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        color: var(--text-secondary);
        text-decoration: none;
        transition: var(--transition-fast);
    }
    
    .faq-link:hover {
        background: rgba(255, 255, 255, 0.05);
        color: var(--text-primary);
        border-color: var(--primary-purple);
    }
    
    .btn-sm {
        padding: 10px 20px;
        font-size: 14px;
    }
    
    .live-chat-widget {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 350px;
        height: 500px;
        background: var(--bg-card);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        box-shadow: var(--shadow-card);
        z-index: 1000;
        display: flex;
        flex-direction: column;
        transform: translateY(100%);
        opacity: 0;
        visibility: hidden;
        transition: var(--transition-smooth);
    }
    
    .live-chat-widget.active {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
    }
    
    .chat-header {
        background: var(--gradient-primary);
        color: white;
        padding: 15px 20px;
        border-radius: 20px 20px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .chat-title {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 600;
    }
    
    .chat-close {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 5px;
        border-radius: 4px;
        transition: var(--transition-fast);
    }
    
    .chat-close:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .chat-messages {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    
    .chat-message {
        display: flex;
        gap: 10px;
        align-items: flex-start;
    }
    
    .chat-message.user {
        flex-direction: row-reverse;
    }
    
    .message-avatar {
        width: 35px;
        height: 35px;
        background: var(--gradient-secondary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 14px;
        flex-shrink: 0;
    }
    
    .chat-message.user .message-avatar {
        background: var(--gradient-primary);
    }
    
    .message-content {
        max-width: 70%;
        background: rgba(255, 255, 255, 0.05);
        padding: 12px 15px;
        border-radius: 15px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .chat-message.user .message-content {
        background: var(--primary-purple);
        color: white;
    }
    
    .message-content p {
        margin: 0;
        font-size: 14px;
        line-height: 1.4;
    }
    
    .message-time {
        font-size: 11px;
        color: var(--text-muted);
        margin-top: 5px;
        display: block;
    }
    
    .chat-message.user .message-time {
        color: rgba(255, 255, 255, 0.7);
    }
    
    .chat-quick-actions {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 15px;
        margin: 10px 0;
    }
    
    .chat-quick-actions p {
        margin: 0 0 10px 0;
        font-size: 13px;
        color: var(--text-secondary);
    }
    
    .quick-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }
    
    .quick-btn {
        background: var(--primary-purple);
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 15px;
        font-size: 12px;
        cursor: pointer;
        transition: var(--transition-fast);
    }
    
    .quick-btn:hover {
        background: var(--primary-pink);
    }
    
    .chat-input {
        padding: 15px 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        gap: 10px;
        align-items: center;
    }
    
    .chat-input input {
        flex: 1;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: var(--text-primary);
        padding: 10px 15px;
        border-radius: 20px;
        font-size: 14px;
    }
    
    .chat-input input:focus {
        outline: none;
        border-color: var(--primary-purple);
    }
    
    .chat-input button {
        width: 40px;
        height: 40px;
        background: var(--gradient-primary);
        border: none;
        border-radius: 50%;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: var(--transition-fast);
    }
    
    .chat-input button:hover {
        transform: scale(1.05);
    }
    
    .map-section {
        padding: 80px 0;
        background: var(--bg-secondary);
    }
    
    .map-container {
        background: var(--bg-card);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        overflow: hidden;
        height: 400px;
    }
    
    .map-placeholder {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 40px;
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1));
    }
    
    .map-placeholder i {
        font-size: 4rem;
        color: var(--neon-cyan);
        margin-bottom: 20px;
    }
    
    .map-placeholder h3 {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 10px;
        color: var(--text-primary);
    }
    
    .map-placeholder p {
        color: var(--text-secondary);
        margin-bottom: 30px;
    }
    
    .map-buttons {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
        justify-content: center;
    }
    
    .emergency-modal,
    .confirmation-modal {
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
    
    .modal-header h3 {
        color: var(--text-primary);
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .modal-close {
        background: none;
        border: none;
        color: var(--text-secondary);
        font-size: 24px;
        cursor: pointer;
    }
    
    .emergency-contact {
        text-align: center;
        margin: 20px 0;
    }
    
    .ticket-info {
        text-align: center;
        margin-bottom: 20px;
    }
    
    .ticket-number {
        background: var(--bg-secondary);
        border: 1px solid var(--primary-purple);
        border-radius: 10px;
        padding: 15px;
        margin: 15px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        font-family: var(--font-primary);
        font-size: 1.2rem;
        color: var(--neon-cyan);
    }
    
    .copy-ticket {
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 5px;
        border-radius: 4px;
        transition: var(--transition-fast);
    }
    
    .copy-ticket:hover {
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
    }
    
    .response-time {
        background: rgba(6, 182, 212, 0.1);
        border: 1px solid var(--neon-cyan);
        border-radius: 8px;
        padding: 15px;
        margin: 20px 0;
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--neon-cyan);
    }
    
    .next-steps h4 {
        color: var(--text-primary);
        margin-bottom: 15px;
    }
    
    .next-steps ul {
        color: var(--text-secondary);
        padding-left: 20px;
    }
    
    .next-steps li {
        margin-bottom: 8px;
        line-height: 1.5;
    }
    
    .contact-notification {
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
    
    .contact-notification.show {
        transform: translateX(0);
    }
    
    .contact-notification-success {
        border-left: 4px solid var(--neon-green);
    }
    
    .contact-notification-error {
        border-left: 4px solid #EF4444;
    }
    
    .contact-notification-warning {
        border-left: 4px solid var(--neon-orange);
    }
    
    .contact-notification-info {
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
    
    .contact-notification-success .notification-content i:first-child {
        color: var(--neon-green);
    }
    
    .contact-notification-error .notification-content i:first-child {
        color: #EF4444;
    }
    
    .contact-notification-warning .notification-content i:first-child {
        color: var(--neon-orange);
    }
    
    .contact-notification-info .notification-content i:first-child {
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
    
    @media (max-width: 1024px) {
        .contact-content {
            grid-template-columns: 1fr;
            gap: 40px;
        }
        
        .live-chat-widget {
            width: 320px;
            height: 450px;
        }
    }
    
    @media (max-width: 768px) {
        .form-grid {
            grid-template-columns: 1fr;
        }
        
        .contact-methods {
            grid-template-columns: 1fr;
        }
        
        .live-chat-widget {
            width: 300px;
            height: 400px;
            bottom: 10px;
            right: 10px;
        }
        
        .map-buttons {
            flex-direction: column;
            align-items: center;
        }
        
        .contact-notification {
            left: 20px;
            right: 20px;
            max-width: none;
        }
    }
`;

// Inject contact styles
const styleSheet = document.createElement('style');
styleSheet.textContent = contactStyles;
document.head.appendChild(styleSheet);

// Initialize contact page when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.contact-section')) {
        new ContactPage();
    }
});