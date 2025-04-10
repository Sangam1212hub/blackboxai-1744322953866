// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            
            // Toggle aria-expanded attribute
            const isExpanded = !mobileMenu.classList.contains('hidden');
            mobileMenuButton.setAttribute('aria-expanded', isExpanded);
            
            // Toggle button icon rotation
            mobileMenuButton.querySelector('svg').style.transform = isExpanded ? 'rotate(90deg)' : '';
        });
    }
});

// Smooth scroll functionality
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Animation helper functions
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(element => {
        observer.observe(element);
    });
};

// Progress ring animation
class ProgressRing {
    constructor(element) {
        if (!element) return;
        
        this.svg = element;
        this.circle = element.querySelector('circle:last-child');
        if (!this.circle) return;
        
        this.progress = parseFloat(element.dataset.progress || 0);
        this.circumference = 2 * Math.PI * parseFloat(this.circle.getAttribute('r'));
        
        this.init();
    }

    init() {
        this.circle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
        this.circle.style.strokeDashoffset = this.circumference;
        
        this.setProgress(this.progress);
    }

    setProgress(percent) {
        const offset = this.circumference - (percent / 100 * this.circumference);
        this.circle.style.strokeDashoffset = offset;
    }
}

// Form validation
const validateForm = (formElement) => {
    const inputs = formElement.querySelectorAll('input, textarea');
    let isValid = true;

    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            showError(input, 'This field is required');
        } else if (input.type === 'email' && input.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value.trim())) {
                isValid = false;
                showError(input, 'Please enter a valid email address');
            }
        }
    });

    return isValid;
};

const showError = (input, message) => {
    const errorDiv = input.nextElementSibling?.classList.contains('error-message') 
        ? input.nextElementSibling 
        : document.createElement('div');
    
    if (!input.nextElementSibling?.classList.contains('error-message')) {
        errorDiv.classList.add('error-message', 'text-red-500', 'text-sm', 'mt-1');
        input.parentNode.insertBefore(errorDiv, input.nextElementSibling);
    }
    
    errorDiv.textContent = message;
    input.classList.add('border-red-500');
};

// Initialize animations and event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations
    animateOnScroll();

    // Initialize progress rings if they exist
    document.querySelectorAll('.progress-ring').forEach(ring => {
        new ProgressRing(ring);
    });

    // Form validation
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            if (!validateForm(form)) {
                e.preventDefault();
            }
        });
    });
});

// Handle loading state for buttons
const handleLoadingState = (button, isLoading) => {
    if (isLoading) {
        button.disabled = true;
        button.classList.add('opacity-75', 'cursor-not-allowed');
        button.innerHTML = `
            <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
        `;
    } else {
        button.disabled = false;
        button.classList.remove('opacity-75', 'cursor-not-allowed');
        button.innerHTML = button.dataset.originalText;
    }
};

// Error handling
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Error: ', msg, '\nURL: ', url, '\nLine: ', lineNo, '\nColumn: ', columnNo, '\nError object: ', error);
    return false;
};

// Export utilities for use in other scripts
window.PrepXPro = {
    animateOnScroll,
    ProgressRing,
    validateForm,
    handleLoadingState
};
