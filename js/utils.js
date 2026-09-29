/**
 * Utilitaires pour le site vitrine tat.co.za
 * Fournit des fonctions de validation et de formatage.
 */

console.log('[Utils] Script chargé');

window.Utils = {
    /**
     * Patterns de formatage pour les numéros de téléphone par pays.
     * Utilisé pour le placeholder et la validation de longueur.
     */
    phoneFormats: {
        '+33': '6 12 34 56 78', // France
        '+27': '72 123 4567', // Afrique du Sud
        '+254': '712 345678', // Kenya
        '+255': '712 345678', // Tanzanie
        '+263': '71 123 4567', // Zimbabwe
        '+1': '(212) 555-1234', // USA/Canada
        '+44': '07123 456789', // UK
        '+228': '90 12 34 56', // Togo
        '+241': '07 12 34 56', // Gabon
        '+243': '81 234 5678', // RDC
        '+242': '06 123 4567', // Congo
        '+257': '71 23 45 67', // Burundi
        '+250': '788 123 456', // Rwanda
        '+229': '90 12 34 56', // Bénin
        '+226': '70 12 34 56', // Burkina Faso
        '+223': '70 12 34 56', // Mali
        '+221': '77 123 45 67', // Sénégal
        '+225': '07 12 34 56 78', // Côte d'Ivoire
        '+212': '6 12 34 56 78', // Maroc
        '+222': '45 25 12 34', // Mauritanie
        '+213': '5 12 34 56 78', // Algérie
        '+216': '98 123 456', // Tunisie
        '+971': '50 123 4567', // EAU
        '+974': '55 123 456', // Qatar
        '+20': '100 123 4567', // Égypte
        '+32': '470 12 34 56', // Belgique
        '+31': '6 12345678', // Pays-Bas
        '+49': '151 12345678', // Allemagne
        '+34': '612 34 56 78', // Espagne
        '+39': '312 345 6789', // Italie
        '+352': '621 123 456', // Luxembourg
        '+41': '79 123 45 67', // Suisse
        '+45': '20 12 34 56', // Danemark
        '+46': '70 123 45 67', // Suède
        '+47': '912 34 567', // Norvège
        '+48': '500 100 200', // Pologne
        '+351': '912 345 678', // Portugal
    },

    /**
     * Expressions régulières pour la validation des champs.
     */
    regex: {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
        name: /^[a-zA-Z\s'-]{2,}$/,
        phone: /^[0-9\s\(\)-]+$/,
        money: /^\d{1,9}$/,
    },

    /**
     * Met en place une validation visuelle en temps réel sur un champ de formulaire.
     * @param {HTMLInputElement} inputElement - L'élément input à valider.
     * @param {string} validationType - Le type de validation ('name', 'email', 'phone').
     */
    setupVisualValidation(inputElement, validationType) {
        if (!inputElement) return;

        const neutralColor = 'rgba(255, 255, 255, 0.1)';
        // On récupère les couleurs depuis les variables CSS pour la cohérence du thème
        const rootStyles = getComputedStyle(document.documentElement);
        const validColor = rootStyles.getPropertyValue('--validation-success').trim() || '#2ECC71';
        const invalidColor = rootStyles.getPropertyValue('--validation-error').trim() || '#E74C3C';

        inputElement.addEventListener('input', () => {
            const value = inputElement.value;
            const regex = this.regex[validationType];

            if (value.length === 0) {
                inputElement.style.borderColor = neutralColor;
                return;
            }

            if (regex && regex.test(value)) {
                // Cas spécial pour le téléphone : on attend une longueur minimale
                if (validationType === 'phone' && value.length < 5) {
                    inputElement.style.borderColor = invalidColor;
                } else {
                    inputElement.style.borderColor = validColor;
                }
            } else {
                inputElement.style.borderColor = invalidColor;
            }
        });

        // Réinitialise la couleur si le champ est vidé
        inputElement.addEventListener('blur', () => {
            if (inputElement.value.length === 0) {
                inputElement.style.borderColor = neutralColor;
            }
        });
    },

    setupNumericInput(inputElement, options = {}) {
    if (!inputElement) return;
    const maxDigits = options.maxDigits ?? 9;
    const decimals = options.decimals ?? 0;
    inputElement.addEventListener('input', () => {
        const cleaned = this._normalizeNumber(inputElement.value, maxDigits, decimals);
        if (cleaned !== inputElement.value) inputElement.value = cleaned;
    });
    },
    _normalizeNumber(value, maxDigits, decimals) {
        let v = value.replace(/[^\d.,]/g, '').replace(/,/g, '.');   // colle "4 500 €" -> "4500"
        if (decimals === 0) return (v.replace(/\./g, '')).slice(0, maxDigits);
        const [i = '', d = ''] = v.split('.');
        return d ? `${i.slice(0, maxDigits)}.${d.slice(0, decimals)}` : i.slice(0, maxDigits);
    },
};
