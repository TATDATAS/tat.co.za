/**
 * TATBooker - Main Engine
 * Gestion de l'affichage dynamique et de l'optimisation des performances
 */

import { captureLead } from './lead-capture.js';

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

    const langSwitcher = document.getElementById('langSwitcher');
    const langToggle = langSwitcher?.querySelector('.lang-toggle');
    const langMenu = langSwitcher?.querySelector('.lang-menu');

    if (langSwitcher && langToggle && langMenu) {
        const setLanguageMenuOpen = (isOpen) => {
            langSwitcher.classList.toggle('is-open', isOpen);
            langToggle.setAttribute('aria-expanded', String(isOpen));
            langMenu.hidden = !isOpen;
        };

        langToggle.addEventListener('click', () => {
            setLanguageMenuOpen(langToggle.getAttribute('aria-expanded') !== 'true');
        });

        document.addEventListener('click', (event) => {
            if (!langSwitcher.contains(event.target)) setLanguageMenuOpen(false);
        });

        langSwitcher.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                setLanguageMenuOpen(false);
                langToggle.focus();
            }
        });
    }
    
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

    // ------------------------------------------------------------------
    // Formulaire B2B unique "Request a DMC Proposal" (Objectif 65)
    // Un seul formulaire, un seul payload, un seul point d'envoi.
    // ------------------------------------------------------------------
    const dateInput = document.getElementById('dmc-date');
    const dateFormatSelect = document.getElementById('dmc-date-format');
    let datePicker = null;
    const pageLanguage = document.documentElement.lang;
    const isDutch = pageLanguage === 'nl';
    const isFrench = pageLanguage === 'fr';
    const translate = (english, french, dutch) => (
        isDutch ? dutch : isFrench ? french : english
    );

    if (typeof flatpickr !== 'undefined' && dateInput) {
        const pageLocale = isDutch ? 'nl' : 'fr';
        datePicker = flatpickr(dateInput, {
            locale: pageLocale,
            mode: "range",
            dateFormat: "d/m/Y",
            disableMobile: "true"
        });

        document.getElementById('calendar-icon-trigger')?.addEventListener('click', () => {
            datePicker.open();
        });

        // Le selecteur FR/UK/US pilote reellement le format affiche
        dateFormatSelect?.addEventListener('change', () => {
            const formats = { 'fr-FR': 'd/m/Y', 'nl-NL': 'd/m/Y', 'en-GB': 'd/m/Y', 'en-US': 'm/d/Y' };
            const locales = { 'fr-FR': 'fr', 'nl-NL': 'nl', 'en-GB': 'en', 'en-US': 'en' };
            datePicker.set('dateFormat', formats[dateFormatSelect.value] || 'd/m/Y');
            datePicker.l10n.useLocale(locales[dateFormatSelect.value] || 'fr');
            console.log(`[DMC Form] Format de date: ${dateFormatSelect.value}`);
        });
    }

    const prefixSelect = document.getElementById('dmc-prefix');
    const phoneInput = document.getElementById('dmc-phone');

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
     * Validation finale et envoi du formulaire B2B unifie
     */
    const dmcForm = document.getElementById('dmcForm');
    const feedback = document.getElementById('dmc-feedback');
    const showFeedback = (text, type = 'success') => {
        if (!feedback) return;
        feedback.textContent = text;
        feedback.className = `message ${type}`;
        feedback.hidden = false;
        feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    const hideFeedback = () => { if (feedback) feedback.hidden = true; };

    if (dmcForm && typeof Utils !== 'undefined') {
        const fields = {
            company: document.getElementById('dmc-company'),
            contact: document.getElementById('dmc-name'),
            email: document.getElementById('dmc-email'),
            location: document.getElementById('dmc-location'),
            proType: document.getElementById('dmc-pro-type'),
            profile: document.getElementById('dmc-profile'),
            pax: document.getElementById('dmc-pax'),
            budget: document.getElementById('dmc-budget'),
            currency: document.getElementById('dmc-currency'),
            message: document.getElementById('dmc-message')
        };

        // Utils.regex.name est ASCII-only: il refuserait une raison sociale avec
        // chiffres/accents ou un prenom type "Elodie". On utilise des patterns dedies.
        const COMPANY_REGEX = /^[\p{L}\p{N}][\p{L}\p{N}'’&.,()+\- ]{1,}$/u;
        const NAME_REGEX = /^[\p{L}][\p{L}\s'’-]{1,}$/u;

        const checks = [
            { el: fields.company, test: (v) => COMPANY_REGEX.test(v.trim()), label: isDutch ? 'Bedrijf / reisbureau' : 'Company / Agency' },
            { el: fields.contact, test: (v) => NAME_REGEX.test(v.trim()), label: isDutch ? 'Contactpersoon' : 'Contact Name' },
            { el: fields.email, test: (v) => Utils.regex.email.test(v.trim()), label: isDutch ? 'Zakelijk e-mailadres' : 'Business Email' },
            { el: fields.location, test: (v) => v.trim().length >= 2, label: isDutch ? 'Locatie van het bedrijf' : 'Company Location' },
            { el: phoneInput, test: (v) => v.length > 5, label: isDutch ? 'Telefoon' : 'Phone' },
            { el: fields.budget, test: (v) => v.trim() === '' || Utils.regex.money.test(v.trim()), label: isDutch ? 'Richtbudget' : 'Indicative Budget' }
        ];

        dmcForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideFeedback();
            console.log('[DMC Form] Soumission du formulaire B2B unifie interceptee.');

            // 1. Validation (bordure rouge sur les champs fautifs)
            const invalidLabels = [];
            checks.forEach((check) => {
                if (!check.el) return;
                const ok = check.test(check.el.value || '');
                check.el.style.borderColor = ok ? 'rgba(255, 255, 255, 0.1)' : '#E74C3C';
                if (!ok) invalidLabels.push(check.label);
            });

            if (invalidLabels.length > 0) {
                console.error('[DMC Form] Validation echouee pour:', invalidLabels.join(', '));
                alert(isDutch
                    ? `Controleer de volgende velden: ${invalidLabels.join(', ')}.`
                    : `Please check the following field(s): ${invalidLabels.join(', ')}.`);
                return;
            }

            // One validated payload is sent to both TATBooker and Supabase.
            const payload = {
                name: fields.company.value.trim(),
                contact: fields.contact.value.trim(),
                email: fields.email.value.trim(),
                phone: `${prefixSelect ? prefixSelect.value : ''} ${phoneInput.value}`.trim(),
                locality: fields.location.value.trim(),
                pro_type: fields.proType ? fields.proType.value : '',
                travel_profile: fields.profile ? fields.profile.value : '',
                pax: fields.pax ? fields.pax.value : '',
                travel_dates: dateInput ? dateInput.value : '',
                budget_per_person: fields.budget ? fields.budget.value.trim() : '',
                budget_currency:   fields.currency ? fields.currency.value : '',
                message: fields.message ? fields.message.value.trim() : '',
                source: 'tat.co.za',
                type: 'Partenaire'
            };

            console.log('[DMC Form] Form submission started.');

            const submitBtn = dmcForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = translate('Sending...', 'Envoi...', 'Verzenden...');
            }

            const sendToTatBooker = async () => {
                if (!window.pywebview?.api) {
                    throw new Error('TATBooker bridge is unavailable.');
                }

                const response = await window.pywebview.api.execute('prospect', 'handle_web_lead', payload);
                if (response && response.success === false) {
                    throw new Error(response.error || 'The backend rejected the request.');
                }
            };

            try {
                const results = await Promise.allSettled([
                    sendToTatBooker(),
                    captureLead(payload)
                ]);
                const [tatBookerResult, supabaseResult] = results;
                const tatBookerSucceeded = tatBookerResult.status === 'fulfilled';
                const supabaseSucceeded = supabaseResult.status === 'fulfilled';

                if (tatBookerSucceeded && supabaseSucceeded) {
                    console.log('[DMC Form] Lead sent to both destinations.');
                    dmcForm.reset();
                    if (datePicker) datePicker.clear();
                    checks.forEach((check) => {
                        if (check.el) check.el.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    });
                    showFeedback(translate(
                        'Your request was sent to TATBooker and saved in Supabase.',
                        'Votre demande a été envoyée à TATBooker et enregistrée dans Supabase.',
                        'Uw aanvraag is naar TATBooker verzonden en in Supabase opgeslagen.'
                    ));
                } else if (tatBookerSucceeded || supabaseSucceeded) {
                    const failedResult = tatBookerSucceeded ? supabaseResult : tatBookerResult;
                    console.error('[DMC Form] Partial submission failure:', failedResult.reason);
                    showFeedback(translate(
                        'Your request was only partially sent. One destination received it; the other failed. Please contact contact@tambo.be before resubmitting to avoid duplicates.',
                        'Votre demande n’a été transmise qu’en partie. Une destination l’a reçue, l’autre a échoué. Contactez contact@tambo.be avant de la renvoyer pour éviter les doublons.',
                        'Uw aanvraag is maar gedeeltelijk verzonden. Eén bestemming heeft deze ontvangen; de andere verzending is mislukt. Neem contact op via contact@tambo.be voordat u opnieuw verzendt om duplicaten te voorkomen.'
                    ), 'warning');
                } else {
                    console.error('[DMC Form] Both submission destinations failed:', {
                        tatBooker: tatBookerResult.reason,
                        supabase: supabaseResult.reason
                    });
                    showFeedback(translate(
                        'We could not send your request. Please try again later or contact contact@tambo.be.',
                        'Votre demande n’a pas pu être envoyée. Réessayez plus tard ou contactez contact@tambo.be.',
                        'Uw aanvraag kon niet worden verzonden. Probeer het later opnieuw of neem contact op via contact@tambo.be.'
                    ), 'error');
                }
            } catch (error) {
                console.error('[DMC Form] Unexpected submission error:', error);
                showFeedback(translate(
                    'An unexpected error prevented your request from being sent. Please contact contact@tambo.be.',
                    'Une erreur inattendue a empêché l’envoi de votre demande. Contactez contact@tambo.be.',
                    'Een onverwachte fout heeft het verzenden van uw aanvraag verhinderd. Neem contact op via contact@tambo.be.'
                ), 'error');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = translate('Send my brief', 'Envoyer mon brief', 'Verstuur mijn aanvraag');
                }
            }
        });

        // Validation visuelle en temps reel. Utils.regex.name etant ASCII-only,
        // 'company' et 'contact' utilisent leurs propres patterns dedies.
        dmcForm.addEventListener('input', hideFeedback);
        const liveValidate = (el, regex) => {
            if (!el) return;
            el.addEventListener('input', () => {
                const value = el.value.trim();
                if (value.length === 0) {
                    el.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    return;
                }
                el.style.borderColor = regex.test(value) ? '#2ECC71' : '#E74C3C';
            });
            el.addEventListener('blur', () => {
                if (el.value.trim().length === 0) el.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            });
        };

        liveValidate(fields.company, COMPANY_REGEX);
        liveValidate(fields.contact, NAME_REGEX);
        Utils.setupVisualValidation(fields.email, 'email');
        Utils.setupVisualValidation(phoneInput, 'phone');
        Utils.setupNumericInput(fields.budget, { decimals: 0, maxDigits: 9 });
        Utils.setupVisualValidation(fields.budget, 'money');
    }

    // NOTE: l'ancien formulaire "Devenir partenaire" a ete fusionne dans le
    // formulaire B2B unique #dmcForm. Le toggle, la generation dynamique de
    // champs et le bouton de reset ne sont plus utilises.

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