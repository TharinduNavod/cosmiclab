/**
 * COSMICLAB - MAIN JAVASCRIPT
 * Core functionality and utilities
 */

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollEffects();
    initCommandPalette();
    initTheme();
    initAchievements();
    initNotifications();
    initAnimations();
    checkFirstVisit();
});

// ===================================
// NAVIGATION
// ===================================

function initNavigation() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Hide/show nav on scroll
        if (currentScroll > lastScroll && currentScroll > 100) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });

    // Active link highlighting
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });

    // Mobile menu toggle
    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'mobile-menu-toggle';
    mobileToggle.innerHTML = '☰';
    mobileToggle.style.display = 'none';
    
    if (window.innerWidth <= 768) {
        nav.appendChild(mobileToggle);
        mobileToggle.style.display = 'block';
        
        mobileToggle.addEventListener('click', () => {
            const navLinks = document.querySelector('.nav-links');
            navLinks.classList.toggle('mobile-open');
        });
    }
}

// ===================================
// SCROLL EFFECTS
// ===================================

function initScrollEffects() {
    // Progress bar
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 4px;
        background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
        z-index: 101;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });

    // Scroll reveal elements
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });
}

// ===================================
// COMMAND PALETTE
// ===================================

function initCommandPalette() {
    const commands = [
        { name: 'Go to Home', action: () => window.location.href = 'index.html', keys: ['home'] },
        { name: 'Go to Black Holes', action: () => window.location.href = 'blackholes.html', keys: ['black', 'holes'] },
        { name: 'Go to Quantum', action: () => window.location.href = 'quantum.html', keys: ['quantum'] },
        { name: 'Go to Universe', action: () => window.location.href = 'universe.html', keys: ['universe'] },
        { name: 'Toggle Theme', action: toggleTheme, keys: ['theme', 'dark'] },
        { name: 'Scroll to Top', action: scrollToTop, keys: ['top', 'scroll'] }
    ];

    // Create palette
    const palette = document.createElement('div');
    palette.id = 'command-palette';
    palette.className = 'glass-dark';
    palette.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.9);
        width: 90%;
        max-width: 600px;
        padding: 2rem;
        border-radius: 20px;
        border: 1px solid rgba(138, 43, 226, 0.5);
        z-index: 10000;
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s ease;
    `;

    palette.innerHTML = `
        <input type="text" id="command-search" placeholder="Type a command... (Ctrl+K)" 
               style="width: 100%; padding: 1rem; background: rgba(26, 10, 46, 0.6); 
                      border: 1px solid rgba(138, 43, 226, 0.3); border-radius: 10px; 
                      color: white; font-size: 1.1rem; outline: none;">
        <div id="command-results" style="margin-top: 1rem; max-height: 300px; overflow-y: auto;"></div>
    `;

    document.body.appendChild(palette);

    const searchInput = palette.querySelector('#command-search');
    const resultsDiv = palette.querySelector('#command-results');

    // Toggle palette
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            palette.style.opacity = palette.style.opacity === '1' ? '0' : '1';
            palette.style.pointerEvents = palette.style.opacity === '1' ? 'all' : 'none';
            if (palette.style.opacity === '1') {
                palette.style.transform = 'translate(-50%, -50%) scale(1)';
                searchInput.focus();
                showAllCommands();
            } else {
                palette.style.transform = 'translate(-50%, -50%) scale(0.9)';
            }
        }
        if (e.key === 'Escape') {
            palette.style.opacity = '0';
            palette.style.pointerEvents = 'none';
            palette.style.transform = 'translate(-50%, -50%) scale(0.9)';
        }
    });

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (!query) {
            showAllCommands();
            return;
        }

        const filtered = commands.filter(cmd => 
            cmd.name.toLowerCase().includes(query) || 
            cmd.keys.some(key => key.includes(query))
        );

        displayCommands(filtered);
    });

    function showAllCommands() {
        displayCommands(commands);
    }

    function displayCommands(cmds) {
        resultsDiv.innerHTML = cmds.map(cmd => `
            <div class="command-item" data-command="${cmd.name}" 
                 style="padding: 1rem; margin: 0.5rem 0; background: rgba(26, 10, 46, 0.4); 
                        border-radius: 10px; cursor: pointer; transition: all 0.3s ease; color: white;">
                ${cmd.name}
            </div>
        `).join('');

        resultsDiv.querySelectorAll('.command-item').forEach((item, idx) => {
            item.addEventListener('click', () => {
                cmds[idx].action();
                palette.style.opacity = '0';
                palette.style.pointerEvents = 'none';
                palette.style.transform = 'translate(-50%, -50%) scale(0.9)';
            });

            item.addEventListener('mouseenter', () => {
                item.style.background = 'rgba(138, 43, 226, 0.3)';
                item.style.transform = 'translateX(10px)';
            });

            item.addEventListener('mouseleave', () => {
                item.style.background = 'rgba(26, 10, 46, 0.4)';
                item.style.transform = 'translateX(0)';
            });
        });
    }
}

// ===================================
// THEME MANAGEMENT
// ===================================

function initTheme() {
    const savedTheme = localStorage.getItem('cosmiclab-theme') || 'dark';
    applyTheme(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('cosmiclab-theme', newTheme);
    showNotification('Theme changed to ' + newTheme + ' mode');
}

function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    
    if (theme === 'light') {
        document.body.style.filter = 'invert(1) hue-rotate(180deg)';
    } else {
        document.body.style.filter = '';
    }
}

// ===================================
// ACHIEVEMENTS SYSTEM
// ===================================

const achievements = {
    firstVisit: { id: 'first_visit', name: 'First Steps', desc: 'Visited CosmicLab for the first time' },
    explorer: { id: 'explorer', name: 'Explorer', desc: 'Visited all pages' },
    curious: { id: 'curious', name: 'Curious Mind', desc: 'Spent 5 minutes on site' },
    commandMaster: { id: 'command_master', name: 'Command Master', desc: 'Used command palette' }
};

function initAchievements() {
    const unlocked = JSON.parse(localStorage.getItem('cosmiclab-achievements') || '[]');
    
    // Track time on site
    let timeSpent = 0;
    setInterval(() => {
        timeSpent += 1;
        if (timeSpent >= 300 && !unlocked.includes('curious')) {
            unlockAchievement('curious');
        }
    }, 1000);

    // Track page visits
    const visitedPages = JSON.parse(localStorage.getItem('cosmiclab-pages') || '[]');
    const currentPage = window.location.pathname.split('/').pop();
    if (!visitedPages.includes(currentPage)) {
        visitedPages.push(currentPage);
        localStorage.setItem('cosmiclab-pages', JSON.stringify(visitedPages));
        
        if (visitedPages.length >= 4 && !unlocked.includes('explorer')) {
            unlockAchievement('explorer');
        }
    }
}

function unlockAchievement(achievementId) {
    const unlocked = JSON.parse(localStorage.getItem('cosmiclab-achievements') || '[]');
    
    if (!unlocked.includes(achievementId)) {
        unlocked.push(achievementId);
        localStorage.setItem('cosmiclab-achievements', JSON.stringify(unlocked));
        
        const achievement = Object.values(achievements).find(a => a.id === achievementId);
        if (achievement) {
            showAchievement(achievement.name, achievement.desc);
        }
    }
}

function showAchievement(name, desc) {
    const achievementEl = document.createElement('div');
    achievementEl.className = 'achievement-popup';
    achievementEl.style.cssText = `
        position: fixed;
        top: 5rem;
        right: 2rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 1.5rem 2rem;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(138, 43, 226, 0.8);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.5s ease;
    `;
    
    achievementEl.innerHTML = `
        <strong style="display: block; margin-bottom: 0.5rem;">🏆 Achievement Unlocked!</strong>
        <div style="font-size: 1.1rem; font-weight: 600;">${name}</div>
        <div style="font-size: 0.9rem; opacity: 0.9;">${desc}</div>
    `;
    
    document.body.appendChild(achievementEl);
    
    setTimeout(() => {
        achievementEl.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        achievementEl.style.transform = 'translateX(400px)';
        setTimeout(() => achievementEl.remove(), 500);
    }, 5000);
}

// ===================================
// NOTIFICATIONS
// ===================================

function initNotifications() {
    const container = document.createElement('div');
    container.id = 'notification-container';
    container.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    `;
    document.body.appendChild(container);
}

