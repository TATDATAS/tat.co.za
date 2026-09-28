/**
 * Direction « Soleil de Minuit » : affiche Art déco tropicale nocturne,
 * rose hibiscus comme signal d'action, conversion WhatsApp immédiate.
 */
import {
  ArrowDownRight,
  ArrowUpRight,
  Bug,
  Check,
  CircleDot,
  Crosshair,
  Menu,
  MessageCircle,
  PhoneCall,
  Rat,
  Sparkles,
  X,
} from "lucide-react";
import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from "react";

const whatsappBaseUrl = "https://wa.me/33678785877?text=";
const whatsappUrl = `${whatsappBaseUrl}${encodeURIComponent("Bonjour SOS NUISIBLES, j'ai besoin d'une intervention.")}`;

const services = [
  {
    number: "01",
    icon: Rat,
    title: "Rongeurs",
    text: "Souris, rats et traces de passage : intervention ciblée sur le foyer et les points d’entrée.",
  },
  {
    number: "02",
    icon: Bug,
    title: "Insectes",
    text: "Blattes, fourmis, punaises et autres intrusions : diagnostic rapide et traitement adapté.",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Nids & volants",
    text: "Guêpes, frelons et nids gênants : une réponse en sécurité, sans prise de risque inutile.",
  },
];

const assurances = [
  "Une demande simple par message",
  "Un diagnostic orienté vers une vraie solution",
  "Des conseils clairs pour la suite",
];

const contactOptions = [
  "Rongeurs",
  "Insectes",
  "Nids ou guêpes",
  "Punaises de lit",
  "Présence régulière",
  "Autre situation",
];

const heroSlides = [
  "/images/hero-scene-01.svg",
  "/images/hero-scene-02.svg",
  "/images/hero-scene-03.svg",
  "/images/hero-scene-04.svg",
];

