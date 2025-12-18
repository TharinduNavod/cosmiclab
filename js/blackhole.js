/**
 * COSMICLAB - BLACK HOLE SIMULATION
 * Three.js based black hole visualization with gravitational physics
 */

class BlackHoleSimulation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas not found');
            return;
        }

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        
        // Simulation parameters
        this.blackHoles = [];
        this.particles = [];
        this.settings = {
            gravity: 5000,
            particleRate: 3,
            maxParticles: 500,
            effects: {
                lensing: true,
                disk: true,
                trails: true
            }
        };
        
        this.stats = {
            particlesCreated: 0,
            particlesAbsorbed: 0,
            fps: 60
        };
        
        this.init();
    }

    init() {
        // Setup canvas
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext('2d');

        // Create initial black hole
        this.addBlackHole(this.width / 2, this.height / 2, 30, 5000);

        // Start animation
        this.lastTime = performance.now();
        this.animate();

        // Auto-add particles
        this.particleInterval = setInterval(() => {
            if (this.particles.length < this.settings.maxParticles) {
                this.addParticle();
            }
        }, 1000 / this.settings.particleRate);

        // Handle resize
        window.addEventListener('resize', () => this.handleResize());
    }

    addBlackHole(x, y, radius, mass) {
        this.blackHoles.push({
            x, y, radius, mass,
            rotation: 0
        });
    }

    addParticle(blackHole = null) {
        const bh = blackHole || this.blackHoles[0];
        if (!bh) return;

        const angle = Math.random() * Math.PI * 2;
        const distance = 200 + Math.random() * 300;
        
        const particle = {
            x: bh.x + Math.cos(angle) * distance,
            y: bh.y + Math.sin(angle) * distance,
            vx: Math.sin(angle) * 2,
            vy: -Math.cos(angle) * 2,
            radius: 2 + Math.random() * 2,
            hue: Math.random() * 60 + 180,
            life: 1,
            trail: [],
            active: true
        };

        this.particles.push(particle);
        this.stats.particlesCreated++;
    }

    addParticleBurst(count = 50) {
        for (let i = 0; i < count; i++) {
            const bh = this.blackHoles[Math.floor(Math.random() * this.blackHoles.length)];
            this.addParticle(bh);
        }
    }

    updateParticle(particle, deltaTime) {
        this.blackHoles.forEach(bh => {
            const dx = bh.x - particle.x;
            const dy = bh.y - particle.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Check if particle is absorbed
            if (dist < bh.radius) {
                particle.active = false;
                this.stats.particlesAbsorbed++;
                return;
            }

            // Calculate gravitational force
            const force = (bh.mass * deltaTime) / (dist * dist);
            const ax = (dx / dist) * force;
            const ay = (dy / dist) * force;

            particle.vx += ax * 0.01;
            particle.vy += ay * 0.01;
        });

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Update trail
        if (this.settings.effects.trails) {
            particle.trail.push({ x: particle.x, y: particle.y });
            if (particle.trail.length > 20) {
                particle.trail.shift();
            }
        }

        // Fade near black hole
        const nearestDist = Math.min(...this.blackHoles.map(bh => {
            const dx = bh.x - particle.x;
            const dy = bh.y - particle.y;
            return Math.sqrt(dx * dx + dy * dy);
        }));

        if (nearestDist < 100) {
            particle.life -= 0.02;
        }
    }

    drawBlackHole(bh) {
        const ctx = this.ctx;

        // Gravitational lensing effect
        if (this.settings.effects.lensing) {
            const gradient = ctx.createRadialGradient(
                bh.x, bh.y, 0,
                bh.x, bh.y, bh.radius * 3
            );
            gradient.addColorStop(0, '#000000');
            gradient.addColorStop(0.3, '#1a0033');
            gradient.addColorStop(0.6, '#330066');
            gradient.addColorStop(1, 'transparent');

            ctx.beginPath();
            ctx.arc(bh.x, bh.y, bh.radius * 3, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }

        // Accretion disk
        if (this.settings.effects.disk) {
            for (let i = 0; i < 3; i++) {
                ctx.save();
                ctx.translate(bh.x, bh.y);
                ctx.rotate(bh.rotation + i * Math.PI / 3);
                
                ctx.beginPath();
                ctx.ellipse(0, 0, bh.radius * 2.5, bh.radius * 1.5, 0, 0, Math.PI * 2);
                ctx.strokeStyle = `hsla(${280 + i * 20}, 70%, 50%, 0.2)`;
                ctx.lineWidth = 3;
                ctx.stroke();
                
                ctx.restore();
            }
            bh.rotation += 0.01;
        }

        // Event horizon
        ctx.beginPath();
        ctx.arc(bh.x, bh.y, bh.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();
        ctx.strokeStyle = 'rgba(138, 43, 226, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Schwarzschild radius indicator
        ctx.beginPath();
        ctx.arc(bh.x, bh.y, bh.radius * 1.5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(138, 43, 226, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    drawParticle(particle) {
        const ctx = this.ctx;

        // Draw trail
        if (this.settings.effects.trails && particle.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
            for (let i = 1; i < particle.trail.length; i++) {
                ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
            }
            ctx.strokeStyle = `hsla(${particle.hue}, 100%, 50%, 0.2)`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Calculate brightness based on distance
        const nearestDist = Math.min(...this.blackHoles.map(bh => {
            const dx = bh.x - particle.x;
            const dy = bh.y - particle.y;
            return Math.sqrt(dx * dx + dy * dy);
        }));
        const brightness = Math.min(1, 200 / nearestDist);

        // Draw particle
        ctx.save();
        ctx.shadowBlur = 20;
        ctx.shadowColor = `hsl(${particle.hue}, 100%, 50%)`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, 100%, ${50 + brightness * 50}%, ${particle.life})`;
        ctx.fill();
        ctx.restore();
    }

    animate() {
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        // Calculate FPS
        this.stats.fps = Math.round(1 / deltaTime);

        // Clear canvas
        if (this.settings.effects.trails) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        } else {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        }
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw black holes
        this.blackHoles.forEach(bh => this.drawBlackHole(bh));

        // Update and draw particles
        this.particles = this.particles.filter(p => p.life > 0 && p.active);
        this.particles.forEach(particle => {
            this.updateParticle(particle, deltaTime);
            this.drawParticle(particle);
        });

        // Update stats display
        this.updateStatsDisplay();

        // Continue animation
        requestAnimationFrame(() => this.animate());
    }

    updateStatsDisplay() {
        const particleCount = document.getElementById('particleCount');
        const absorbedCount = document.getElementById('absorbedCount');
        const fpsDisplay = document.getElementById('fps');

        if (particleCount) particleCount.textContent = this.particles.length;
        if (absorbedCount) absorbedCount.textContent = this.stats.particlesAbsorbed;
        if (fpsDisplay) fpsDisplay.textContent = this.stats.fps;
    }

    // Public methods for controls
    updateGravity(value) {
        this.settings.gravity = parseFloat(value);
        this.blackHoles[0].mass = this.settings.gravity;
    }

    updateParticleRate(value) {
        this.settings.particleRate = parseFloat(value);
        clearInterval(this.particleInterval);
        this.particleInterval = setInterval(() => {
            if (this.particles.length < this.settings.maxParticles) {
                this.addParticle();
            }
        }, 1000 / this.settings.particleRate);
    }

    updateSize(value) {
        this.blackHoles[0].radius = parseFloat(value);
    }

    toggleEffect(effect) {
        this.settings.effects[effect] = !this.settings.effects[effect];
    }

    reset() {
        this.particles = [];
        this.stats.particlesAbsorbed = 0;
        this.stats.particlesCreated = 0;
        this.blackHoles = [];
        this.addBlackHole(this.width / 2, this.height / 2, 30, 5000);
    }

    addSecondBlackHole() {
        if (this.blackHoles.length < 2) {
            this.addBlackHole(
                this.width * 0.7,
                this.height * 0.5,
                25,
                4000
            );
        }
    }

    handleResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        // Reposition black holes
        if (this.blackHoles.length > 0) {
            this.blackHoles[0].x = this.width / 2;
            this.blackHoles[0].y = this.height / 2;
        }
    }

    destroy() {
        clearInterval(this.particleInterval);
        this.particles = [];
        this.blackHoles = [];
    }
}

// Initialize simulation when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlackHole);
} else {
    initBlackHole();
}

function initBlackHole() {
    const canvas = document.getElementById('bhCanvas');
    if (!canvas) return;

    const simulation = new BlackHoleSimulation('bhCanvas');

    // Expose to global scope for controls
    window.blackHoleSimulation = simulation;

    // Global control functions
    window.addParticles = () => simulation.addParticleBurst();
    window.increaseGravity = () => {
        simulation.updateGravity(simulation.settings.gravity + 1000);
        document.getElementById('gravityValue').textContent = simulation.settings.gravity;
    };
    window.reset = () => simulation.reset();
    window.updateGravity = (val) => {
        simulation.updateGravity(val);
    };
    window.updateRate = (val) => {
        simulation.updateParticleRate(val);
    };
    window.updateSize = (val) => {
        simulation.updateSize(val);
    };
    window.toggleEffect = (el, effect) => {
        simulation.toggleEffect(effect);
    };
    window.createSecondBlackHole = () => {
        simulation.addSecondBlackHole();
    };
}