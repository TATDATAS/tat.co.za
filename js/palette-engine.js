/**
 * Moteur visuel TATBooker
 * Gère les effets de particules et l'ambiance visuelle
 */

console.log('[PaletteEngine] Script chargé');

window.PaletteEngine = {
    // Palettes cibles issues du fichier de référence
    palettes: {
        sun: [
            { r: 74, g: 144, b: 217 }, { r: 232, g: 181, b: 90 }, { r: 194, g: 161, b: 77 }, { r: 107, g: 140, b: 66 }, { r: 74, g: 107, b: 46 }
        ],
        rain: [
            { r: 44, g: 62, b: 80 }, { r: 158, g: 158, b: 158 }, { r: 176, g: 168, b: 138 }, { r: 107, g: 140, b: 66 }, { r: 74, g: 107, b: 46 }
        ],
        night: [ // Mappé sur "cool" de la référence
            { r: 10, g: 10, b: 26 }, { r: 26, g: 26, b: 58 }, { r: 74, g: 42, b: 90 }, { r: 200, g: 184, b: 122 }, { r: 42, g: 74, b: 58 }
        ],
        storm: [
            { r: 26, g: 26, b: 26 }, { r: 58, g: 58, b: 58 }, { r: 90, g: 90, b: 74 }, { r: 138, g: 138, b: 90 }, { r: 58, g: 90, b: 58 }
        ],
        harmattan: [ // Mappé sur "dust" de la référence
            { r: 212, g: 138, b: 58 }, { r: 194, g: 90, b: 42 }, { r: 184, g: 134, b: 60 }, { r: 168, g: 111, b: 40 }, { r: 139, g: 74, b: 32 }
        ]
    },

    // État courant
    currentColors: [
        { r: 74, g: 144, b: 217 }, { r: 232, g: 181, b: 90 }, { r: 194, g: 161, b: 77 }, { r: 107, g: 140, b: 66 }, { r: 74, g: 107, b: 46 }
    ],

    targetTheme: 'sun',
    attractionStrength: 0.08,
    oscillationStrength: 0.018,
    timeOffset: 0,

    rgbToHex(r, g, b) {
        const toHex = (n) => {
            const hex = Math.round(Math.min(255, Math.max(0, n))).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    },

    apply() {
        const hex = this.currentColors.map(c => this.rgbToHex(c.r, c.g, c.b));
        const gradientStr = `linear-gradient(145deg, 
            ${hex[0]} 0%, 
            ${hex[1]} 20%, 
            ${hex[2]} 45%, 
            ${hex[3]} 70%, 
            ${hex[4]} 100%)`;
        //console.log('Applying gradient:', gradientStr);
        document.body.style.setProperty('--bg-gradient', gradientStr);
    },

    update() {
        const target = this.palettes[this.targetTheme] || this.palettes.sun;
        this.timeOffset += 0.016;
        
        for (let i = 0; i < 5; i++) {
            // Attraction vers la cible
            this.currentColors[i].r += (target[i].r - this.currentColors[i].r) * this.attractionStrength;
            this.currentColors[i].g += (target[i].g - this.currentColors[i].g) * this.attractionStrength;
            this.currentColors[i].b += (target[i].b - this.currentColors[i].b) * this.attractionStrength;
            
            // Oscillation perpétuelle
            const speed = 0.8;
            this.currentColors[i].r += Math.sin(this.timeOffset * speed + i * 1.2) * this.oscillationStrength * 5;
            this.currentColors[i].g += Math.cos(this.timeOffset * speed * 0.7 + i * 2.3) * this.oscillationStrength * 4;
            this.currentColors[i].b += Math.sin(this.timeOffset * speed * 1.3 + i * 3.1) * this.oscillationStrength * 3;
            
            // Bornes
            this.currentColors[i].r = Math.min(255, Math.max(0, this.currentColors[i].r));
            this.currentColors[i].g = Math.min(255, Math.max(0, this.currentColors[i].g));
            this.currentColors[i].b = Math.min(255, Math.max(0, this.currentColors[i].b));
        }
        this.apply();
    },

    startLoop() {
        console.log('[PaletteEngine] Démarrage de la boucle d\'animation...');
        const loop = () => {
            this.update();
            requestAnimationFrame(loop);
        };
        loop();
    },

    setTarget(themeName) {
        if (this.palettes[themeName]) {
            console.log(`[PaletteEngine] Nouvelle cible climatique: ${themeName}`);
            this.targetTheme = themeName;
        }
    }
};

function createParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    for (let i = 0; i < 45; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 8 + 4;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particle.style.animationDuration = `${8 + Math.random() * 12}s`;
        particle.style.backgroundColor = 'var(--accent-color)';
        particle.style.opacity = Math.random() * 0.5 + 0.2;
        container.appendChild(particle);
    }
}