const defaultForm = {
  name: "",
  phone: "",
  problemType: "",
  message: "",
};

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (isPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 10000);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  const closeMenu = () => setMenuOpen(false);
  const previousSlide = () => setActiveSlide((current) => (current - 1 + heroSlides.length) % heroSlides.length);
  const nextSlide = () => setActiveSlide((current) => (current + 1) % heroSlides.length);

  const handleFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const whatsappMessage = useMemo(() => {
    const summary = [
      "Bonjour SOS NUISIBLES,",
      form.name ? `Je m'appelle ${form.name}.` : "Je souhaite une intervention.",
      form.phone ? `Téléphone : ${form.phone}` : "Téléphone : à préciser.",
      form.problemType ? `Type de nuisance : ${form.problemType}` : "Type de nuisance : à préciser.",
      form.message ? `Détails : ${form.message}` : "Détails : je souhaite plus d’informations.",
    ];
    return summary.join("\n");
  }, [form]);

  const whatsappLink = `${whatsappBaseUrl}${encodeURIComponent(whatsappMessage)}`;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.open(whatsappLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="site-shell overflow-x-clip bg-[#07172b] text-[#fff7e9]">
      <header className="site-header">
        <a className="brand" href="#accueil" aria-label="SOS NUISIBLES — accueil">
          <img src="/images/brand-badge.svg" alt="" className="brand-mark" />
          <span className="brand-copy" aria-label="SOS NUISIBLES">
            <b>SOS</b>
            <strong>NUISIBLES</strong>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Navigation principale">
          <a href="#services">Les missions</a>
          <a href="#method">Notre méthode</a>
          <a href="#contact">Contact</a>
        </nav>

        <a className="header-contact" href={whatsappUrl} target="_blank" rel="noreferrer">
          <MessageCircle size={17} strokeWidth={2.5} />
          <span>WhatsApp</span>
        </a>

        <button
          className="mobile-menu-toggle"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>

        {menuOpen && (
          <div className="mobile-menu">
            <a href="#services" onClick={closeMenu}>Les missions</a>
            <a href="#method" onClick={closeMenu}>Notre méthode</a>
            <a href="#contact" onClick={closeMenu}>Contact</a>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" onClick={closeMenu}>
              Écrire sur WhatsApp <ArrowUpRight size={16} />
            </a>
          </div>
        )}
      </header>

      <main id="accueil">
        <section
          className="hero-section"
          aria-labelledby="hero-title"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="hero-backdrop" aria-hidden="true">
            <div className="hero-slides">
              {heroSlides.map((src, index) => (
                <img
                  key={src}
                  className={`hero-slide ${index === activeSlide ? "is-active" : ""}`}
                  src={src}
                  alt={`Image ${index + 1} de la sélection SOS NUISIBLES`}
                  aria-hidden={index !== activeSlide}
                />
              ))}
            </div>
          </div>
          <div className="hero-ribbon">INTERVENTION RAPIDE · DEMANDE PAR WHATSAPP ·</div>
          <div className="hero-content">
            <div className="hero-copy">
              <p className="eyebrow"><span /> PRENEZ LE DESSUS</p>
              <h1 id="hero-title">
                VOS NUISIBLES<br />
                <em>N’ONT PLUS</em><br />
                L’AVANTAGE.
              </h1>
              <p className="hero-summary">
                Une présence qui s’installe ? Envoyez un message. SOS NUISIBLES
                vous aide à retrouver un espace serein, sans détour.
              </p>
              <div className="hero-actions">
                <a className="primary-action" href={whatsappUrl} target="_blank" rel="noreferrer">
                  <MessageCircle size={20} fill="currentColor" />
                  ÉCRIRE SUR WHATSAPP
                  <ArrowUpRight size={19} />
                </a>
                <a className="text-action" href="#services">
                  Voir les missions <ArrowDownRight size={19} />
                </a>
              </div>
            </div>

            <aside className="hero-signal" aria-label="Message d’intervention">
              <div className="signal-topline"><Crosshair size={17} /> URGENCE</div>
              <p>Un message, une intervention.</p>
              <span>RÉPONSE PAR WHATSAPP</span>
              <div className="signal-line" />
              <small>† NUISIBLES : TITI AU SECOURS</small>
            </aside>
          </div>
          <div className="hero-corner-note">SOS / 24 H</div>
          <div className="hero-index" aria-hidden="true"><i /> <span>{String(activeSlide + 1).padStart(2, "0")} / {String(heroSlides.length).padStart(2, "0")}</span></div>
          <div className="hero-slideshow-controls" aria-label="Contrôles du slideshow">
            <button type="button" onClick={previousSlide} aria-label="Image précédente">←</button>
            <div className="hero-dots">
              {heroSlides.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  className={index === activeSlide ? "is-active" : ""}
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Afficher l’image ${index + 1}`}
                  aria-current={index === activeSlide ? "true" : undefined}
                />
              ))}
            </div>
            <button type="button" onClick={nextSlide} aria-label="Image suivante">→</button>
            <span className="slideshow-status">{isPaused ? "PAUSE" : "AUTO"}</span>
          </div>
        </section>

        <section className="marquee-section" aria-label="Nos domaines d’intervention">
          <div className="marquee-track">
            <span>RONGEURS</span><CircleDot />
            <span>INSECTES</span><CircleDot />
            <span>NIDS DE GUEPES</span><CircleDot />
            <span>GROS RONGEURS</span><CircleDot />
            <span>INSECTES RAMPANTS</span><CircleDot />
            <span>NIDS DE FRELONS</span><CircleDot />
          </div>
        </section>

        <section className="services-section" id="services" aria-labelledby="services-title">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow dark-eyebrow"><span /> LES MISSIONS</p>
              
            </div>
            <p className="heading-note">Décrivez ce que vous observez. Orientation vers l’intervention la plus juste.</p>
          </div>

          <div className="service-layout">
            <div className="service-list">
              {services.map(({ number, icon: Icon, title, text }) => (
                <article className="service-item" key={title}>
                  <div className="service-number">{number}</div>
                  <div className="service-icon"><Icon size={25} strokeWidth={1.8} /></div>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                  <ArrowUpRight className="service-arrow" size={22} />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="method-section" id="method" aria-labelledby="method-title">
          <div className="method-ornament" aria-hidden="true">SOS</div>
          <div className="method-grid">
            <div className="method-title-block">
              <p className="eyebrow"><span /> MODE D’ACTION</p>
              <h2 id="method-title">SIMPLE.<br />NET.<br /><em>EFFICACE.</em></h2>
            </div>
            <div className="method-body">
              <div className="method-stamp"><Crosshair size={42} /><span>INTERVENIR<br />JUSTE</span></div>
              <p className="method-lead">Pas besoin de passer par dix écrans : racontez votre situation sur WhatsApp et faites le premier pas vers une solution.</p>
              <ul>
                {assurances.map((item) => (
                  <li key={item}><Check size={18} strokeWidth={3} />{item}</li>
                ))}
              </ul>
              <a className="outline-action" href={whatsappUrl} target="_blank" rel="noreferrer">
                LANCER LA DEMANDE <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <div className="contact-image" aria-hidden="true">
            <img src="/images/cta-signal.svg" alt="" />
          </div>
          <div className="contact-overlay" />
          <div className="contact-content">
            <p className="eyebrow"><span /> LA SOLUTION EST ICI</p>
            <h2 id="contact-title">UNE PRÉSENCE<br />VOUS GÊNE ?<br /><em>ON PASSE À L’ACTION.</em></h2>
            <p>Expliquez ce qui se passe dans le formulaire ci-dessous.</p>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <label className="field">
                  <span>Nom</span>
                  <input type="text" name="name" value={form.name} onChange={handleFieldChange} placeholder="Votre prénom ou nom" />
                </label>
                <label className="field">
                  <span>Téléphone</span>
                  <input type="tel" name="phone" value={form.phone} onChange={handleFieldChange} placeholder="06 12 34 56 78" />
                </label>
                <label className="field full-width">
                  <span>Type de nuisance</span>
                  <select name="problemType" value={form.problemType} onChange={handleFieldChange}>
                    <option value="">Sélectionner</option>
                    {contactOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
                <label className="field full-width">
                  <span>Message</span>
                  <textarea name="message" value={form.message} onChange={handleFieldChange} placeholder="Décrivez le problème, l’endroit et la fréquence d’apparition." rows={5} />
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="primary-action large-action">
                  <MessageCircle size={21} fill="currentColor" />
                  Envoyer sur WhatsApp
                  <ArrowUpRight size={20} />
                </button>
                <p className="form-preview">Prévisualisation : {whatsappMessage}</p>
              </div>
            </form>
          </div>
          <div className="contact-caption"><PhoneCall size={16} /> CONTACT DIRECT / SANS FORMULAIRE</div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#accueil" aria-label="Retour en haut">
          <img src="/images/brand-badge.svg" alt="" className="brand-mark" />
          <span className="brand-copy"><b>SOS</b><strong>NUISIBLES</strong></span>
        </a>
        <div className="footer-meta">
          <p>INTERVENTION CONTRE LES NUISIBLES <span>—</span> CONTACT PAR WHATSAPP</p>
          <small>This website is powered by <strong>TATDATAS</strong>.</small>
        </div>
        <a className="footer-top" href="#accueil">HAUT DE PAGE <ArrowUpRight size={16} /></a>
      </footer>

      <a className="floating-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Contacter SOS NUISIBLES sur WhatsApp">
        <MessageCircle size={23} fill="currentColor" />
        <span>WhatsApp</span>
      </a>
    </div>
  );
}
