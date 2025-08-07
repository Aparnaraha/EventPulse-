// Global Variables
let currentSlide = 0;
const slides = document.querySelectorAll('.event-slide');
const dots = document.querySelectorAll('.dot');
let isAnimating = false;

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize components
    if (slides.length > 0) {
        initializeSlider();
        startCountdowns();
    }
    
    initializeNavigation();
    initializeScrollAnimations();
    initializeCounters();
    initializeNewsletterPopup();
    initializeEventFilters();
    initializeScrollEffects();
    
    // Initialize floating CTA
    initializeFloatingCTA();
}

// Navigation Functions
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
    
    // Navbar scroll effect
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

// Slider Functions
function initializeSlider() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => changeSlide(-1));
        nextBtn.addEventListener('click', () => changeSlide(1));
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Auto-advance slider
    setInterval(() => {
        if (!isAnimating) {
            changeSlide(1);
        }
    }, 8000);
    
    // Touch/swipe support
    let startX = 0;
    let endX = 0;
    
    const sliderContainer = document.getElementById('eventsSlider');
    if (sliderContainer) {
        sliderContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        sliderContainer.addEventListener('touchmove', (e) => {
            e.preventDefault();
        });
        
        sliderContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        });
    }
    
    function handleSwipe() {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                changeSlide(1); // Swipe left - next slide
            } else {
                changeSlide(-1); // Swipe right - previous slide
            }
        }
    }
}

function changeSlide(direction) {
    if (isAnimating) return;
    
    isAnimating = true;
    
    // Update current slide
    currentSlide += direction;
    
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }
    
    goToSlide(currentSlide);
}

function goToSlide(index) {
    if (isAnimating && index !== currentSlide) return;
    
    currentSlide = index;
    
    // Update slider transform
    const sliderContainer = document.getElementById('eventsSlider');
    if (sliderContainer) {
        sliderContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    
    // Update active states
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentSlide);
    });
    
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
    
    setTimeout(() => {
        isAnimating = false;
    }, 500);
}

// Countdown Functions
function startCountdowns() {
    const countdowns = document.querySelectorAll('.event-countdown');
    
    countdowns.forEach(countdown => {
        const targetDate = countdown.getAttribute('data-date');
        if (targetDate) {
            updateCountdown(countdown, targetDate);
            
            // Update every second
            setInterval(() => {
                updateCountdown(countdown, targetDate);
            }, 1000);
        }
    });
}

function updateCountdown(element, targetDate) {
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const difference = target - now;
    
    if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        // Update countdown display
        const daysEl = element.querySelector('#days') || element.querySelector('.countdown-number[data-unit="days"]');
        const hoursEl = element.querySelector('#hours') || element.querySelector('.countdown-number[data-unit="hours"]');
        const minutesEl = element.querySelector('#minutes') || element.querySelector('.countdown-number[data-unit="minutes"]');
        const secondsEl = element.querySelector('#seconds') || element.querySelector('.countdown-number[data-unit="seconds"]');
        
        if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
        
        // If no specific elements found, try generic approach
        const countdownNumbers = element.querySelectorAll('.countdown-number');
        if (countdownNumbers.length >= 4) {
            countdownNumbers[0].textContent = days.toString().padStart(2, '0');
            countdownNumbers[1].textContent = hours.toString().padStart(2, '0');
            countdownNumbers[2].textContent = minutes.toString().padStart(2, '0');
            countdownNumbers[3].textContent = seconds.toString().padStart(2, '0');
        }
    } else {
        // Event has passed
        element.innerHTML = '<div class="countdown-expired">Event Started!</div>';
    }
}

// Counter Animation
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 50);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current).toLocaleString();
        }, 50);
    };
    
    // Animate counters when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Scroll Animations
function initializeScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll, .feature-card, .event-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Add staggered animation for grid items
                if (entry.target.classList.contains('feature-card') || 
                    entry.target.classList.contains('event-card')) {
                    const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(element => {
        element.classList.add('animate-on-scroll');
        observer.observe(element);
    });
}

// Newsletter Popup
function initializeNewsletterPopup() {
    const popup = document.getElementById('newsletterPopup');
    const closeBtn = document.getElementById('closePopup');
    
    if (popup && closeBtn) {
        // Show popup after delay
        setTimeout(() => {
            if (!localStorage.getItem('newsletterShown')) {
                popup.classList.add('show');
            }
        }, 10000);
        
        // Close popup
        closeBtn.addEventListener('click', () => {
            popup.classList.remove('show');
            localStorage.setItem('newsletterShown', 'true');
        });
        
        // Close on outside click
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.classList.remove('show');
                localStorage.setItem('newsletterShown', 'true');
            }
        });
        
        // Handle form submission
        const form = popup.querySelector('.newsletter-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = form.querySelector('input[type="email"]').value;
                
                // Simulate newsletter signup
                console.log('Newsletter signup:', email);
                
                // Show success message
                popup.querySelector('.popup-header h3').textContent = 'Thank you!';
                popup.querySelector('.popup-header p').textContent = 'You\'ve been subscribed to our newsletter.';
                form.style.display = 'none';
                
                setTimeout(() => {
                    popup.classList.remove('show');
                    localStorage.setItem('newsletterShown', 'true');
                }, 2000);
            });
        }
    }
}

