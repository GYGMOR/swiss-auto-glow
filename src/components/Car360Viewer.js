'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const VIEWS = [
  {
    id: 'side',
    label: 'Seite',
    shortLabel: '01',
    image: '/hero_car.png',
    desc: 'Seitenansicht',
    detail: 'Keramikversiegelung & Lackschutz',
  },
  {
    id: 'front',
    label: 'Front',
    shortLabel: '02',
    image: '/car_front.png',
    desc: 'Frontansicht',
    detail: 'Kühlergrill & Scheinwerfer-Detail',
  },
  {
    id: 'rear',
    label: 'Heck',
    shortLabel: '03',
    image: '/car_rear.png',
    desc: 'Heckansicht',
    detail: 'Auspuffanlage & Diffusor-Finish',
  },
  {
    id: 'interior',
    label: 'Innen',
    shortLabel: '04',
    image: '/car_interior.png',
    desc: 'Innenraum',
    detail: 'Leder, Carbon & Ambientebeleuchtung',
  },
];

export default function Car360Viewer() {
  const sectionRef = useRef(null);
  const [activeView, setActiveView] = useState(0);
  const [prevView, setPrevView] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const autoplayRef = useRef(null);

  // Intersection Observer
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setIsVisible(e.isIntersecting),
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Autoplay: cycle through views every 4s when visible
  useEffect(() => {
    if (!autoplay || !isVisible) {
      clearInterval(autoplayRef.current);
      return;
    }
    autoplayRef.current = setInterval(() => {
      setActiveView((prev) => (prev + 1) % VIEWS.length);
    }, 4000);
    return () => clearInterval(autoplayRef.current);
  }, [autoplay, isVisible]);

  const switchView = useCallback((index) => {
    if (isTransitioning || index === activeView) return;
    setAutoplay(false);
    setIsTransitioning(true);
    setPrevView(activeView);
    setTimeout(() => {
      setActiveView(index);
      setIsTransitioning(false);
      setPrevView(null);
    }, 400);
  }, [isTransitioning, activeView]);

  const view = VIEWS[activeView];

  return (
    <section id="showroom" ref={sectionRef} className="showroom-section">
      {/* Full-bleed background */}
      <div className="showroom-bg">
        <div className="bg-gradient" />
        <div className="bg-grid" />
        <div className="spotlight spotlight-1" />
        <div className="spotlight spotlight-2" />
      </div>

      {/* Top label */}
      <div className={`showroom-top ${isVisible ? 'visible' : ''}`}>
        <div className="top-line" />
        <span className="top-label">Premium Showroom</span>
        <div className="top-line" />
      </div>

      {/* Main layout */}
      <div className="showroom-layout">

        {/* Left — View Selector (vertical) */}
        <nav className="view-nav" aria-label="Fahrzeugansicht wählen">
          {VIEWS.map((v, i) => (
            <button
              key={v.id}
              className={`view-nav-btn ${i === activeView ? 'active' : ''}`}
              onClick={() => switchView(i)}
              aria-pressed={i === activeView}
            >
              <span className="vnb-num">{v.shortLabel}</span>
              <div className="vnb-content">
                <span className="vnb-label">{v.label}</span>
                <span className="vnb-detail">{v.detail}</span>
              </div>
              <div className="vnb-bar" />
            </button>
          ))}

          {/* Autoplay indicator */}
          <button
            className={`autoplay-btn ${autoplay ? 'on' : 'off'}`}
            onClick={() => setAutoplay(!autoplay)}
            title={autoplay ? 'Autoplay stoppen' : 'Autoplay starten'}
          >
            {autoplay ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            )}
            <span>{autoplay ? 'Auto' : 'Manuell'}</span>
          </button>
        </nav>

        {/* Center — Car Stage */}
        <div className="car-stage">
          {/* Progress bar (autoplay) */}
          {autoplay && (
            <div className="progress-bar" key={activeView}>
              <div className="progress-fill" />
            </div>
          )}

          {/* Image display */}
          <div className={`car-frame ${isTransitioning ? 'transitioning' : 'visible'}`}>
            {/* Previous image (fade out) */}
            {prevView !== null && (
              <img
                key={`prev-${prevView}`}
                src={VIEWS[prevView].image}
                alt=""
                className="car-img car-img-out"
                aria-hidden="true"
              />
            )}
            {/* Current image (fade in) */}
            <img
              key={`cur-${activeView}`}
              src={view.image}
              alt={view.desc}
              className="car-img car-img-in"
            />
            {/* Reflection */}
            <div className="car-reflection">
              <img src={view.image} alt="" className="reflection-img" aria-hidden="true" />
            </div>

            {/* Ground spotlight */}
            <div className="ground-spot" />
          </div>

          {/* Bottom info bar */}
          <div className={`car-info-bar ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
            <div className="cib-left">
              <span className="cib-num">{view.shortLabel} / {VIEWS.length.toString().padStart(2, '0')}</span>
              <span className="cib-divider">|</span>
              <span className="cib-desc">{view.desc}</span>
            </div>
            <span className="cib-detail">{view.detail}</span>
          </div>

          {/* Arrow controls */}
          <button
            className="arrow-btn arrow-prev"
            onClick={() => switchView((activeView - 1 + VIEWS.length) % VIEWS.length)}
            aria-label="Vorherige Ansicht"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button
            className="arrow-btn arrow-next"
            onClick={() => switchView((activeView + 1) % VIEWS.length)}
            aria-label="Nächste Ansicht"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>

          {/* Dot navigation */}
          <div className="dot-nav" role="tablist">
            {VIEWS.map((v, i) => (
              <button
                key={v.id}
                className={`dot ${i === activeView ? 'active' : ''}`}
                onClick={() => switchView(i)}
                role="tab"
                aria-selected={i === activeView}
                aria-label={v.label}
              />
            ))}
          </div>
        </div>

        {/* Right — Headline & CTA */}
        <div className={`showroom-right ${isVisible ? 'visible' : ''}`}>
          <h2 className="showroom-heading">
            DAS FAHRZEUG<br />
            <span className="heading-gold">IN PERFEKTION</span>
          </h2>
          <p className="showroom-body">
            Entdecken Sie jede Perspektive unserer Arbeit — von der makellosen Lackschicht über den detailgereinigten Innenraum bis zu veredelten Felgen.
          </p>
          <div className="showroom-divider" />
          <div className="showroom-specs">
            {[
              { label: 'Oberflächen', value: 'Keramikversiegelt' },
              { label: 'Leder', value: 'Aufbereitet & Versiegelt' },
              { label: 'Felgen', value: 'Tiefengereinigt' },
            ].map((s) => (
              <div key={s.label} className="spec-row">
                <span className="spec-label">{s.label}</span>
                <span className="spec-value">{s.value}</span>
              </div>
            ))}
          </div>
          <a href="#anfrage" className="btn-premium showroom-cta">
            Anfrage stellen
          </a>
        </div>
      </div>

      <style jsx>{`
        /* ── Section ──────────────────────────────────── */
        .showroom-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 6rem 0 4rem 0;
          overflow: hidden;
        }

        /* ── Background ───────────────────────────────── */
        .showroom-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }
        .bg-gradient {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(to bottom, var(--bg-primary) 0%, #070709 50%, var(--bg-primary) 100%);
        }
        .bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(197,168,128,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(197,168,128,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 0%, transparent 100%);
        }
        .spotlight {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
        .spotlight-1 {
          width: 500px;
          height: 500px;
          top: -100px;
          left: 25%;
          background: radial-gradient(circle, rgba(197,168,128,0.07) 0%, transparent 70%);
        }
        .spotlight-2 {
          width: 400px;
          height: 400px;
          bottom: 0;
          right: 15%;
          background: radial-gradient(circle, rgba(197,168,128,0.04) 0%, transparent 70%);
        }

        /* ── Top label ────────────────────────────────── */
        .showroom-top {
          position: relative;
          z-index: 5;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          justify-content: center;
          margin-bottom: 3.5rem;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .showroom-top.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .top-line {
          flex: 1;
          max-width: 180px;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(197,168,128,0.3));
        }
        .top-line:last-child {
          background: linear-gradient(to left, transparent, rgba(197,168,128,0.3));
        }
        .top-label {
          font-family: var(--font-sans);
          font-size: 0.72rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--accent-gold);
          white-space: nowrap;
        }

        /* ── Layout ───────────────────────────────────── */
        .showroom-layout {
          position: relative;
          z-index: 5;
          display: grid;
          grid-template-columns: 220px 1fr 280px;
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          width: 100%;
          align-items: center;
        }

        @media (max-width: 1200px) {
          .showroom-layout {
            grid-template-columns: 180px 1fr 240px;
          }
        }

        @media (max-width: 960px) {
          .showroom-layout {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto auto;
          }
          .view-nav { 
            flex-direction: row !important;
            overflow-x: auto;
            padding-bottom: 0.5rem;
          }
          .view-nav-btn {
            flex-direction: column !important;
            min-width: 90px;
            flex-shrink: 0;
          }
          .vnb-detail { display: none !important; }
          .showroom-right { text-align: center; align-items: center; }
          .spec-row { justify-content: center; }
        }

        /* ── View Nav (left column) ───────────────────── */
        .view-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .view-nav-btn {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.2rem;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 10px;
          cursor: pointer;
          text-align: left;
          position: relative;
          overflow: hidden;
          transition: background 0.25s ease, border-color 0.25s ease;
        }
        .view-nav-btn:hover {
          background: rgba(255,255,255,0.03);
          border-color: rgba(197,168,128,0.15);
        }
        .view-nav-btn.active {
          background: rgba(197,168,128,0.06);
          border-color: rgba(197,168,128,0.25);
        }
        .vnb-num {
          font-family: var(--font-serif);
          font-size: 1rem;
          color: rgba(197,168,128,0.5);
          flex-shrink: 0;
          min-width: 24px;
          transition: color 0.25s ease;
        }
        .view-nav-btn.active .vnb-num {
          color: var(--accent-gold);
        }
        .vnb-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }
        .vnb-label {
          font-family: var(--font-sans);
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          transition: color 0.25s ease;
        }
        .view-nav-btn.active .vnb-label {
          color: #ffffff;
        }
        .vnb-detail {
          font-family: var(--font-sans);
          font-size: 0.68rem;
          color: rgba(255,255,255,0.2);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .vnb-bar {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--accent-gold);
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .view-nav-btn.active .vnb-bar {
          opacity: 1;
        }

        /* Autoplay button */
        .autoplay-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
          padding: 0.6rem 1rem;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px;
          cursor: pointer;
          font-family: var(--font-sans);
          font-size: 0.68rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          transition: all 0.25s ease;
        }
        .autoplay-btn.on {
          color: var(--accent-gold);
          border-color: rgba(197,168,128,0.2);
        }
        .autoplay-btn.off {
          color: rgba(255,255,255,0.25);
        }
        .autoplay-btn:hover {
          background: rgba(255,255,255,0.03);
        }

        /* ── Car Stage (center column) ────────────────── */
        .car-stage {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Progress bar */
        .progress-bar {
          width: 100%;
          height: 1px;
          background: rgba(255,255,255,0.05);
          margin-bottom: 1.5rem;
          border-radius: 1px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: var(--accent-gold);
          animation: progress 4s linear forwards;
          box-shadow: 0 0 8px rgba(197,168,128,0.5);
        }
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }

        /* Car Frame */
        .car-frame {
          position: relative;
          width: 100%;
          max-width: 700px;
          transition: opacity 0.4s ease;
        }
        .car-frame.transitioning { opacity: 0.3; }
        .car-frame.visible { opacity: 1; }

        .car-img {
          position: relative;
          width: 100%;
          height: 420px;
          object-fit: contain;
          display: block;
          filter: drop-shadow(0 40px 80px rgba(0,0,0,0.9));
          z-index: 2;
        }
        .car-img-in {
          animation: car-fade-in 0.5s ease forwards;
        }
        .car-img-out {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          animation: car-fade-out 0.4s ease forwards;
          z-index: 1;
        }
        @keyframes car-fade-in {
          from { opacity: 0; transform: scale(0.97) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes car-fade-out {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0; transform: scale(1.02); }
        }

        /* Reflection */
        .car-reflection {
          position: absolute;
          bottom: -60px;
          left: 0;
          right: 0;
          height: 80px;
          overflow: hidden;
          pointer-events: none;
          z-index: 1;
        }
        .reflection-img {
          width: 100%;
          height: 420px;
          object-fit: contain;
          transform: scaleY(-1) translateY(-340px);
          opacity: 0.07;
          filter: blur(2px);
          mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
        }

        /* Ground spotlight */
        .ground-spot {
          position: absolute;
          bottom: -40px;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 40px;
          background: radial-gradient(ellipse, rgba(197,168,128,0.12) 0%, transparent 70%);
          pointer-events: none;
          filter: blur(8px);
        }

        /* Info bar */
        .car-info-bar {
          width: 100%;
          max-width: 700px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.2rem 0;
          border-top: 1px solid rgba(255,255,255,0.05);
          margin-top: 2rem;
          transition: opacity 0.3s ease;
        }
        .car-info-bar.fade-out { opacity: 0; }
        .car-info-bar.fade-in { opacity: 1; }
        .cib-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .cib-num {
          font-family: var(--font-serif);
          font-size: 0.75rem;
          color: var(--accent-gold);
          letter-spacing: 0.1em;
        }
        .cib-divider {
          color: rgba(255,255,255,0.1);
          font-size: 0.9rem;
        }
        .cib-desc {
          font-family: var(--font-sans);
          font-size: 0.78rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }
        .cib-detail {
          font-family: var(--font-sans);
          font-size: 0.75rem;
          color: rgba(255,255,255,0.3);
        }

        /* Arrow buttons */
        .arrow-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(10,10,12,0.8);
          border: 1px solid rgba(197,168,128,0.15);
          color: rgba(255,255,255,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all 0.25s ease;
          backdrop-filter: blur(8px);
        }
        .arrow-btn:hover {
          background: rgba(197,168,128,0.1);
          border-color: rgba(197,168,128,0.4);
          color: var(--accent-gold);
        }
        .arrow-prev { left: -22px; }
        .arrow-next { right: -22px; }

        /* Dot nav */
        .dot-nav {
          display: flex;
          gap: 8px;
          margin-top: 1.5rem;
        }
        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.15);
          cursor: pointer;
          transition: all 0.25s ease;
          padding: 0;
        }
        .dot.active {
          background: var(--accent-gold);
          width: 24px;
          border-radius: 3px;
          box-shadow: 0 0 8px rgba(197,168,128,0.4);
        }

        /* ── Right column ─────────────────────────────── */
        .showroom-right {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          opacity: 0;
          transform: translateX(20px);
          transition: opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s;
        }
        .showroom-right.visible {
          opacity: 1;
          transform: translateX(0);
        }
        .showroom-heading {
          font-family: var(--font-serif);
          font-size: 2rem;
          color: #ffffff;
          line-height: 1.2;
          letter-spacing: 0.05em;
        }
        .heading-gold { color: var(--accent-gold); }
        .showroom-body {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.4);
          line-height: 1.75;
        }
        .showroom-divider {
          width: 48px;
          height: 1px;
          background: var(--accent-gold);
          opacity: 0.4;
        }
        .showroom-specs {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }
        .spec-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          padding-bottom: 0.8rem;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .spec-row:last-child { border-bottom: none; }
        .spec-label {
          font-family: var(--font-sans);
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
        }
        .spec-value {
          font-family: var(--font-sans);
          font-size: 0.78rem;
          color: var(--accent-gold);
          text-align: right;
        }
        .showroom-cta {
          align-self: flex-start;
          font-size: 0.75rem;
          padding: 0.85rem 1.6rem;
          letter-spacing: 0.15em;
          color: #ffffff !important;
          text-decoration: none !important;
        }

        @media (max-width: 960px) {
          .showroom-cta { align-self: center; }
          .showroom-divider { align-self: center; }
          .showroom-specs { width: 100%; max-width: 400px; }
        }

        @media (max-width: 768px) {
          .car-img { height: 280px; }
          .arrow-prev { left: 4px; }
          .arrow-next { right: 4px; }
          .showroom-heading { font-size: 1.6rem; }
          .cib-detail { display: none; }
        }
      `}</style>
    </section>
  );
}
