/**
 * TATBooker - Main Engine
 * Gestion de l'affichage dynamique et de l'optimisation des performances
 */

console.log('[Main] Script chargé');

window.SettingsManager = {
    /**
     * Sauvegarde un paramètre depuis l'UI vers le backend.
     * Gère la conversion de type et la sélection de catégorie.
     */
    async saveSettingFromUI(key, value) {
        // Détermination de la catégorie selon la clé (Préférences Utilisateur vs Agence)
        const category = ['discreet_mode', 'ui_language', 'persist_active_theme'].includes(key) ? 'Employee' : 'Company';
        const userId = (category === 'Employee') ? (StateStore.state.currentUser?.id || 0) : 0;
        
        // Conversion en chaîne de caractères pour le bridge Python (bool -> string)
        const valStr = (typeof value === 'boolean') ? (value ? 'True' : 'False') : String(value);
        
        console.log(`[Settings] Persistance : ${key} = ${valStr} (${category})`);
        
        const success = await ApiService.saveSetting(key, valStr, category, userId);
        if (success !== false) {
            UiService.showToast(`Réglage mis à jour.`, "success");
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('[Main] DOMContentLoaded déclenché');
    console.log('[Main] Initialisation de l\'application TATBooker...');
    
    // Image de secours si une ressource spécifique est introuvable
    const DEFAULT_DEST_IMAGE = 'assets/images/fallback-safari.jpg';

    // Initialisation des moteurs visuels
    if (typeof PaletteEngine !== 'undefined') {
        PaletteEngine.startLoop();
        console.log('[Main] PaletteEngine démarré.');
    } else {
        console.error('[Main] PaletteEngine non défini');
    }
    if (typeof WeatherSimulator !== 'undefined') {
        WeatherSimulator.init();
        console.log('[Main] WeatherSimulator démarré.');
    } else {
        console.error('[Main] WeatherSimulator non défini');
    }
    
    // Création des particules
    if (typeof createParticles !== 'undefined') {
        createParticles();
        console.log('[Main] Particules créées.');
    } else {
        console.error('[Main] createParticles non défini');
    }
    
    const destinationsGrid = document.getElementById('destinationsGrid');
    
    // Données simulées (normalement issues d'une API ou d'un fichier JSON)
    const destinations = [
        { id: 1, title: 'Kruger Safari', location: 'Limpopo', class: 'safari', image: 'assets/images/kruger.jpg' },
        { id: 2, title: 'Table Mountain', location: 'Cape Town', class: 'nature', image: 'assets/images/table-mountain.jpg' },
        { id: 3, title: 'Garden Route', location: 'Western Cape', class: 'coast', image: 'assets/images/garden-route.jpg' },
        { id: 4, title: 'Blyde River', location: 'Mpumalanga', class: 'canyon', image: 'assets/images/blyde.jpg' },
        { id: 5, title: 'Drakensberg', location: 'KwaZulu-Natal', class: 'mountain', image: 'assets/images/drakensberg.jpg' },
        { id: 6, title: 'Wild Coast', location: 'Eastern Cape', class: 'beach', image: 'assets/images/wild-coast.jpg' }
    ];

    /**
     * Initialise l'Intersection Observer pour le lazy-loading des cartes
     */
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px 50px 0px'
    };

    const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                console.log(`[Observer] Affichage de la destination: ${card.querySelector('h3').innerText}`);
                card.classList.add('is-visible');
                observer.unobserve(card);
            }
        });
    }, observerOptions);

    /**
     * Génère dynamiquement les cartes dans la grille avec un état initial masqué
     */
    destinations.forEach(dest => {
        const card = document.createElement('div');
        card.className = `glass-card destination-card ${dest.class}`;
        
        // Structure initiale avec skeleton
        card.innerHTML = `
            <div class="destination-img skeleton"></div>
            <div class="dest-content">
                <h3>${dest.title}</h3>
                <p>${dest.location}</p>
            </div>
        `;

        const destImg = card.querySelector('.destination-img');
        const imgUrl = dest.image || DEFAULT_DEST_IMAGE;

        // Chargement asynchrone de l'image pour gérer le skeleton
        const tempImg = new Image();
        tempImg.src = imgUrl;
        tempImg.onload = () => {
            destImg.style.backgroundImage = `url('${imgUrl}')`;
            destImg.classList.remove('skeleton');
        };
        tempImg.onerror = () => {
            destImg.style.backgroundImage = `url('${DEFAULT_DEST_IMAGE}')`;
            destImg.classList.remove('skeleton');
        };
        
        destinationsGrid.appendChild(card);
        cardObserver.observe(card);
    });

    // Rétablissement du calendrier dynamique (Flatpickr)
    if (typeof flatpickr !== 'undefined') {
        const fp = flatpickr("#contact-date", {
            locale: "fr",
            mode: "range",
            dateFormat: "d/m/Y",
            disableMobile: "true"
        });

        document.getElementById('calendar-icon-trigger')?.addEventListener('click', () => {
            fp.open();
        });
    }

    const prefixSelect = document.getElementById('contact-country-prefix');
    const phoneInput = document.getElementById('contact-phone');

    const updatePlaceholder = () => {
        if (phoneInput && prefixSelect) {
            const pattern = Utils.phoneFormats[prefixSelect.value];
            phoneInput.placeholder = pattern || "6 12 ...";
            
            if (pattern) {
                phoneInput.maxLength = pattern.length;
                console.log(`[Phone] Pattern détecté: ${pattern} (Max: ${pattern.length})`);
            } else {
                phoneInput.removeAttribute('maxLength');
            }

            // Déclenche le re-formatage de la valeur existante si nécessaire
            phoneInput.dispatchEvent(new Event('input'));
        }
    };

    if (prefixSelect) prefixSelect.addEventListener('change', updatePlaceholder);
    updatePlaceholder();

    /**
     * Validation finale lors de la soumission
     */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            const pattern = Utils.phoneFormats[prefixSelect.value];
            if (pattern && phoneInput && phoneInput.value.length < pattern.length) {
                e.preventDefault();
                console.warn('[Form] Soumission bloquée : numéro de téléphone incomplet.');
                phoneInput.style.borderColor = "#E74C3C"; // Rouge (Incomplet)
                phoneInput.focus();
            }
        });
    }

    // Initialisation de la validation sur les champs statiques
    Utils.setupVisualValidation(document.getElementById('contact-name'), 'name');
    Utils.setupVisualValidation(document.getElementById('contact-email'), 'email');
    Utils.setupVisualValidation(document.getElementById('contact-phone'), 'phone');

    /**
     * Formulaire Partenaire (Génération dynamique et validation)
     */
    const editModeToggle = document.getElementById('edit-mode-toggle');
    const dynamicFormGrid = document.getElementById('dynamicFormGrid');
    const resetBtn = document.getElementById('partner-reset-btn');

    const partnerFields = [
        { id: 'partner-company', label: 'Nom de l\'agence', type: 'text', validation: 'name', placeholder: 'Wild Safari Co.' },
        { id: 'partner-email', label: 'Email Pro', type: 'email', validation: 'email', placeholder: 'partner@safari.za' },
        { id: 'partner-phone', label: 'Téléphone Pro', type: 'tel', validation: 'phone', placeholder: '021 555 ...' }
    ];

    if (editModeToggle && dynamicFormGrid) {
        editModeToggle.addEventListener('change', () => {
            if (editModeToggle.checked) {
                console.log('[Partner] Activation du mode partenaire.');
                dynamicFormGrid.style.display = 'grid';
                if (resetBtn) resetBtn.style.display = 'inline-flex';
                // On génère les champs uniquement à la première activation
                if (dynamicFormGrid.children.length === 0) {
                    partnerFields.forEach(field => {
                        const fieldDiv = document.createElement('div');
                        fieldDiv.className = 'field';
                        fieldDiv.innerHTML = `
                            <label for="${field.id}" class="field-label">${field.label}</label>
                            <input type="${field.type}" id="${field.id}" class="field-value" placeholder="${field.placeholder}">
                        `;
                        dynamicFormGrid.appendChild(fieldDiv);
                        // Application immédiate de la validation sur le nouveau champ
                        Utils.setupVisualValidation(fieldDiv.querySelector('input'), field.validation);
                    });
                }
            } else {
                dynamicFormGrid.style.display = 'none';
                if (resetBtn) resetBtn.style.display = 'none';
            }
        });

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                const inputs = dynamicFormGrid.querySelectorAll('input');
                inputs.forEach(input => {
                    input.value = '';
                    // Réinitialisation de la bordure (état neutre défini dans setupVisualValidation)
                    input.style.borderColor = "rgba(255, 255, 255, 0.1)";
                });
                console.log('[PartnerForm] Champs réinitialisés.');
            });
        }
    }

    // Initialisation du Weather Simulator s'il est présent
    if (typeof PaletteEngine !== 'undefined') {
        console.log('[Main] Démarrage du moteur de palettes.');
        PaletteEngine.startLoop();
    }

    if (typeof window.WeatherSimulator !== 'undefined') {
        window.WeatherSimulator.start();
    } else if (document.body.getAttribute('data-theme') === null) {
        document.body.setAttribute('data-theme', 'sun');
    }
});