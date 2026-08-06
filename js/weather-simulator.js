/**
 * Simulateur Météo - tat.co.za
 * Cycle automatique des palettes climatiques pour démonstration visuelle.
 */

console.log('[WeatherSimulator] Script chargé');

window.WeatherSimulator = {
    themes: ['sun', 'rain', 'night', 'storm', 'harmattan'],
    currentIndex: 0,
    intervalId: null, 
    intervalTime: 10000, // 10 secondes pour une démo plus dynamique

    /**
     * Initialise et lance la simulation
     */
    init() {
        console.log('[WeatherSimulator] Initialisation du moteur climatique...');
        this.start();
    },

    /**
     * Applique un thème spécifique
     * @param {string} themeName 
     */
    setTheme(themeName) {
        if (!this.themes.includes(themeName)) return;
        
        console.log(`[WeatherSimulator] Changement climatique : ${themeName.toUpperCase()}`);
        document.body.setAttribute('data-theme', themeName);
        
        // Piloter le moteur de palette si disponible
        if (typeof PaletteEngine !== 'undefined') PaletteEngine.setTarget(themeName);
    },

    /**
     * Passe au thème suivant dans le cycle
     */
    next() {
        this.currentIndex = (this.currentIndex + 1) % this.themes.length;
        this.setTheme(this.themes[this.currentIndex]);
    },

    /**
     * Démarre le cycle automatique
     */
    start() {
        if (this.intervalId) return;
        // Applique le thème initial immédiatement
        this.setTheme(this.themes[this.currentIndex]);
        this.intervalId = setInterval(() => this.next(), this.intervalTime);
    }
};
