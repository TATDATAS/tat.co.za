// js/consent-manager.js

/**
 * Gère l'affichage et la persistance du consentement utilisateur pour les cookies (RGPD).
 */
(function() {
    'use strict';

    const CONSENT_STORAGE_KEY = 'tat_cookie_consent';
    const banner = document.getElementById('consent-banner');
    const acceptBtn = document.getElementById('consent-accept');
    const refuseBtn = document.getElementById('consent-refuse');

    if (!banner || !acceptBtn || !refuseBtn) {
        console.error('[ConsentManager] Un ou plusieurs éléments de la bannière RGPD sont introuvables.');
        return;
    }

    /**
     * Récupère le statut du consentement depuis le localStorage.
     * @returns {string|null} 'accepted', 'refused', ou null si aucun choix n'a été fait.
     */
    const getConsentStatus = () => localStorage.getItem(CONSENT_STORAGE_KEY);

    /**
     * Sauvegarde le statut du consentement et masque la bannière.
     * @param {string} status - 'accepted' ou 'refused'.
     */
    const setConsentStatus = (status) => {
        localStorage.setItem(CONSENT_STORAGE_KEY, status);
        banner.classList.remove('is-visible');
        console.log(`[ConsentManager] Consentement enregistré : ${status}`);
        
        if (status === 'accepted') {
            // Ici, on pourrait charger des scripts tiers comme Google Analytics.
            console.log('[ConsentManager] Les scripts nécessitant un consentement peuvent maintenant être chargés.');
        }
    };

    acceptBtn.addEventListener('click', () => setConsentStatus('accepted'));
    refuseBtn.addEventListener('click', () => setConsentStatus('refused'));

    // Affiche la bannière uniquement si aucun consentement n'a été donné.
    if (!getConsentStatus()) {
        banner.classList.add('is-visible');
        console.log('[ConsentManager] Aucun consentement trouvé, affichage de la bannière.');
    }
})();