function showNotification(message, type = 'info', duration = 4000) {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const colors = {
        info: '#667eea',
        success: '#00ff00',
        warning: '#ffd700',
        error: '#ff0000'
    };

    const notification = document.createElement('div');
    notification.className = 'notification glass';
    notification.style.cssText = `
        padding: 1rem 1.5rem;
        border-radius: 10px;
        background: rgba(26, 10, 46, 0.95);
        border: 1px solid ${colors[type]};
        color: white;
        max-width: 300px;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    `;
    
    notification.textContent = message;
    container.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// ===================================
// ANIMATIONS
// ===================================

function initAnimations() {
    // Stagger animations
    const staggerElements = document.querySelectorAll('.stagger-item');
    staggerElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
    });

    // Parallax effect
    window.addEventListener('scroll', () => {
        const parallaxElements = document.querySelectorAll('.parallax');
        parallaxElements.forEach(el => {
            const speed = el.dataset.speed || 0.5;
            const yPos = -(window.pageYOffset * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function debounce(func, wait) {
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

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===================================
// FIRST VISIT
// ===================================

function checkFirstVisit() {
    const hasVisited = localStorage.getItem('cosmiclab-visited');
    
    if (!hasVisited) {
        localStorage.setItem('cosmiclab-visited', 'true');
        unlockAchievement('firstVisit');
        
        setTimeout(() => {
            showNotification('Welcome to CosmicLab! Press Ctrl+K for quick navigation.', 'info', 6000);
        }, 1000);
    }
}

// ===================================
// PERFORMANCE MONITORING
// ===================================

if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
    });
}

// ===================================
// EASTER EGGS
// ===================================

const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    document.body.style.animation = 'rainbowShift 2s linear infinite';
    showNotification('🎉 Konami Code Activated! Rainbow Mode!', 'success');
    
    setTimeout(() => {
        document.body.style.animation = '';
    }, 10000);
}

// ===================================
// EXPORTS
// ===================================

window.CosmicLab = {
    showNotification,
    toggleTheme,
    scrollToTop,
    unlockAchievement,
    debounce,
    throttle
};