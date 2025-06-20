// smooth scrolling
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

// scrolling animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// obseve fade in elements
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// mobile menu toggle
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});

// header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#fff';
        header.style.backdropFilter = 'none';
    }
});

// hover effects to service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const rate = scrolled * -0.5;
    
    if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
    }
});

//  loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// contact form handling
function handleContactForm() {
    // will need to integrate with backend
    alert('Thank you for your interest! We will contact you soon.');
}

// click tracking for CTA buttons
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function(e) {
        // analytics
        console.log('CTA clicked:', this.textContent);
    });
});

// API integration
const API_BASE_URL = 'http://localhost:3000/api';

// fetch services from backend
async function fetchServices() {
    try {
        const response = await fetch(`${API_BASE_URL}/services`);
        const services = await response.json();
        console.log('Services loaded:', services);
        return services;
    } catch (error) {
        console.error('Error fetching services:', error);
        return [];
    }
}

// fetch testimonials from backend
async function fetchTestimonials() {
    try {
        const response = await fetch(`${API_BASE_URL}/testimonials`);
        const testimonials = await response.json();
        console.log('Testimonials loaded:', testimonials);
        return testimonials;
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        return [];
    }
}

// submit contact form
async function submitContactForm(formData) {
    try {
        const response = await fetch(`${API_BASE_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('Contact form submitted:', result);
            alert('Thank you for your message! We will contact you soon.');
            return true;
        } else {
            throw new Error('Failed to submit form');
        }
    } catch (error) {
        console.error('Error submitting contact form:', error);
        alert('There was an error submitting your message. Please try again.');
        return false;
    }
}

// initialize dynamic content when page loads
document.addEventListener('DOMContentLoaded', async () => {
    
    const services = await fetchServices();
    const testimonials = await fetchTestimonials();
    
    // update service cards with API data
    if (services.length > 0) {
        updateServiceCards(services);
    }
    
    // update testimonials with API data
    if (testimonials.length > 0) {
        updateTestimonialCards(testimonials);
    }
});

// update service cards dynamically
function updateServiceCards(services) {
    const serviceGrid = document.querySelector('.services-grid');
    if (!serviceGrid || services.length === 0) return;
    
    // clear existing content
    serviceGrid.innerHTML = '';
    
    // add new service cards
    services.forEach(service => {
        const serviceCard = createServiceCard(service);
        serviceGrid.appendChild(serviceCard);
    });
}

// create service card element
function createServiceCard(service) {
    const card = document.createElement('div');
    card.className = 'service-card fade-in';
    
    card.innerHTML = `
        <div class="service-icon">${service.icon}</div>
        <h3>${service.name}</h3>
        <p>${service.description}</p>
        <a href="#" class="service-link">Learn More</a>
    `;
    
    return card;
}

// update testimonial cards dynamically
function updateTestimonialCards(testimonials) {
    const testimonialGrid = document.querySelector('.testimonials-grid');
    if (!testimonialGrid || testimonials.length === 0) return;
    
    //clear existing content
    testimonialGrid.innerHTML = '';
    
    // dd new testimonials
    testimonials.forEach(testimonial => {
        const testimonialCard = createTestimonialCard(testimonial);
        testimonialGrid.appendChild(testimonialCard);
    });
}

// create testimonial card element
function createTestimonialCard(testimonial) {
    const card = document.createElement('div');
    card.className = 'testimonial-card fade-in';
    
    card.innerHTML = `
        <p class="testimonial-text">${testimonial.text}</p>
        <div class="testimonial-author">${testimonial.author}</div>
        <div class="testimonial-role">${testimonial.role}</div>
    `;
    
    return card;
}

// mobile menu
function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (!mobileMenuBtn || !navLinks) return;
    
    mobileMenuBtn.addEventListener('click', () => {
        const isOpen = navLinks.classList.contains('mobile-open');
        
        if (isOpen) {
            navLinks.classList.remove('mobile-open');
            navLinks.style.display = 'none';
        } else {
            navLinks.classList.add('mobile-open');
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.background = 'white';
            navLinks.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            navLinks.style.padding = '1rem';
        }
    });
}

// initialize enhanced features
document.addEventListener('DOMContentLoaded', () => {
    initializeMobileMenu();
});