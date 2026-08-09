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
        { id: 1, title: 'Kruger Safari', location: 'Limpopo', class: 'safari', image: 'assets/images/kruger.webp' },
        { id: 2, title: 'Table Mountain', location: 'Cape Town', class: 'nature', image: 'assets/images/table-mountain.webp' },
        { id: 3, title: 'Garden Route', location: 'Western Cape', class: 'coast', image: 'assets/images/garden-route.webp' },
        { id: 4, title: 'Blyde River', location: 'Mpumalanga', class: 'canyon', image: 'assets/images/blyde.webp' },
        { id: 5, title: 'Drakensberg', location: 'KwaZulu-Natal', class: 'mountain', image: 'assets/images/drakensberg.webp' },
        { id: 6, title: 'Wild Coast', location: 'Eastern Cape', class: 'beach', image: 'assets/images/wild-coast.webp' },
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
    const contactForm = document.getElementById('contactForm'); // #contactForm
    if (contactForm && typeof Utils !== 'undefined') {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('[Form] Soumission du formulaire de contact interceptée.');

            // 1. Récupération et validation des données
            const nameInput = document.getElementById('contact-name');
            const emailInput = document.getElementById('contact-email');
            const dateInput = document.getElementById('contact-date');
            const messageInput = document.getElementById('contact-msg');

            const isValidName = Utils.regex.name.test(nameInput.value);
            const isValidEmail = Utils.regex.email.test(emailInput.value);
            const isValidPhone = phoneInput.value.length > 5; // Validation simple

            if (!isValidName || !isValidEmail || !isValidPhone) {
                console.error('[Form] Validation échouée. Veuillez vérifier les champs.');
                // Idéalement, afficher un message d'erreur plus global ici.
                if (!isValidName) nameInput.style.borderColor = "#E74C3C";
                if (!isValidEmail) emailInput.style.borderColor = "#E74C3C";
                if (!isValidPhone) phoneInput.style.borderColor = "#E74C3C";
                return;
            }

            // 2. Construction du payload pour le backend
            const formData = {
                name: nameInput.value,
                email: emailInput.value,
                phone: `${prefixSelect.value} ${phoneInput.value}`,
                travel_dates: dateInput.value,
                message: messageInput.value,
                source: 'tat.co.za' // Traçabilité
            };

            console.log('[Form] Données prêtes à être envoyées:', formData);

            // 3. Envoi via le bridge pywebview
            if (window.pywebview && window.pywebview.api) {
                try {
                    await window.pywebview.api.execute('prospect', 'handle_web_lead', formData);
                    console.log('[Form] Lead envoyé avec succès au backend TATBooker.');
                    alert('Merci ! Votre demande a bien été envoyée. Nous vous recontacterons bientôt.');
                    contactForm.reset();
                    // Réinitialiser les bordures des champs
                    [nameInput, emailInput, phoneInput].forEach(input => input.style.borderColor = 'rgba(255, 255, 255, 0.1)');
                } catch (error) {
                    console.error('[Form] Erreur lors de l\'envoi du lead:', error);
                    alert('Une erreur est survenue. Veuillez réessayer plus tard.');
                }
            } else {
                console.warn('[Form] Contexte hors TATBooker. Affichage des données en console uniquement.');
                alert('Ce formulaire est actif uniquement dans l\'application TATBooker.\nDonnées (simulées) :\n' + JSON.stringify(formData, null, 2));
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
    const partnerFormFooter = document.getElementById('partner-form-footer');

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
                if (partnerFormFooter) partnerFormFooter.style.display = 'flex';
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
                if (partnerFormFooter) partnerFormFooter.style.display = 'none';
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
    
    const partnerForm = document.getElementById('partnerForm');
    if (partnerForm && typeof Utils !== 'undefined') {
        partnerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('[PartnerForm] Soumission du formulaire partenaire interceptée.');

            const companyInput = document.getElementById('partner-company');
            const emailInput = document.getElementById('partner-email');
            const phoneInput = document.getElementById('partner-phone');

            const isValidCompany = companyInput && Utils.regex.name.test(companyInput.value);
            const isValidEmail = emailInput && Utils.regex.email.test(emailInput.value);
            const isValidPhone = phoneInput && phoneInput.value.length > 5;

            if (!isValidCompany || !isValidEmail || !isValidPhone) {
                console.error('[PartnerForm] Validation échouée.');
                if (!isValidCompany) companyInput.style.borderColor = "#E74C3C";
                if (!isValidEmail) emailInput.style.borderColor = "#E74C3C";
                if (!isValidPhone) phoneInput.style.borderColor = "#E74C3C";
                return;
            }

            const formData = {
                name: companyInput.value,
                email: emailInput.value,
                phone: phoneInput.value,
                message: "Demande de partenariat depuis le site vitrine.",
                source: 'tat.co.za',
                type: 'Partenaire' // Pour la classification dans le CRM
            };

            console.log('[PartnerForm] Données prêtes à être envoyées:', formData);

            if (window.pywebview && window.pywebview.api) {
                try {
                    await window.pywebview.api.execute('prospect', 'handle_web_lead', formData);
                    console.log('[PartnerForm] Lead partenaire envoyé avec succès au backend.');
                    alert('Merci pour votre intérêt ! Votre demande de partenariat a bien été envoyée.');
                    partnerForm.reset();
                    [companyInput, emailInput, phoneInput].forEach(input => input.style.borderColor = 'rgba(255, 255, 255, 0.1)');
                } catch (error) {
                    console.error('[PartnerForm] Erreur lors de l\'envoi du lead:', error);
                    alert('Une erreur est survenue. Veuillez réessayer plus tard.');
                }
            } else {
                console.warn('[PartnerForm] Contexte hors TATBooker. Affichage des données en console uniquement.');
                alert('Ce formulaire est actif uniquement dans l\'application TATBooker.\nDonnées (simulées) :\n' + JSON.stringify(formData, null, 2));
            }
        });
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