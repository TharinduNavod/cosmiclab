/**
 * COSMICLAB - UNIVERSE SCALE EXPLORER
 * Interactive scale visualization from quantum to cosmic
 */

class UniverseScaleExplorer {
    constructor() {
        this.slider = document.getElementById('scale');
        this.scaleObject = document.getElementById('scaleObject');
        this.scaleText = document.getElementById('scaleText');
        this.comparison = document.getElementById('comparison');
        this.sizeComparison = document.getElementById('sizeComparison');

        if (!this.slider || !this.scaleObject) {
            console.error('Required elements not found');
            return;
        }

        // Scale definitions
        this.scales = [
            {
                value: 1,
                name: 'Planck Length',
                size: 20,
                info: '10⁻³⁵ meters',
                compare: 'The smallest meaningful distance in physics. Quantum foam at this scale makes spacetime uncertain.',
                color: '#ffffff',
                fact: 'At this scale, space and time become granular like pixels.'
            },
            {
                value: 10,
                name: 'Proton',
                size: 30,
                info: '10⁻¹⁵ meters',
                compare: '100 million times smaller than an atom. Made of quarks held together by the strong force.',
                color: '#ff00ff',
                fact: 'A proton contains 99.9% of an atom\'s mass.'
            },
            {
                value: 20,
                name: 'Atom',
                size: 50,
                info: '10⁻¹⁰ meters',
                compare: 'Building block of all matter. Mostly empty space with electrons orbiting the nucleus.',
                color: '#00ffff',
                fact: 'If an atom were the size of a stadium, its nucleus would be a marble.'
            },
            {
                value: 30,
                name: 'Virus',
                size: 70,
                info: '10⁻⁸ meters',
                compare: 'Smaller than wavelength of visible light. Can only be seen with electron microscopes.',
                color: '#00ff00',
                fact: 'Viruses are on the boundary between living and non-living.'
            },
            {
                value: 40,
                name: 'Human Cell',
                size: 100,
                info: '10⁻⁵ meters',
                compare: 'Your body contains 37 trillion cells, each a complex molecular machine.',
                color: '#ffff00',
                fact: 'Red blood cells travel 300 miles through your body in their lifetime.'
            },
            {
                value: 50,
                name: 'Human',
                size: 150,
                info: '~2 meters',
                compare: 'Made of billions of cells. The only known conscious observers in the universe.',
                color: '#ffa500',
                fact: 'Your body replaces most of its cells every 7-10 years.'
            },
            {
                value: 60,
                name: 'Mount Everest',
                size: 180,
                info: '8,849 meters',
                compare: 'Tallest mountain on Earth. Still tiny compared to planetary scales.',
                color: '#ff6600',
                fact: 'Everest grows about 4mm every year due to tectonic plates.'
            },
            {
                value: 70,
                name: 'Earth',
                size: 220,
                info: '12,742 km diameter',
                compare: '7.9 billion humans call this home. A pale blue dot in the cosmic ocean.',
                color: '#4169e1',
                fact: 'Earth travels 67,000 mph around the Sun.'
            },
            {
                value: 80,
                name: 'Sun',
                size: 260,
                info: '1.4 million km',
                compare: '109 times wider than Earth. Contains 99.86% of solar system mass.',
                color: '#ffd700',
                fact: 'The Sun converts 4 million tons of matter into energy every second.'
            },
            {
                value: 90,
                name: 'Solar System',
                size: 300,
                info: '287 billion km',
                compare: 'Takes light 8 hours to cross from Sun to Neptune.',
                color: '#ff8c00',
                fact: 'Voyager 1 has been traveling for 46 years and barely left the solar system.'
            },
            {
                value: 95,
                name: 'Milky Way',
                size: 340,
                info: '100,000 light-years',
                compare: '200-400 billion stars. Our Sun orbits the center every 225 million years.',
                color: '#9370db',
                fact: 'The Milky Way is on a collision course with Andromeda galaxy.'
            },
            {
                value: 100,
                name: 'Observable Universe',
                size: 380,
                info: '93 billion light-years',
                compare: '2 trillion galaxies and counting. Everything we can ever observe.',
                color: '#ff1493',
                fact: 'The universe is expanding faster than the speed of light.'
            }
        ];

        // Statistics
        this.stats = {
            explored: new Set(),
            jumps: 0,
            timeSpent: 0,
            level: 'Beginner'
        };

        this.init();
    }