// Event Filters
function initializeEventFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const eventCards = document.querySelectorAll('.event-card');
    const searchInput = document.getElementById('searchInput');
    const dateFilter = document.getElementById('dateFilter');
    const locationFilter = document.getElementById('locationFilter');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    // Filter tabs
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const filter = tab.getAttribute('data-filter');
            filterEvents(filter);
        });
    });
    
    // Search input
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterEventsBySearch(searchTerm);
        });
    }
    
    // Date and location filters
    if (dateFilter) {
        dateFilter.addEventListener('change', applyFilters);
    }
    
    if (locationFilter) {
        locationFilter.addEventListener('change', applyFilters);
    }
    
    // Load more button
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            // Simulate loading more events
            loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            
            setTimeout(() => {
                loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Load More Events';
                // Here you would typically load more events from the server
            }, 1500);
        });
    }
    
    function filterEvents(category) {
        eventCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    function filterEventsBySearch(searchTerm) {
        eventCards.forEach(card => {
            const title = card.querySelector('.event-title').textContent.toLowerCase();
            const description = card.querySelector('.event-description').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    function applyFilters() {
        const activeTab = document.querySelector('.filter-tab.active');
        const category = activeTab ? activeTab.getAttribute('data-filter') : 'all';
        const dateValue = dateFilter ? dateFilter.value : 'all';
        const locationValue = locationFilter ? locationFilter.value : 'all';
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        
        eventCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardLocation = card.getAttribute('data-location');
            const cardDate = card.getAttribute('data-date');
            const title = card.querySelector('.event-title').textContent.toLowerCase();
            const description = card.querySelector('.event-description').textContent.toLowerCase();
            
            let showCard = true;
            
            // Category filter
            if (category !== 'all' && cardCategory !== category) {
                showCard = false;
            }
            
            // Location filter
            if (locationValue !== 'all' && cardLocation !== locationValue) {
                showCard = false;
            }
            
            // Date filter (simplified)
            if (dateValue !== 'all') {
                const cardDateObj = new Date(cardDate);
                const now = new Date();
                
                switch (dateValue) {
                    case 'today':
                        if (cardDateObj.toDateString() !== now.toDateString()) {
                            showCard = false;
                        }
                        break;
                    case 'week':
                        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                        if (cardDateObj < now || cardDateObj > weekFromNow) {
                            showCard = false;
                        }
                        break;
                    case 'month':
                        const monthFromNow = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
                        if (cardDateObj < now || cardDateObj > monthFromNow) {
                            showCard = false;
                        }
                        break;
                }
            }
            
            // Search filter
            if (searchTerm && !title.includes(searchTerm) && !description.includes(searchTerm)) {
                showCard = false;
            }
            
            card.style.display = showCard ? 'block' : 'none';
        });
    }
}

// Floating CTA
function initializeFloatingCTA() {
    const floatingCTA = document.getElementById('floatingCTA');
    
    if (floatingCTA) {
        // Show/hide based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 1000) {
                floatingCTA.style.opacity = '1';
                floatingCTA.style.visibility = 'visible';
            } else {
                floatingCTA.style.opacity = '0';
                floatingCTA.style.visibility = 'hidden';
            }
        });
    }
}

// Scroll Effects
function initializeScrollEffects() {
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Utility Functions
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function addToCalendar(eventData) {
    const startDate = new Date(eventData.date + 'T' + eventData.time);
    const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000); // 4 hours later
    
    const formatDate = (date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventData.title)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent(eventData.description)}&location=${encodeURIComponent(eventData.location)}`;
    
    window.open(calendarUrl, '_blank');
}

// Global event listeners for dynamic content
document.addEventListener('click', (e) => {
    // Handle wishlist buttons
    if (e.target.closest('.action-btn[title="Add to Wishlist"]')) {
        e.preventDefault();
        const btn = e.target.closest('.action-btn');
        const icon = btn.querySelector('i');
        
        if (icon.classList.contains('fas')) {
            icon.classList.remove('fas');
            icon.classList.add('far');
            showNotification('Removed from wishlist');
        } else {
            icon.classList.remove('far');
            icon.classList.add('fas');
            showNotification('Added to wishlist');
        }
    }
    
    // Handle share buttons
    if (e.target.closest('.action-btn[title="Share"]')) {
        e.preventDefault();
        if (navigator.share) {
            navigator.share({
                title: 'EventPulse Event',
                text: 'Check out this amazing event!',
                url: window.location.href
            });
        } else {
            // Fallback to copying URL
            navigator.clipboard.writeText(window.location.href);
            showNotification('Event link copied to clipboard');
        }
    }
});

// Form validations
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
});

// Loading states
function showLoading(element) {
    const originalContent = element.innerHTML;
    element.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    element.disabled = true;
    
    return () => {
        element.innerHTML = originalContent;
        element.disabled = false;
    };
}

// Initialize service worker for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}