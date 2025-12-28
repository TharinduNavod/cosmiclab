document.addEventListener('DOMContentLoaded', () => {
    initLoadingScreen();
    initNavigation();
    initScrollEffects();
    initStarfield();
    initParticles();
    initAnimateStats();
    initIntersectionObserver();
});

// Loading Screen with Animation
function initLoadingScreen() {
    setTimeout(() => {
        const loader = document.getElementById('loadingScreen');
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 500);
    }, 2000);
}

// Modern Navigation with Smooth Scroll
function initNavigation() {
    const nav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Active link on scroll
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offset = 80;
                    const targetPosition = target.offsetTop - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });
}

// Scroll Effects
function initScrollEffects() {
    const progressBar = document.getElementById('progressBar');
    
    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Animated Starfield Canvas
function initStarfield() {
    const canvas = document.getElementById('stars');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const stars = [];
    const numStars = 200;
    
    class Star {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.z = Math.random() * canvas.width;
            this.size = Math.random() * 2;
            this.speed = Math.random() * 0.5 + 0.1;
        }
        
        update() {
            this.z -= this.speed;
            if (this.z <= 0) {
                this.z = canvas.width;
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
            }
        }
        
        draw() {
            const x = (this.x - canvas.width / 2) * (canvas.width / this.z) + canvas.width / 2;
            const y = (this.y - canvas.height / 2) * (canvas.width / this.z) + canvas.height / 2;
            const s = this.size * (canvas.width / this.z);
            
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 255, 255, ${1 - this.z / canvas.width})`;
            ctx.arc(x, y, s, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    for (let i = 0; i < numStars; i++) {
        stars.push(new Star());
    }
    
    function animate() {
        ctx.fillStyle = 'rgba(10, 10, 26, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        stars.forEach(star => {
            star.update();
            star.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Floating Particles Background
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.borderRadius = '50%';
        particle.style.background = `linear-gradient(135deg, rgba(102, 126, 234, ${Math.random() * 0.3}), rgba(240, 147, 251, ${Math.random() * 0.3}))`;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${Math.random() * 10 + 10}s linear infinite`;
        particle.style.animationDelay = Math.random() * 5 + 's';
        
        container.appendChild(particle);
    }
    
    // Add CSS animation
    if (!document.getElementById('particle-animation')) {
        const style = document.createElement('style');
        style.id = 'particle-animation';
        style.textContent = `
            @keyframes float {
                0% {
                    transform: translate(0, 0) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 0.5;
                }
                90% {
                    opacity: 0.5;
                }
                100% {
                    transform: translate(${Math.random() * 200 - 100}px, -100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Animated Stats Counter
function initAnimateStats() {
    const stats = document.querySelectorAll('.stat-number');
    let animated = false;
    
    const animateValue = (element, start, end, duration) => {
        const startTime = performance.now();
        const isDecimal = end % 1 !== 0;
        
        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = start + (end - start) * easeOutQuart;
            
            element.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
            
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                element.textContent = isDecimal ? end.toFixed(1) : end;
            }
        };
        
        requestAnimationFrame(step);
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                stats.forEach(stat => {
                    const target = parseFloat(stat.getAttribute('data-target'));
                    animateValue(stat, 0, target, 2000);
                });
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

// Intersection Observer for Fade-in Animations
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe cards and sections
    const elements = document.querySelectorAll('.sim-card, .gallery-item, .stat-card, .section-header');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// Global UI Helpers
function navigateWithTransition(url) {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
        window.location.href = url;
    }, 300);
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = toast.querySelector('.toast-message');
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Theme Toggle
let darkMode = true;
function toggleTheme() {
    darkMode = !darkMode;
    const root = document.documentElement;
    
    if (darkMode) {
        root.style.setProperty('--bg-dark', '#0a0a1a');
        root.style.setProperty('--text-main', '#ffffff');
    } else {
        root.style.setProperty('--bg-dark', '#f5f5f5');
        root.style.setProperty('--text-main', '#1a1a1a');
    }
    
    showToast(darkMode ? 'Dark mode enabled' : 'Light mode enabled');
}

// Command Palette
function toggleCommandPalette() {
    showToast('Command Palette coming soon! Press Ctrl+K');
}

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // Command Palette: Ctrl+K or Cmd+K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
    }
    
    // Quick navigation: Numbers 1-4
    if (e.altKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                window.location.href = '#home';
                break;
            case '2':
                e.preventDefault();
                window.location.href = '#simulations';
                break;
            case '3':
                e.preventDefault();
                window.location.href = '#explore';
                break;
            case '4':
                e.preventDefault();
                window.location.href = '#about';
                break;
        }
    }
});

// Mouse parallax effect on hero
const hero = document.querySelector('.hero-content');
if (hero) {
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
        hero.style.transform = `translate(${mouseX * 20}px, ${mouseY * 20}px)`;
    });
}

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = 80;
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Add ripple effect to buttons
document.querySelectorAll('.btn, .sim-card').forEach(element => {
    element.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple-effect');
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple effect CSS
if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add loading state to page transitions
window.addEventListener('beforeunload', () => {
    document.body.style.opacity = '0';
});