# Roadmap tat.co.za - Site Vitrine TATBooker

---

## ⏸️ Audit Stratégique (06/08/2026) - "Où en sommes-nous ?"

**Contexte** : Une pause stratégique pour évaluer l'avancement, identifier les points de friction et redéfinir les priorités. Cette section sert de point de contrôle pour s'assurer que le projet reste aligné avec ses objectifs initiaux.

### 1. D'où venons-nous ? (L'Origine)

*   **Point de départ** : Un fichier HTML unique (`tambo.adventure.travel.co.za (original).html`) avec un design "glassmorphism" et 5 palettes de couleurs.
*   **Objectif initial** : Refactoriser ce monolithe en une structure de site web moderne, modulaire et maintenable (HTML sémantique, CSS et JS séparés).
*   **Intention** : Créer un site vitrine pour TATBooker, axé sur la conversion de leads, tout en respectant scrupuleusement le design original.

### 2. Où en sommes-nous ? (État Actuel)

*   **Fondations (Phase 1)** : Largement terminées.
    *   ✅ **HTML** : La structure sémantique est en place (`index.html`).
    *   ✅ **CSS** : Les styles sont modularisés (`style.css`, `palettes.css`, `glassmorphism.css`, `responsive.css`).
    *   ✅ **JavaScript** : La logique de base est séparée (`palette-engine.js`, `contact-form.js`, etc.).
    *   ✅ **Fonctionnalités Clés** : Le moteur de palettes, les formulaires de base et l'intégration du checkpoint sont fonctionnels.

### 3. Vers quoi allons-nous ? (Problématiques & Prochaines Étapes)

Le projet est à un point charnière où il faut passer des fondations techniques à l'expérience utilisateur et à la performance.

**Problématique A : Performance et Immersion Visuelle**
*   **Constat** : Le fond de la page (`body`) est visuellement statique. Le chargement des polices et des images n'est pas optimisé, ce qui peut causer un "flash" de contenu non stylisé (FOIT/FOUC) et ralentir le premier affichage.
*   **Plan d'action** :
    1.  **ABANDON DES EFFETS KEN BURNS**
    2.  **Optimisation des polices** : Revoir la stratégie de chargement de la police 'Inter'. Utiliser `font-display: swap;` et précharger les polices les plus critiques pour améliorer la performance perçue.

**Problématique B : Finalisation du Parcours Utilisateur**
*   **Constat** : Des fonctionnalités essentielles pour un site vitrine moderne sont définies dans la roadmap mais pas encore implémentées, comme la capture d'emails pour la newsletter et la gestion du consentement RGPD.
*   **Plan d'action** :
    1.  **Newsletter (Phase 2)** : Prioriser l'implémentation du formulaire de newsletter dans le footer. C'est un point de capture de lead simple et efficace.
    2.  **RGPD (Objectif 1.7)** : Implémenter la logique JavaScript pour la bannière de consentement. C'est un prérequis légal bloquant pour la mise en production.

## 📋 Vue Générale (30-04-2026)

**Objectif** : Créer un site vitrine moderne, responsive et orienté conversion pour la vente de voyage sur-mesure et capturer des leads.

**Stack** : HTML5 / CSS3 / Vanilla JavaScript (Supabase pour persistence)

**État** : Phase 1 - Fondations (EN COURS)

---

## 🎯 Phase 1 : Fondations (ACTUELLE)

### Objectif 1.1 : Restructuration HTML Sémantique
**Description** : Refactoriser le HTML existant (tambo.adventure.travel.co.za.html) en structure modulaire.

**Note Importante** : Le site final doit *strictement* ressembler au fichier de référence `tambo.adventure.travel.co.za (original).html`.
**Tâches** :
- [x] Analyser le HTML existant (glassmorphism + 5 palettes)
- [x] Créer `/index.html` avec structure sémantique (header, nav, main, footer)
- [x] Séparer les sections : Hero, Palettes, Features, CTA, Footer
- [x] Réorganiser les documents de conception dans `/info-pre-dev/`
- [x] Documenter les classes CSS extraites pour le respect du design original
- [x] Nettoyer `index.html` en déportant les ressources inline

