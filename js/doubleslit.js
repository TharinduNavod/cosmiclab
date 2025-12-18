/**
 * COSMICLAB - QUANTUM DOUBLE-SLIT EXPERIMENT
 * Wave-particle duality visualization
 */

class DoubleSlit Experiment {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas not found');
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // Apparatus configuration
        this.slits = {
            x: 250,
            y1: 180,
            y2: 320,
            width: 20,
            gap: 60
        };

        this.screen = { x: 750 };

        // Simulation state
        this.particles = [];
        this.detections = [];
        this.observing = false;
        this.continuousMode = false;
        this.continuousInterval = null;

        // Settings
        this.settings = {
            particleSpeed: 4,
            waveAmplitude: 40,
            fireRate: 200,
            slitWidth: 20
        };

        // Statistics
        this.stats = {
            fired: 0,
            detected: 0
        };

        this.init();
    }

    init() {
        this.animate();

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ') this.fireParticle();
            if (e.key === 'c' || e.key === 'C') this.clearScreen();
            if (e.key === 'o' || e.key === 'O') this.toggleObservation();
        });
    }

    fireParticle() {
        const particle = new Particle(
            this.slits,
            this.screen,
            this.observing,
            this.settings
        );
        this.particles.push(particle);
        this.stats.fired++;
    }

    startContinuous() {
        if (this.continuousInterval) return;
        
        this.continuousMode = true;
        this.continuousInterval = setInterval(() => {
            this.fireParticle();
        }, this.settings.fireRate);
    }

    stopContinuous() {
        if (this.continuousInterval) {
            clearInterval(this.continuousInterval);
            this.continuousInterval = null;
            this.continuousMode = false;
        }
    }

    toggleObservation() {
        this.observing = !this.observing;
        this.clearScreen();
        this.stats.fired = 0;
        this.updateStatsDisplay();
    }

    clearScreen() {
        this.detections = [];
        this.particles = [];
        this.stats.detected = 0;
        this.updateStatsDisplay();
    }

    updateSettings(setting, value) {
        this.settings[setting] = parseFloat(value);
        
        if (setting === 'slitWidth') {
            this.slits.width = parseFloat(value);
        }
        
        if (setting === 'fireRate' && this.continuousInterval) {
            this.stopContinuous();
            this.startContinuous();
        }
    }

    drawApparatus() {
        const ctx = this.ctx;

        // Background fade
        ctx.fillStyle = 'rgba(10, 10, 26, 0.3)';
        ctx.fillRect(0, 0, this.width, this.height);

        // Slit barrier
        ctx.fillStyle = '#1a1a3a';
        ctx.fillRect(this.slits.x - 5, 0, 10, this.slits.y1);
        ctx.fillRect(
            this.slits.x - 5,
            this.slits.y1 + this.slits.width,
            10,
            this.slits.y2 - this.slits.y1 - this.slits.width
        );
        ctx.fillRect(
            this.slits.x - 5,
            this.slits.y2 + this.slits.width,
            10,
            this.height - this.slits.y2 - this.slits.width
        );

        // Slits
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.slits.x - 5, this.slits.y1, 10, this.slits.width);
        ctx.strokeRect(this.slits.x - 5, this.slits.y2, 10, this.slits.width);

        // Detector screen
        ctx.strokeStyle = '#0099ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.screen.x, 0);
        ctx.lineTo(this.screen.x, this.height);
        ctx.stroke();

        // Labels
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = '#00ffff';
        ctx.fillText('Source', 20, 30);
        ctx.fillText('Double Slit', this.slits.x - 40, 30);
        ctx.fillText('Detector', this.screen.x - 35, 30);

        if (this.observing) {
            ctx.fillStyle = '#ff00ff';
            ctx.fillText('👁️ OBSERVING', this.slits.x - 50, 60);
        }
    }

    drawDetections() {
        this.detections.forEach(detection => {
            this.ctx.beginPath();
            this.ctx.arc(detection.x, detection.y, 2, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 255, 255, ${detection.intensity * 0.8})`;
            this.ctx.fill();
        });
    }

    animate() {
        this.drawApparatus();
        this.drawDetections();

        // Update and draw particles
        this.particles = this.particles.filter(p => p.active);
        this.particles.forEach(particle => {
            particle.update();
            particle.draw(this.ctx);

            // Check if particle reached screen
            if (particle.x >= this.screen.x && particle.active) {
                particle.active = false;
                this.stats.detected++;

                const detection = {
                    x: this.screen.x,
                    y: particle.getDetectionY(),
                    intensity: particle.getIntensity()
                };
                this.detections.push(detection);
            }
        });

        this.updateStatsDisplay();
        requestAnimationFrame(() => this.animate());
    }

    updateStatsDisplay() {
        const firedEl = document.getElementById('particlesFired');
        const detectedEl = document.getElementById('detectionCount');
        const modeEl = document.getElementById('currentMode');

        if (firedEl) firedEl.textContent = this.stats.fired;
        if (detectedEl) detectedEl.textContent = this.stats.detected;
        if (modeEl) modeEl.textContent = this.observing ? 'Particle' : 'Wave';
    }
}

class Particle {
    constructor(slits, screen, observing, settings) {
        this.x = 50;
        this.y = 250;
        this.vx = settings.particleSpeed;
        this.observing = observing;
        this.settings = settings;
        this.slits = slits;
        this.screen = screen;

        // Determine path
        if (observing) {
            this.path = Math.random() < 0.5 ? 'top' : 'bottom';
            this.targetY = this.path === 'top' ? slits.y1 + 10 : slits.y2 + 10;
        } else {
            this.path = 'wave';
            this.phase = Math.random() * Math.PI * 2;
            this.amplitude = settings.waveAmplitude;
        }

        this.color = observing ? '#ff00ff' : '#00ffff';
        this.active = true;
        this.trail = [];
    }

    update() {
        this.x += this.vx;

        if (this.observing) {
            // Particle behavior - straight line to slit
            this.y = this.targetY;
        } else {
            // Wave behavior - sinusoidal motion
            this.y = 250 + Math.sin(this.x * 0.05 + this.phase) * this.amplitude;
        }

        // Store trail
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 10) this.trail.shift();
    }

    draw(ctx) {
        if (!this.active) return;

        // Draw trail
        if (this.trail.length > 1 && !this.observing) {
            ctx.save();
            ctx.globalAlpha = 0.3;
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.trail[0].x, this.trail[0].y);
            for (let i = 1; i < this.trail.length; i++) {
                ctx.lineTo(this.trail[i].x, this.trail[i].y);
            }
            ctx.stroke();
            ctx.restore();
        }

        // Draw particle
        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    getDetectionY() {
        if (this.observing) {
            return this.y;
        } else {
            // Calculate interference pattern
            const interference = Math.sin(this.phase) * Math.cos(this.y * 0.02);
            return this.y + interference * 30;
        }
    }

    getIntensity() {
        if (this.observing) {
            return 1;
        } else {
            const interference = Math.sin(this.phase) * Math.cos(this.y * 0.02);
            return Math.abs(interference);
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuantum);
} else {
    initQuantum();
}

function initQuantum() {
    const canvas = document.getElementById('slitCanvas');
    if (!canvas) return;

    const experiment = new DoubleSlitExperiment('slitCanvas');

    // Expose to global scope for controls
    window.quantumExperiment = experiment;

    // Global control functions
    window.fireParticle = () => experiment.fireParticle();
    window.startContinuous = () => experiment.startContinuous();
    window.stopContinuous = () => experiment.stopContinuous();
    window.clearScreen = () => experiment.clearScreen();
    window.toggleObservation = (el) => {
        experiment.toggleObservation();
        if (el) el.classList.toggle('active');
    };
    window.updateSpeed = (val) => {
        experiment.updateSettings('particleSpeed', val);
    };
    window.updateAmplitude = (val) => {
        experiment.updateSettings('waveAmplitude', val);
    };
    window.updateSlitWidth = (val) => {
        experiment.updateSettings('slitWidth', val);
    };
    window.updateRate = (val) => {
        experiment.updateSettings('fireRate', val);
    };
}