    init() {
        // Initialize slider
        this.slider.addEventListener('input', () => this.updateScale());
        this.updateScale();

        // Rotation animation
        setInterval(() => {
            if (this.scaleObject) {
                const currentRotation = parseFloat(
                    this.scaleObject.style.transform?.match(/rotate\(([^)]+)deg\)/)?.[1] || 0
                );
                this.scaleObject.style.transform = `rotate(${currentRotation + 1}deg)`;
            }
        }, 50);

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.slider.value = Math.max(1, parseInt(this.slider.value) - 5);
                this.updateScale();
            }
            if (e.key === 'ArrowRight') {
                this.slider.value = Math.min(100, parseInt(this.slider.value) + 5);
                this.updateScale();
            }
        });

        // Track time
        setInterval(() => {
            this.stats.timeSpent++;
        }, 1000);
    }

    updateScale() {
        const value = parseInt(this.slider.value);
        let currentScale = this.scales[0];

        // Find current scale
        for (let i = 0; i < this.scales.length; i++) {
            if (value >= this.scales[i].value) {
                currentScale = this.scales[i];
            }
        }

        // Track exploration
        this.stats.explored.add(currentScale.name);

        // Update size
        const size = currentScale.size + (value - currentScale.value) * 2;
        this.scaleObject.style.width = size + 'px';
        this.scaleObject.style.height = size + 'px';

        // Update colors
        const hue = (value / 100) * 280;
        this.scaleObject.style.background = `radial-gradient(circle at 30% 30%, 
            hsl(${hue}, 100%, 60%), 
            hsl(${hue + 30}, 100%, 50%), 
            hsl(${hue + 60}, 100%, 40%))`;
        this.scaleObject.style.boxShadow = `0 0 ${size}px hsla(${hue}, 100%, 50%, 0.6)`;

        // Update text
        this.scaleText.innerHTML = `
            <strong>${currentScale.name}</strong><br>
            <span style="font-size: 1.2rem;">${currentScale.info}</span>
        `;
        this.comparison.textContent = currentScale.compare;

        // Update comparison visualization
        this.updateComparison(currentScale, value);

        // Update statistics
        this.updateStats();

        // Check achievements
        this.checkAchievements();
    }

    updateComparison(currentScale, value) {
        if (!this.sizeComparison) return;

        if (value > 50) {
            const earth = this.scales.find(s => s.name === 'Earth');
            const earthSize = 30;
            const ratio = Math.pow(10, (value - 70) / 10);

            this.sizeComparison.innerHTML = `
                <div class="comparison-item">
                    <div style="color: #b3d9ff;">Earth</div>
                    <div class="object" style="width: ${earthSize}px; height: ${earthSize}px; 
                         background: radial-gradient(circle, #4169e1, #1e3a8a);"></div>
                    <div style="color: #8ecae6; font-size: 0.8rem;">${earth.info}</div>
                </div>
                <div class="comparison-item">
                    <div style="color: #ffd700;">vs</div>
                </div>
                <div class="comparison-item">
                    <div style="color: #b3d9ff;">${currentScale.name}</div>
                    <div class="object" style="width: ${Math.min(earthSize * ratio, 200)}px; 
                         height: ${Math.min(earthSize * ratio, 200)}px;
                         background: radial-gradient(circle, #ffd700, #ff8c00);"></div>
                    <div style="color: #8ecae6; font-size: 0.8rem;">${currentScale.info}</div>
                </div>
            `;
        } else {
            this.sizeComparison.innerHTML = `
                <div class="comparison-item">
                    <div style="color: #b3d9ff;">${currentScale.name}</div>
                    <div style="color: #8ecae6; font-size: 0.9rem; max-width: 300px; margin-top: 1rem;">
                        ${currentScale.fact}
                    </div>
                </div>
            `;
        }
    }

    updateStats() {
        const exploredEl = document.getElementById('scalesExplored');
        const jumpsEl = document.getElementById('totalJumps');
        const levelEl = document.getElementById('currentLevel');

        if (exploredEl) exploredEl.textContent = this.stats.explored.size;
        if (jumpsEl) jumpsEl.textContent = this.stats.jumps;

        // Calculate level
        let level = 'Beginner';
        if (this.stats.explored.size >= 10) level = 'Master';
        else if (this.stats.explored.size >= 6) level = 'Expert';
        else if (this.stats.explored.size >= 3) level = 'Explorer';

        this.stats.level = level;
        if (levelEl) levelEl.textContent = level;
    }

    jumpToScale(value) {
        this.slider.value = value;
        this.stats.jumps++;
        this.updateScale();

        // Find scale name
        const scale = this.scales.find(s => s.value <= value && 
            (!this.scales.find(s2 => s2.value <= value && s2.value > s.value)));
        
        if (scale && window.CosmicLab) {
            window.CosmicLab.showNotification(`Jumped to ${scale.name}!`, 'info');
        }
    }

    checkAchievements() {
        const achievements = [
            {
                id: 'explore3',
                condition: this.stats.explored.size >= 3,
                text: 'Explored 3 different scales!',
                triggered: false
            },
            {
                id: 'explore6',
                condition: this.stats.explored.size >= 6,
                text: 'Cosmic Explorer! 6 scales visited',
                triggered: false
            },
            {
                id: 'exploreAll',
                condition: this.stats.explored.size >= 12,
                text: 'Master of Scales! All scales explored!',
                triggered: false
            },
            {
                id: 'jump10',
                condition: this.stats.jumps >= 10,
                text: 'Scale Hopper! 10 jumps completed',
                triggered: false
            }
        ];

        achievements.forEach(achievement => {
            if (achievement.condition && !achievement.triggered) {
                achievement.triggered = true;
                if (window.CosmicLab) {
                    window.CosmicLab.unlockAchievement(achievement.id);
                    window.CosmicLab.showNotification(achievement.text, 'success');
                }
            }
        });
    }

    getStats() {
        return {
            ...this.stats,
            explored: Array.from(this.stats.explored)
        };
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUniverse);
} else {
    initUniverse();
}

function initUniverse() {
    const slider = document.getElementById('scale');
    if (!slider) return;

    const explorer = new UniverseScaleExplorer();

    // Expose to global scope
    window.universeExplorer = explorer;

    // Global jump function
    window.jumpToScale = (value) => explorer.jumpToScale(value);
}