**Fichiers** :
- `index.html` (nouveau)

**Priorité** : ✅ TERMINÉ

---

### Objectif 1.2 : Modularisation CSS [PROCHAINE ÉTAPE]
**Description** : Extraire et organiser les styles en modules par responsabilité pour alléger `index.html`.

**Tâches** :
- [x] Créer `css/style.css` (Base, Fonts, Reset & Layout)
- [x] Créer `css/palettes.css` (Variables des 5 climats)
- [x] Créer `css/glassmorphism.css` (Effets de transparence et flou)
- [x] Créer `css/responsive.css` (Media queries spécifiques)
- [x] Mettre à jour les variables CSS (--primary, --secondary, --accent)
- [x] Tests cross-browser (Chrome, Firefox, Safari)

**Fichiers** :
- `css/style.css`
- `css/palettes.css`
- `css/glassmorphism.css`
- `css/responsive.css`

**Priorité** : 🔴 HAUTE

---

### Objectif 1.3 : JavaScript Modulaire [CORRECTION ERREURS]
**Description** : Refactoriser le JavaScript en modules séparés avec responsabilité unique.

**Tâches** :
- [x] Créer `js/main.js` → point d'entrée, initialisation app
- [x] Créer `js/palette-engine.js` → logique visuelle (Particules)
- [x] Corriger les chemins d'accès et types MIME (blocage Firefox)
- [x] Créer `js/weather-simulator.js` → simulation météo pour démo et vérifier son intégration
- [ ] Créer `js/utils.js` → fonctions utilitaires (DOM, animations)
- [ ] Implémentation pattern Module (IIFE ou ES6)

**Fichiers** :
- `js/main.js`
- `js/palette-engine.js`
- `js/weather-simulator.js`
- `js/utils.js`

**Priorité** : 🔴 HAUTE

---

### Objectif 1.4 : Formulaire Contact & Démo
**Description** : Ajouter des formulaires pour capture de leads et demandes de démo.

**Tâches** :
- [x] Créer `js/contact-form.js` → validation et gestion du formulaire
  - Champs : nom, email, téléphone, message, consent RGPD
  - Validation côté client (email format, téléphone, longueur)
  - Feedback utilisateur (loading, success, error)
- [x] Créer `js/lead-capture.js` → gestion de l'envoi des leads
  - Initialement configuré pour Supabase, mais sera remplacé par Mailygo (voir Objectif 1.9).
  - Gestion erreurs réseau
  - Rate limiting (anti-spam)
- [x] Créer formulaire HTML (modal ou section inline)
- [ ] Tests de validation (inputs valides/invalides)
- [ ] Tests soumission (network failures)

**Fichiers** :
- `js/contact-form.js`
- `js/lead-capture.js`
- Section formulaire dans `index.html`

**Priorité** : ✅ TERMINÉ (Logique de base, persistance à adapter)

---

### Objectif 1.5 : Responsive Design
**Description** : Garantir une expérience mobile, tablette et desktop optimale.

**Tâches** :
- [x] Breakpoints CSS : 320px, 768px, 1024px, 1440px
- [ ] Tests manuals (Chrome DevTools, real devices)
- [ ] Optimisation images (WebP, lazy loading)
- [ ] Tests accessibilité (WCAG 2.1 AA)
  - Contraste couleurs
  - Focus visible
  - Sémantique ARIA
- [ ] Performance Lighthouse (>90 score)
  - Minification CSS/JS
  - Critical CSS inline
  - Defer scripts non-critiques

**Fichiers** :
- `css/responsive.css` (updates)
- Optimisation `index.html`

**Priorité** : 🔴 HAUTE

---

### Objectif 1.6 : Configuration VS Code
**Description** : Mettre en place l'environnement de développement optimal.

**Tâches (Statut : En cours - Dell E5550 - 16GB RAM)** :
- [x] Créer `.vscode/settings.json` (Configuration Optimale)
- [x] Extensions recommandées (`.vscode/extensions.json`)
- [x] Créer `.prettierrc.json` pour formatage consistent
- [x] `.eslintrc.json` pour linting JavaScript
- [ ] Tâches VS Code (build, lint, test)

