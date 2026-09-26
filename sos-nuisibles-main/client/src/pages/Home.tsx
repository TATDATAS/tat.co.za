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
  Clock3,
  Crosshair,
  Menu,
  MessageCircle,
  MousePointer2,
  PhoneCall,
  Rat,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const whatsappUrl =
  "https://wa.me/33678785877?text=Bonjour%20SOS%20NUISIBLES%2C%20j%27ai%20besoin%20d%27une%20intervention.";

const services = [
  {
    number: "01",
    icon: Rat,
    title: "Rongeurs",
    text: "Souris, rats et traces de passage : on cible le foyer, pas seulement le symptôme.",
  },
  {
    number: "02",
    icon: Bug,
    title: "Insectes",
    text: "Blattes, fourmis, punaises et autres intrus : une réponse adaptée à votre espace.",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Nids & volants",
    text: "Guêpes, frelons et nids gênants : une intervention guidée, sans prise de risque inutile.",
  },
];

const assurances = [
  "Une demande simple par message",
  "Une réponse orientée solution",
  "Des conseils clairs pour la suite",
];

const userSlides = [
  "/manus-storage/01_d1f858a9.png",
  "/manus-storage/02_c8533a18.png",
  "/manus-storage/03_b425ef04.png",
  "/manus-storage/04_0a3614aa.png",
  "/manus-storage/05_fda39b18.png",
  "/manus-storage/06_850fee48.png",
  "/manus-storage/07_f79179f5.png",
  "/manus-storage/08_0eed2efc.png",
  "/manus-storage/09_bea625e3.png",
  "/manus-storage/10_6afda52f.png",
  "/manus-storage/11_4a84e0be.png",
  "/manus-storage/12_7ff89c30.png",
  "/manus-storage/13_d72ca23c.png",
  "/manus-storage/14_45145d7c.png",
  "/manus-storage/15_7ee07301.png",
  "/manus-storage/16_49cb5f87.png",
  "/manus-storage/17_6dee5e14.png",
  "/manus-storage/18_cdd8f261.png",
  "/manus-storage/19_a0b6f57e.png",
  "/manus-storage/20_90225349.png",
  "/manus-storage/21_d873f528.png",
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % userSlides.length);
    }, 10000);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  const closeMenu = () => setMenuOpen(false);
  const previousSlide = () => setActiveSlide((current) => (current - 1 + userSlides.length) % userSlides.length);
  const nextSlide = () => setActiveSlide((current) => (current + 1) % userSlides.length);

  return (
    <div className="site-shell overflow-x-clip bg-[#07172b] text-[#fff7e9]">
      <header className="site-header">
        <a className="brand" href="#accueil" aria-label="SOS NUISIBLES — accueil">
          <img
            src="/manus-storage/sos-nuisibles-badge_f2d65642.png"
            alt=""
            className="brand-mark"
          />
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

        <a
          className="header-contact"
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
        >
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
              {userSlides.map((src, index) => (
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
                Une présence qui s’installe ? Envoyez-nous un message. SOS NUISIBLES
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
              <div className="signal-topline"><Crosshair size={17} /> SIGNAL REÇU</div>
              <p>Un message, une intervention.</p>
              <span>RÉPONSE PAR WHATSAPP</span>
              <div className="signal-line" />
              <small>† NUISIBLES : SORTIE DE ZONE</small>
            </aside>
          </div>
          <div className="hero-corner-note">SOS / 24 H</div>
          <div className="hero-index" aria-hidden="true"><i /> <span>{String(activeSlide + 1).padStart(2, "0")} / {String(userSlides.length).padStart(2, "0")}</span></div>
          <div className="hero-slideshow-controls" aria-label="Contrôles du slideshow">
            <button type="button" onClick={previousSlide} aria-label="Image précédente">←</button>
            <div className="hero-dots">
              {userSlides.map((src, index) => (
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
            <span>RONgeurs</span><CircleDot />
            <span>INSECTES</span><CircleDot />
            <span>NIDS</span><CircleDot />
            <span>RONgeurs</span><CircleDot />
            <span>INSECTES</span><CircleDot />
            <span>NIDS</span><CircleDot />
          </div>
        </section>

        <section className="services-section" id="services" aria-labelledby="services-title">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow dark-eyebrow"><span /> LES MISSIONS</p>
              <h2 id="services-title">CHAQUE INTRUS<br /><em>A SA SORTIE.</em></h2>
            </div>
            <p className="heading-note">Décrivez ce que vous observez. Nous vous orientons vers l’intervention la plus juste.</p>
          </div>

          <div className="service-layout">
            <div className="service-visual" role="img" aria-label="Illustration stylisée d’intervention contre les nuisibles" />
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
              <p className="method-lead">Pas besoin de passer par dix écrans : racontez-nous votre situation sur WhatsApp et faites le premier pas vers une solution.</p>
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
          <div className="contact-image" aria-hidden="true" />
          <div className="contact-overlay" />
          <div className="contact-content">
            <p className="eyebrow"><span /> LE SIGNAL EST ICI</p>
            <h2 id="contact-title">UNE PRÉSENCE<br />VOUS GÊNE ?<br /><em>ON PASSE À L’ACTION.</em></h2>
            <p>Expliquez-nous ce qui se passe. Le premier message suffit pour démarrer.</p>
            <a className="primary-action large-action" href={whatsappUrl} target="_blank" rel="noreferrer">
              <MessageCircle size={21} fill="currentColor" />
              CONTACT WHATSAPP
              <ArrowUpRight size={20} />
            </a>
          </div>
          <div className="contact-caption"><PhoneCall size={16} /> CONTACT DIRECT / SANS FORMULAIRE</div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#accueil" aria-label="Retour en haut">
          <img src="/manus-storage/sos-nuisibles-badge_f2d65642.png" alt="" className="brand-mark" />
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
