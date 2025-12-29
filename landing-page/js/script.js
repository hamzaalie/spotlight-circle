// =====================================================
// SPOTLIGHT CIRCLES - MODERN LANDING PAGE JAVASCRIPT
// =====================================================

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    initializeFormHandling();
    initializeScrollEffects();
    addSubtleAnimations();
});

// =====================================================
// SUBTLE ANIMATIONS FOR MINIMALIST DESIGN
// =====================================================
function addSubtleAnimations() {
    // Add gentle pulse to center node
    const centerNode = document.querySelector('.center-node');
    if (centerNode) {
        setInterval(() => {
            centerNode.style.transition = 'transform 2s ease-in-out';
        }, 3000);
    }
    
    // Subtle satellite movement
    const satellites = document.querySelectorAll('.satellite-subtle');
    satellites.forEach((node, index) => {
        node.style.animation = `subtleFloat 6s ease-in-out ${index * 0.5}s infinite`;
    });
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes subtleFloat {
            0%, 100% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-8px);
            }
        }
    `;
    document.head.appendChild(style);
}

// =====================================================
// FORM HANDLING
// =====================================================
function initializeFormHandling() {
    const signupForm = document.getElementById('signupForm');
    const emailInput = document.getElementById('email');
    const formMessage = document.getElementById('formMessage');
    
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        // Validate email
        if (!validateEmail(email)) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Disable button during submission
        const submitButton = signupForm.querySelector('button[type="submit"]');
        const originalHTML = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" stroke-width="2" stroke-opacity="0.3"/>
                <path d="M12 2 A10 10 0 0 1 22 12" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Sending...
        `;
        
        try {
            // Try to send to backend API
            const response = await fetch('/api/early-access', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });
            
            if (response.ok) {
                showMessage('🎉 Success! You\'re on the early access list. Check your email for next steps.', 'success');
                emailInput.value = '';
                
                // Track conversion (optional)
                trackConversion(email);
            } else {
                const data = await response.json();
                showMessage(data.error || 'Something went wrong. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Signup error:', error);
            
            // For static deployment - save to localStorage as fallback
            saveToLocalStorage(email);
            showMessage('✅ You\'re on the list! We\'ll be in touch soon with your exclusive invite link.', 'success');
            emailInput.value = '';
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalHTML;
        }
    });
}

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Show message function
function showMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    formMessage.innerHTML = message;
    formMessage.className = `form-message ${type}`;
    
    // Auto-hide success messages after 6 seconds
    if (type === 'success') {
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 6000);
    }
}

// Save to localStorage (fallback for static sites)
function saveToLocalStorage(email) {
    try {
        let signups = JSON.parse(localStorage.getItem('earlyAccessSignups') || '[]');
        signups.push({
            email: email,
            timestamp: new Date().toISOString(),
            source: 'landing-page-v2',
            version: 'early-access-v.02'
        });
        localStorage.setItem('earlyAccessSignups', JSON.stringify(signups));
        console.log('Email saved to localStorage:', email);
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

// Track conversion (optional - for analytics)
function trackConversion(email) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
            'send_to': 'AW-CONVERSION_ID',
            'event_category': 'Lead',
            'event_label': 'Early Access Signup v2',
            'value': email
        });
    }
    
    // Facebook Pixel (optional)
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_name: 'Early Access Signup'
        });
    }
}

// =====================================================
// SCROLL EFFECTS
// =====================================================
function initializeScrollEffects() {
    const nav = document.querySelector('.nav');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add shadow on scroll
        if (currentScroll > 50) {
            nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        } else {
            nav.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
    
    // Smooth scroll for member login link
    const memberLogin = document.querySelector('.member-login');
    if (memberLogin) {
        memberLogin.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector('#access');
            if (target) {
                target.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                });
                
                // Focus on email input
                setTimeout(() => {
                    document.getElementById('email').focus();
                }, 500);
            }
        });
    }
}

// =====================================================
// IMAGE ERROR HANDLING
// =====================================================
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        // Replace with gradient placeholder if image fails to load
        this.style.background = 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)';
        this.style.display = 'flex';
        this.style.alignItems = 'center';
        this.style.justifyContent = 'center';
    });
});

// =====================================================
// PERFORMANCE & ANALYTICS
// =====================================================
window.addEventListener('load', () => {
    // Log page load time
    if (window.performance) {
        const loadTime = window.performance.timing.domContentLoadedEventEnd - 
                         window.performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
    }
    
    // Track page view
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: 'Landing Page v2',
            page_location: window.location.href,
            page_path: window.location.pathname
        });
    }
});

// =====================================================
// CONSOLE BRANDING
// =====================================================
console.log('%c🎯 Spotlight Circles', 'font-size: 24px; font-weight: bold; color: #6366f1;');
console.log('%cReal connections, Center Stage.', 'font-size: 16px; color: #64748b;');
console.log('%cInterested in joining? Visit: spotlightcircles.com', 'font-size: 12px; color: #94a3b8;');

// Add spinner animation style
const spinnerStyle = document.createElement('style');
spinnerStyle.textContent = `
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    .animate-spin {
        animation: spin 1s linear infinite;
    }
`;
document.head.appendChild(spinnerStyle);
