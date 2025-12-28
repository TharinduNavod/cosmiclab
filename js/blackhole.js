<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Black Holes | CosmicLab</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --bg-primary: #0A0E27;
            --bg-secondary: #151933;
            --accent-blue: #3B82F6;
            --accent-purple: #8B5CF6;
            --accent-orange: #F59E0B;
            --text-primary: #F8FAFC;
            --text-secondary: #94A3B8;
            --border: rgba(148, 163, 184, 0.1);
        }

        body {
            font-family: 'Inter', sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            overflow-x: hidden;
            line-height: 1.6;
        }

        /* Stars Background */
        .stars-bg {
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: 0;
        }

        .star {
            position: absolute;
            width: 2px;
            height: 2px;
            background: white;
            border-radius: 50%;
            animation: twinkle 3s infinite;
        }

        @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
        }

        /* Navigation */
        nav {
            position: fixed;
            top: 0;
            width: 100%;
            padding: 1.5rem 5%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(10, 14, 39, 0.8);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid var(--border);
            z-index: 1000;
            transition: all 0.3s;
        }

        nav.scrolled {
            padding: 1rem 5%;
            background: rgba(10, 14, 39, 0.95);
        }

        .logo {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 1.5rem;
            font-weight: 700;
            background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            text-decoration: none;
        }

        .nav-links {
            display: flex;
            gap: 2.5rem;
            list-style: none;
        }

        .nav-links a {
            color: var(--text-secondary);
            text-decoration: none;
            font-weight: 500;
            font-size: 0.95rem;
            transition: color 0.3s;
        }

        .nav-links a:hover {
            color: var(--text-primary);
        }

        /* Hero Section */
        header {
            min-height: 70vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 10rem 5% 4rem;
            position: relative;
            z-index: 1;
        }

        h1 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: clamp(3rem, 8vw, 5rem);
            font-weight: 800;
            line-height: 1.1;
            margin-bottom: 1.5rem;
            background: linear-gradient(135deg, var(--text-primary), var(--accent-purple));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .subtitle {
            font-size: 1.2rem;
            color: var(--accent-blue);
            letter-spacing: 3px;
            text-transform: uppercase;
            margin-bottom: 1rem;
            font-weight: 600;
        }

        .intro {
            max-width: 800px;
            margin: 0 auto 2rem;
            font-size: 1.15rem;
            color: var(--text-secondary);
            line-height: 1.8;
        }

        /* Container */
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 4rem 5%;
            position: relative;
            z-index: 1;
        }

        .section-title {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 2.5rem;
            margin-bottom: 3rem;
            font-weight: 700;
        }

        .gradient-text {
            background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        /* Cards Grid */
        .card-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 2rem;
            margin-bottom: 6rem;
        }

        .info-card {
            background: rgba(21, 25, 51, 0.6);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border);
            padding: 2.5rem;
            border-radius: 20px;
            transition: all 0.4s;
        }

        .info-card:hover {
            transform: translateY(-10px);
            border-color: var(--accent-blue);
            box-shadow: 0 15px 50px rgba(59, 130, 246, 0.3);
        }

        .card-icon {
            font-size: 2.5rem;
            margin-bottom: 1.5rem;
            display: block;
        }

        .info-card h3 {
            font-family: 'Space Grotesk', sans-serif;
            margin-bottom: 1rem;
            font-size: 1.5rem;
            font-weight: 600;
        }

        .info-card p {
            color: var(--text-secondary);
            line-height: 1.8;
        }

        /* Anatomy Section */
        .anatomy-section {
            background: rgba(21, 25, 51, 0.6);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border);
            border-radius: 24px;
            padding: 4rem;
            margin-bottom: 6rem;
        }

        .anatomy-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: center;
        }

        .diagram-container {
            position: relative;
            height: 450px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .bh-visual {
            width: 200px;
            height: 200px;
            background: #000;
            border-radius: 50%;
            box-shadow: 0 0 60px rgba(59, 130, 246, 0.8), inset 0 0 30px rgba(255, 255, 255, 0.2);
            position: relative;
            z-index: 2;
        }

        .bh-disk {
            position: absolute;
            width: 420px;
            height: 140px;
            background: radial-gradient(ellipse, rgba(245, 158, 11, 0.9), rgba(245, 158, 11, 0.3) 50%, transparent 70%);
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-10deg);
            z-index: 1;
            filter: blur(4px);
            animation: spin 12s linear infinite;
        }

        .bh-jet {
            position: absolute;
            width: 12px;
            height: 550px;
            background: linear-gradient(to top, transparent, var(--accent-blue), rgba(255, 255, 255, 0.9));
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) rotate(-10deg);
            z-index: 0;
            filter: blur(6px);
            opacity: 0.7;
        }

        @keyframes spin {
            from { transform: translate(-50%, -50%) rotate(-10deg); }
            to { transform: translate(-50%, -50%) rotate(350deg); }
        }

        .anatomy-list {
            list-style: none;
        }

        .anatomy-list li {
            margin-bottom: 2rem;
            padding-left: 1.5rem;
            border-left: 3px solid var(--accent-blue);
        }
        
        .anatomy-list strong {
            color: var(--accent-blue);
            display: block;
            margin-bottom: 0.5rem;
            font-size: 1.2rem;
        }

        .anatomy-list p {
            color: var(--text-secondary);
            line-height: 1.7;
        }

        /* Classification Cards */
        .classification-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-bottom: 6rem;
        }

        .class-card {
            background: rgba(21, 25, 51, 0.6);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 2.5rem;
            border-top: 4px solid var(--accent-blue);
            transition: all 0.4s;
        }

        .class-card:nth-child(2) {
            border-top-color: var(--accent-orange);
        }

        .class-card:nth-child(3) {
            border-top-color: var(--accent-purple);
        }

        .class-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 50px rgba(59, 130, 246, 0.3);
        }

        .class-card h3 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 1.6rem;
            margin-bottom: 1rem;
            font-weight: 600;
        }

        .class-card p {
            color: var(--text-secondary);
            line-height: 1.8;
        }

        /* Simulator Section */
        .sim-container {
            background: rgba(21, 25, 51, 0.6);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border);
            border-radius: 24px;
            padding: 3rem;
            margin-bottom: 6rem;
        }

        .sim-screen {
            background: #000;
            height: 400px;
            border-radius: 16px;
            position: relative;
            overflow: hidden;
            margin-bottom: 2rem;
            border: 1px solid var(--border);
        }

        .sim-controls {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            padding: 2rem;
            background: rgba(10, 14, 39, 0.6);
            border-radius: 16px;
        }

        .slider-group label {
            display: block;
            color: var(--accent-orange);
            font-weight: 600;
            margin-bottom: 0.75rem;
            font-size: 0.95rem;
        }

        input[type=range] {
            width: 100%;
            height: 8px;
            background: rgba(59, 130, 246, 0.2);
            border-radius: 5px;
            outline: none;
            -webkit-appearance: none;
        }

        input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(59, 130, 246, 0.5);
        }

        .result-display {
            background: rgba(59, 130, 246, 0.1);
            border: 1px solid rgba(59, 130, 246, 0.3);
            padding: 1.5rem;
            border-radius: 12px;
            text-align: center;
        }

        .result-label {
            color: var(--text-secondary);
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
        }

        .result-value {
            font-size: 2rem;
            color: var(--accent-orange);
            font-family: 'Space Grotesk', sans-serif;
            font-weight: 700;
        }

        .equation-display {
            text-align: center;
            color: var(--text-secondary);
            font-size: 0.95rem;
            margin-top: 1.5rem;
        }

        /* Footer */
        footer {
            background: rgba(21, 25, 51, 0.8);
            padding: 3rem 5%;
            border-top: 1px solid var(--border);
            text-align: center;
            color: var(--text-secondary);
            position: relative;
            z-index: 1;
        }

        /* Mobile Menu */
        .hamburger {
            display: none;
            flex-direction: column;
            gap: 4px;
            cursor: pointer;
        }

        .hamburger span {
            width: 25px;
            height: 3px;
            background: var(--text-primary);
            border-radius: 2px;
            transition: all 0.3s;
        }

        /* Responsive */
        @media (max-width: 1024px) {
            .anatomy-grid {
                grid-template-columns: 1fr;
            }
            
            .sim-controls {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 768px) {
            .nav-links {
                position: fixed;
                top: 80px;
                left: -100%;
                width: 100%;
                height: calc(100vh - 80px);
                background: rgba(10, 14, 39, 0.98);
                backdrop-filter: blur(20px);
                flex-direction: column;
                justify-content: center;
                align-items: center;
                transition: left 0.3s;
            }
            
            .nav-links.active {
                left: 0;
            }
            
            .hamburger {
                display: flex;
            }
            
            .anatomy-section {
                padding: 2rem;
            }
            
            h1 {
                font-size: 2.5rem;
            }
        }
    </style>
</head>
<body>

    <div class="stars-bg" id="stars"></div>

    <nav id="navbar">
        <a href="index.html" class="logo">
            <i class="fas fa-atom"></i>
            CosmicLab
        </a>
        
        <ul class="nav-links" id="navLinks">
            <li><a href="index.html">Home</a></li>
            <li><a href="#overview">Overview</a></li>
            <li><a href="#anatomy">Anatomy</a></li>
            <li><a href="#types">Types</a></li>
            <li><a href="#simulation">Lab</a></li>
        </ul>
        
        <div class="hamburger" id="hamburger">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </nav>

    <header>
        <div class="subtitle">Exploring the Abyss</div>
        <h1>BLACK HOLES</h1>
        <p class="intro">
            Regions of spacetime where gravity is so intense that nothing—no particles or even electromagnetic radiation such as light—can escape from it.
        </p>
    </header>

    <div class="container">
        
        <section id="overview">
            <h2 class="section-title">Fundamental <span class="gradient-text">Concepts</span></h2>
            <div class="card-grid">
                <div class="info-card">
                    <div class="card-icon">🌌</div>
                    <h3>Formation</h3>
                    <p>Most black holes form from the remnants of a large star that dies in a supernova explosion. If the total mass of the star is large enough, no force can keep it from collapsing under gravity's influence.</p>
                </div>
                <div class="info-card">
                    <div class="card-icon">⏱️</div>
                    <h3>Time Dilation</h3>
                    <p>According to general relativity, time passes more slowly closer to the massive body. To a distant observer, a clock falling into a black hole would appear to tick slower and eventually freeze.</p>
                </div>
                <div class="info-card">
                    <div class="card-icon">☢️</div>
                    <h3>Hawking Radiation</h3>
                    <p>Stephen Hawking theorized that black holes emit small amounts of thermal radiation due to quantum effects near the event horizon, eventually causing them to evaporate.</p>
                </div>
            </div>
        </section>

        <section id="anatomy" class="anatomy-section">
            <h2 class="section-title">Anatomy of a <span class="gradient-text">Monster</span></h2>
            
            <div class="anatomy-grid">
                <div class="diagram-container">
                    <div class="bh-jet"></div>
                    <div class="bh-disk"></div>
                    <div class="bh-visual"></div>
                </div>
                <ul class="anatomy-list">
                    <li>
                        <strong>Singularity</strong>
                        <p>The very center of the black hole where matter has collapsed into a region of infinite density.</p>
                    </li>
                    <li>
                        <strong>Event Horizon</strong>
                        <p>The radius around the singularity where the escape velocity equals the speed of light. The "point of no return."</p>
                    </li>
                    <li>
                        <strong>Accretion Disk</strong>
                        <p>A disk of superheated gas and dust spiraling into the black hole at immense speeds, glowing with X-rays.</p>
                    </li>
                    <li>
                        <strong>Relativistic Jets</strong>
                        <p>Beams of ionized matter accelerated close to the speed of light, shooting out from the poles.</p>
                    </li>
                </ul>
            </div>
        </section>

        <section id="types">
            <h2 class="section-title"><span class="gradient-text">Classification</span></h2>
            <div class="classification-grid">
                <div class="class-card">
                    <h3>Stellar</h3>
                    <p><strong>Mass:</strong> 5 – 100× Sun<br>
                    Common throughout galaxies. Formed by the collapse of massive stars.</p>
                </div>
                <div class="class-card">
                    <h3>Supermassive</h3>
                    <p><strong>Mass:</strong> Millions – Billions × Sun<br>
                    Found at the center of almost every large galaxy, including our Milky Way (Sagittarius A*).</p>
                </div>
                <div class="class-card">
                    <h3>Intermediate</h3>
                    <p><strong>Mass:</strong> 100 – 100,000× Sun<br>
                    The "missing link" between stellar and supermassive black holes. Rare and hard to detect.</p>
                </div>
            </div>
        </section>

        <section id="simulation">
            <h2 class="section-title">Physics <span class="gradient-text">Laboratory</span></h2>
            <p style="margin-bottom: 2rem; color: var(--text-secondary);">Visualize the Schwarzschild Radius based on mass.</p>
            
            <div class="sim-container">
                <div class="sim-screen" id="sim-screen">
                    <canvas id="sim-canvas"></canvas>
                </div>
                
                <div class="sim-controls">
                    <div class="slider-group">
                        <label>Black Hole Mass: <span id="mass-display" style="color:#fff;">10</span> M☉</label>
                        <input type="range" id="mass-slider" min="5" max="100" value="10">
                    </div>
                    <div class="result-display">
                        <div class="result-label">EVENT HORIZON DIAMETER</div>
                        <div id="radius-result" class="result-value">59 km</div>
                    </div>
                </div>
                
                <div class="equation-display">
                    $$ r_s = \frac{2GM}{c^2} \approx 2.95 \text{ km/M}_{\odot} $$
                </div>
            </div>
        </section>
    </div>

    <footer>
        <p>Designed for Cosmic Education © 2025 CosmicLab</p>
    </footer>

    <script>
        // Generate stars
        const starsContainer = document.getElementById('stars');
        for (let i = 0; i < 200; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 3 + 's';
            starsContainer.appendChild(star);
        }

        // Navbar scroll
        window.addEventListener('scroll', () => {
            const nav = document.getElementById('navbar');
            nav.classList.toggle('scrolled', window.scrollY > 50);
        });

        // Mobile menu
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');

        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });

        // Simulator
        const simCanvas = document.getElementById('sim-canvas');
        const simCtx = simCanvas.getContext('2d');
        const massSlider = document.getElementById('mass-slider');
        const massDisplay = document.getElementById('mass-display');
        const radResult = document.getElementById('radius-result');

        function updateSim() {
            const w = simCanvas.width = document.getElementById('sim-screen').offsetWidth;
            const h = simCanvas.height = 400;
            const cx = w/2;
            const cy = h/2;

            const mass = parseInt(massSlider.value);
            massDisplay.innerText = mass;

            const diameterKm = (2.95 * mass * 2).toFixed(0); 
            radResult.innerText = diameterKm + " km";

            const visualRadius = 20 + (Math.log(mass) * 30);

            simCtx.clearRect(0, 0, w, h);

            // Accretion Disk (Back)
            simCtx.save();
            simCtx.translate(cx, cy);
            simCtx.rotate(0.2);
            simCtx.scale(1, 0.3);
            
            const grad = simCtx.createRadialGradient(0,0, visualRadius*1.2, 0,0, visualRadius*4);
            grad.addColorStop(0, 'rgba(0,0,0,0)');
            grad.addColorStop(0.2, '#F59E0B');
            grad.addColorStop(0.6, '#8B5CF6');
            grad.addColorStop(1, 'rgba(0,0,0,0)');

            simCtx.fillStyle = grad;
            simCtx.beginPath();
            simCtx.arc(0, 0, visualRadius*4, 0, Math.PI*2);
            simCtx.fill();
            simCtx.restore();

            // Black Hole
            simCtx.fillStyle = '#000';
            simCtx.beginPath();
            simCtx.arc(cx, cy, visualRadius, 0, Math.PI*2);
            simCtx.fill();

            // Photon Ring
            simCtx.strokeStyle = 'rgba(59, 130, 246, 0.9)';
            simCtx.lineWidth = 3;
            simCtx.shadowBlur = 20;
            simCtx.shadowColor = '#3B82F6';
            simCtx.beginPath();
            simCtx.arc(cx, cy, visualRadius, 0, Math.PI*2);
            simCtx.stroke();
            simCtx.shadowBlur = 0;

            // Accretion Disk (Front)
            simCtx.save();
            simCtx.translate(cx, cy);
            simCtx.rotate(0.2);
            simCtx.scale(1, 0.3);
            
            simCtx.beginPath();
            simCtx.arc(0, 0, visualRadius*4, 0, Math.PI, false);
            simCtx.fillStyle = 'rgba(245, 158, 11, 0.4)';
            simCtx.fill();
            simCtx.restore();
        }

        massSlider.addEventListener('input', updateSim);
        window.addEventListener('resize', updateSim);
        
        setTimeout(updateSim, 100);
    </script>
</body>
</html>