**Fichiers** :
- `.vscode/settings.json`
- `.vscode/extensions.json`
- `.prettierrc.json`
- `.eslintrc.json`

**Priorité** : 🟢 BASSE

---

### Objectif 1.7 : Conformité RGPD & Bannière Cookies
**Description** : Mettre en place une bannière de consentement pour les cookies et créer les pages légales (Politique de Confidentialité, CGU) pour être en conformité avec le RGPD.

**Tâches** :
- **[x] UI/HTML : Création de la Bannière de Consentement**
    - [x] Créer la structure HTML de la bannière dans `index.html`.
    - [x] Ajouter des liens vers les pages `politique-de-confidentialite.html` et `cgu.html`.
- **[x] CSS : Stylisation de la Bannière**
    - [x] Dans `css/style.css`, styliser la bannière pour qu'elle s'intègre au design "glassmorphism" et gérer son animation.
- **[x] JS : Gestion du Consentement (`js/consent-manager.js`)**
    - [x] Créer le fichier `js/consent-manager.js`.
    - [x] Implémenter la logique pour afficher la bannière si aucun choix n'est enregistré dans `localStorage`.
    - [x] Gérer les clics sur les boutons pour sauvegarder le choix de l'utilisateur et masquer la bannière.
    - [x] Mettre en place la logique de blocage/déblocage des scripts tiers (ex: Analytics) en fonction du consentement.
- **[ ] Contenu : Pages Légales**
    - [ ] Créer les fichiers `politique-de-confidentialite.html` et `cgu.html` avec une structure de base et un contenu type à faire valider juridiquement.
- **[ ] Intégration : Mise à jour du Footer**
    - [ ] Ajouter les liens vers les nouvelles pages légales dans le `<footer>` de `index.html`.

**Fichiers** :
- `js/consent-manager.js` (nouveau)
- `politique-de-confidentialite.html` (nouveau)
- `cgu.html` (nouveau)
- `index.html` (modifications)
- `css/style.css` (modifications)

**Priorité** : 🔴 HAUTE (Bloquant pour la mise en production)

### Objectif 1.9 : Intégration Mailygo pour la Capture de Leads
**Description** : Remplacer le mécanisme de persistance des leads (précédemment Supabase) par une intégration directe avec un service d'envoi d'e-mails dédié, "Mailygo". Ce service sera responsable de la réception des données du formulaire et de l'envoi d'un e-mail à une adresse configurée.

**Tâches** :
- **Frontend (`tat.co.za`)** :
  - [ ] Mettre à jour `js/contact-form.js` pour intercepter la soumission du formulaire et envoyer les données via `fetch` (ou `XMLHttpRequest`) à l'API Mailygo.
  - [ ] Gérer les réponses de l'API Mailygo (succès, échec) et fournir un feedback utilisateur approprié.
  - [ ] Supprimer ou adapter la logique d'envoi à Supabase dans `js/lead-capture.js` ou `js/contact-form.js`.
  - [ ] Définir l'URL de l'API Mailygo (ex: via une variable globale injectée dans `index.html` ou un fichier de configuration JS).
- **Backend (Mailygo - *externe à ce projet*)** :
  - [ ] (Note: Ce point est pour la clarté, Mailygo est un service externe à `tat.co.za` et `TATBooker` dans ce contexte.)
  - [ ] Un service backend (Mailygo) doit être mis en place pour recevoir les requêtes HTTP POST du formulaire.
  - [ ] Ce service doit extraire les données du formulaire, les valider et les formater dans un e-mail.
  - [ ] Il doit ensuite envoyer cet e-mail via un serveur SMTP configuré (ex: Outlook).
  - [ ] Il doit renvoyer une réponse HTTP (200 OK, 400 Bad Request, 500 Internal Server Error) au frontend.

**Structure de dossiers** :
- `tat.co.za/js/` (pour les modifications frontend)
- (Note: Le backend Mailygo aurait sa propre structure de dossiers, non gérée ici.)

**Fichiers à créer** :
- `js/config.js` (pour l'URL de l'API Mailygo, si non injectée dans `index.html`).

**Fichiers à modifier** :
- `roadmap.md` (pour cet objectif et la mise à jour de 1.4).
- `js/contact-form.js`.
- `js/lead-capture.js` (si sa logique Supabase est supprimée).
- `index.html` (pour inclure `config.js` ou injecter l'URL).

**Priorité** : 🔴 HAUTE (Bloquant pour la mise en production du formulaire)

---

### Objectif 1.8 : Intégration du Checkpoint Sécurisé
**Description** : Implémenter la logique côté client pour la page `CheckPoint.html` afin de valider les tokens QR code via Supabase et de mettre à jour leur statut.

**Tâches** :
- **[x] JS : Lecture et Validation du Token (`js/checkpoint-manager.js`)**
    - [x] Créer le fichier `js/checkpoint-manager.js`.
    - [x] Au chargement de `CheckPoint.html`, lire le paramètre `token` de l'URL.
    - [x] Effectuer un appel Supabase pour vérifier la validité du token (existence, non expiré, statut 'generated').
    - [x] Si valide, mettre à jour le statut du token à 'scanned' et enregistrer `scanned_at` dans Supabase.
    - [x] Gérer les erreurs (token invalide, expiré, déjà utilisé) et afficher des messages appropriés.
- **[x] UI : Affichage du Statut sur `CheckPoint.html`**
    - [x] Afficher un message de succès clair si le checkpoint est validé.
    - [x] Afficher un message d'erreur si le token est invalide ou si la validation échoue.
    - [x] Le champ numérique existant peut être utilisé pour une saisie optionnelle (ex: nombre de participants) à envoyer avec la mise à jour du token.

**Fichiers** :
- `js/checkpoint-manager.js` (nouveau)
- `CheckPoint.html` (modifications)

**Priorité** : ✅ TERMINÉ (Dépend de l'Objectif 84 de TATBooker)

---

---
## 📁 Structure de Projet Finale (Phase 1)

```
tat.co.za/
├── index.html                           # Page principale (sémantique)
├── favicon.ico
├── robots.txt
├── sitemap.xml
│
├── css/
│   ├── style.css                        # Styles généraux + variables CSS
│   ├── palettes.css                     # 5 palettes climatiques
│   ├── glassmorphism.css                # Composants glass
│   └── responsive.css                   # Media queries
│
├── js/
│   ├── main.js                          # Point d'entrée
│   ├── palette-engine.js                # Moteur oscillation
│   ├── weather-simulator.js             # Simulation météo
│   ├── contact-form.js                  # Gestion formulaire
│   ├── lead-capture.js                  # Envoi vers Supabase
│   └── utils.js                         # Utilitaires
│
├── assets/
│   ├── images/
│   │   ├── hero-bg.jpg
│   │   ├── logo.svg
│   │   └── favicon/
│   └── fonts/
│       └── inter/
│
├── .vscode/
│   ├── settings.json
│   └── extensions.json
│
├── .prettierrc.json
├── .eslintrc.json
├── README.md
└── roadmap.md
```

---

## 🚀 Checklist Phase 1

- [x] Objectif 1.1 : HTML sémantique (100% - Terminé)
- [x] Objectif 1.2 : CSS modulaire (100% - Terminé)
- [x] Objectif 1.3 : JavaScript modulaire (100% - Terminé)
- [x] Objectif 1.4 : Formulaires + Lead capture (100% - Terminé)
- [ ] Objectif 1.5 : Responsive + Performance (En cours)
- [x] Objectif 1.6 : Environnement VS Code (100% - Terminé)
- [ ] Objectif 1.7 : Conformité RGPD & Bannière Cookies (À faire)
- [x] Objectif 1.8 : Intégration du Checkpoint Sécurisé (Terminé)
- [ ] Objectif 1.9 : Intégration Mailygo (À faire)

**Statut Global** : Phase 1 - Fondations (En cours - Finalisation)

---

## 📅 Phase 2 : Expansion (PRÉ-DÉPLOIEMENT)

| Fonction | Priorité | État |
|----------|----------|------|
| Intégration Newsletter (`js/newsletter.js`) | 🟡 Moyenne | À faire |
| Stockage leads (Supabase/Google Sheets) | 🔴 Haute | À faire |
| SEO (meta tags, structured data) | 🟠 Moyenne | À faire |
| Animations avancées (GSAP) | 🟢 Basse | À faire |
| Témoignages clients | 🟠 Moyenne | À faire |
| Analytics (Google Analytics 4) | 🟠 Moyenne | À faire |
| A/B Testing (Supabase) | 🟢 Basse | À faire |
| CMS Headless (intégration blog) | 🟢 Basse | À faire |



## 📅 Phase 3 : Engagement & Analytics

| Fonction | Priorité | État |
|----------|----------|------|
| Section Démo Interactive (Vidéo/Animation) | 🟢 Basse | À faire |
| Google Analytics 4 (`js/analytics.js`) | 🟠 Moyenne | À faire |

## � Intégrations Planifiées

### Supabase
- Table `leads` (name, email, phone, message, created_at, status)
- RLS policies (INSERT only, anonymous)
- Real-time notifications (admin dashboard optionnel)

### Google Analytics 4
- Page views, events (form submit, palette select)
- User journey tracking

### Email Service (optionnel)
- SendGrid ou Resend pour confirmation lead
- Template automatisé

---

## 📝 Notes de Développement

### Convention de Nommage
- **CSS** : kebab-case (`.hero-section`, `.glass-card`)
- **JS** : camelCase (`paletteEngine`, `contactForm`)
- **Fichiers** : kebab-case (`palette-engine.js`)
- **IDs HTML** : kebab-case (`#hero-section`)
- **Design** : Respect strict du fichier `tambo.adventure.travel.co.za (original).html`.

### Dépendances Minimales
- Aucune dépendance externe pour Phase 1 (Vanilla JS)
- Supabase CDN en Option (ou npm install)
- Google Fonts (Inter via CDN)

### Compatibilité Navigateurs
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 📞 Contact & Support

**Responsable** : Boris Vermaelen (TATDatas)
**Slack/Discord** : [À configurer]
**Issues** : [GitHub Issues ou Wiki]

---

**Dernière mise à jour** : 2026-04-30
**Version roadmap** : 1.0

=========SUGGESTIONS=================
Ajoute un effet de zoom progressif (ken burns) sur l'image de fond du body pour renforcer l'immersion sauvage.
Vérifie l'optimisation du chargement des polices Inter pour éviter le flash de texte non stylisé (FOIT).


Site Vitrine (tat.co.za)
Objectif : Intégration du module Newsletter
Description : Mettre en place un formulaire d'inscription à la newsletter dans le pied de page du site tat.co.za pour capturer les emails des visiteurs.

Sous-objectifs :

UI/UX : Intégrer un formulaire simple dans le footer de index.html.
Validation : Assurer la validation de l'email côté client.
Persistence : Envoyer et stocker les adresses email dans une table Supabase dédiée (newsletter_subscribers).
Étapes de développement :

[ ] HTML (index.html) : Ajouter la structure du formulaire dans le <footer>.
[ ] CSS (css/style.css) : Styliser le formulaire.
[ ] JavaScript (js/newsletter.js) : Gérer la validation et la soumission du formulaire.
[ ] JavaScript (js/lead-capture.js) : Ajouter une fonction subscribeToNewsletter(email) pour l'appel à Supabase.
[ ] JavaScript (js/main.js) : Initialiser le module de newsletter.
Temps estimé de dev : 2.5 heures

Fichiers à créer :

tat.co.za/js/newsletter.js
Fichiers à modifier :

tat.co.za/index.html
tat.co.za/css/style.css
tat.co.za/js/main.js
tat.co.za/js/lead-capture.js


Maintenant, implémente la logique JavaScript pour la bannière de consentement RGPD.
