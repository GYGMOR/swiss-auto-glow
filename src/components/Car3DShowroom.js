'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { HOTSPOT_DEFS } from '@/components/Car3DScene';
import { DEFAULT_CONTENT } from '@/lib/content-defaults';

/* ─────────────────────────────────────────────────────────
   CAR DATA – 4 models + their hotspots
───────────────────────────────────────────────────────── */
const CARS = [
  {
    id: 'porsche',
    name: 'Porsche GT3 RS',
    label: 'GT3 RS',
    brand: 'Porsche',
    file: '/glb/porsche_gt3_rs.glb',
    color: '#d4a843',
    scale: 2.2,
    yOffset: -0.55,
  },
  {
    id: 'audi',
    name: 'Audi RS5',
    label: 'RS 5',
    brand: 'Audi',
    file: '/glb/audi_rs5.glb',
    color: '#c5a880',
    scale: 1.9,
    yOffset: -0.55,
  },
  {
    id: 'cupra',
    name: 'Cupra Formentor',
    label: 'Formentor',
    brand: 'Cupra',
    file: '/glb/cupra_formentor.glb',
    color: '#b87333',
    scale: 1.85,
    yOffset: -0.55,
  },
  {
    id: 'ferrari',
    name: 'Ferrari LaFerrari',
    label: 'LaFerrari',
    brand: 'Ferrari',
    file: '/glb/ferrari_laferrari__www.vecarz.com.glb',
    color: '#e63946',
    scale: 2.0,
    yOffset: -0.45,
  },
];


/* ─────────────────────────────────────────────────────────
   DYNAMIC IMPORT – model-viewer web component (client-only)
───────────────────────────────────────────────────────── */
const CarScene = dynamic(() => import('@/components/Car3DScene'), {
  ssr: false,
  loading: () => (
    <div className="mv-fallback">
      <div className="mv-fallback-ring" />
    </div>
  ),
});

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────── */
function mergeHotspots(defs, cmsHotspots) {
  const map = {};
  (cmsHotspots || []).forEach(h => { map[h.id] = h; });
  return defs.map(def => ({ ...def, ...(map[def.id] || {}) }));
}

export default function Car3DShowroom() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeCarIdx, setActiveCarIdx] = useState(0);
  const [prevCarIdx, setPrevCarIdx] = useState(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [showroomContent, setShowroomContent] = useState(DEFAULT_CONTENT.showroom);

  useEffect(() => {
    fetch('/api/content').then(r => r.json()).then(d => {
      if (d?.showroom) setShowroomContent(d.showroom);
    }).catch(() => {});
  }, []);

  const hotspots = mergeHotspots(HOTSPOT_DEFS, showroomContent.hotspots);

  // Intersection observer for entrance animation
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setIsVisible(e.isIntersecting),
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const switchCar = useCallback(
    (idx) => {
      if (isSwitching || idx === activeCarIdx) return;
      setIsSwitching(true);
      setPrevCarIdx(activeCarIdx);
      setActiveHotspot(null);
      setTimeout(() => {
        setActiveCarIdx(idx);
        setIsSwitching(false);
        setPrevCarIdx(null);
      }, 500);
    },
    [isSwitching, activeCarIdx]
  );

  const handleHotspotClick = useCallback((hotspot) => {
    setActiveHotspot(hotspot);
  }, []);

  const car = CARS[activeCarIdx];

  return (
    <section id="showroom" ref={sectionRef} className="showroom3d-section">
      {/* Background */}
      <div className="s3d-bg">
        <div className="s3d-bg-gradient" />
        <div className="s3d-bg-grid" />
        <div className="s3d-spotlight s3d-sp1" />
        <div className="s3d-spotlight s3d-sp2" />
      </div>

      {/* Section header */}
      <div className={`s3d-header ${isVisible ? 'visible' : ''}`}>
        <div className="s3d-top-line" />
        <span className="s3d-top-label">{showroomContent.header}</span>
        <div className="s3d-top-line" />
      </div>

      {/* Main content */}
      <div className="s3d-main">
        {/* Car Selector */}
        <div className={`car-selector ${isVisible ? 'visible' : ''}`}>
          {CARS.map((c, i) => (
            <button
              key={c.id}
              className={`car-sel-btn ${i === activeCarIdx ? 'active' : ''} ${isSwitching && i === activeCarIdx ? 'loading' : ''}`}
              onClick={() => switchCar(i)}
              style={{ '--car-color': c.color }}
            >
              <span className="car-sel-brand">{c.brand}</span>
              <span className="car-sel-model">{c.label}</span>
              <div className="car-sel-indicator" />
            </button>
          ))}
        </div>

        {/* Canvas + Hotspots */}
        <div className={`canvas-wrapper ${isSwitching ? 'switching' : ''}`}>
          {/* 3D Scene with built-in hotspots */}
          <CarScene
            carFile={car.file}
            onHotspotClick={handleHotspotClick}
            activeHotspotId={activeHotspot?.id}
            hotspots={hotspots}
          />

          {/* Ground reflection line */}
          <div className="ground-line" />

          {/* Car name overlay */}
          <div className={`car-name-overlay ${isSwitching ? 'fade-out' : 'fade-in'}`}>
            <span className="cno-brand">{car.brand}</span>
            <span className="cno-model">{car.name.replace(car.brand + ' ', '')}</span>
          </div>
        </div>

        {/* Info Panel */}
        <div className={`s3d-info-panel ${isVisible ? 'visible' : ''}`}>
          <h2 className="s3d-heading">
            {showroomContent.heading}<br />
            <span className="s3d-heading-gold">{showroomContent.heading_gold}</span>
          </h2>
          <p className="s3d-body">{showroomContent.body}</p>
          <div className="s3d-divider" />

          {/* Active Hotspot Info */}
          {activeHotspot ? (
            <div className="hotspot-info-card" key={activeHotspot.id}>
              <div className="hic-header">
                <span className="hic-icon">{activeHotspot.icon}</span>
                <div>
                  <div className="hic-tag">{activeHotspot.tag}</div>
                  <div className="hic-title">{activeHotspot.title}</div>
                </div>
                <button className="hic-close" onClick={() => setActiveHotspot(null)}>✕</button>
              </div>
              <p className="hic-desc">{activeHotspot.description}</p>
            </div>
          ) : (
            <div className="hotspot-hint">
              <div className="hint-dots">
                {hotspots.map((hs) => (
                  <div
                    key={hs.id}
                    className="hint-dot-item"
                    onClick={() => setActiveHotspot(hs)}
                  >
                    <span className="hdi-icon">{hs.icon}</span>
                    <span className="hdi-label">{hs.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <a href="#anfrage" className="btn-premium s3d-cta">
            Anfrage stellen
          </a>
        </div>
      </div>

      <style jsx>{`
        /* ── Section ──────────────────────────────────────────── */
        .showroom3d-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 5rem 0 4rem 0;
          overflow: hidden;
        }

        /* ── Background ───────────────────────────────────────── */
        .s3d-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }
        .s3d-bg-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, var(--bg-primary) 0%, #060608 50%, var(--bg-primary) 100%);
        }
        .s3d-bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(197,168,128,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(197,168,128,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 0%, transparent 100%);
        }
        .s3d-spotlight {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
        }
        .s3d-sp1 {
          width: 600px;
          height: 600px;
          top: -150px;
          left: 20%;
          background: radial-gradient(circle, rgba(197,168,128,0.06) 0%, transparent 70%);
        }
        .s3d-sp2 {
          width: 400px;
          height: 400px;
          bottom: 0;
          right: 10%;
          background: radial-gradient(circle, rgba(197,168,128,0.04) 0%, transparent 70%);
        }

        /* ── Header ───────────────────────────────────────────── */
        .s3d-header {
          position: relative;
          z-index: 5;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          justify-content: center;
          margin-bottom: 2.5rem;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .s3d-header.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .s3d-top-line {
          flex: 1;
          max-width: 200px;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(197,168,128,0.3));
        }
        .s3d-top-line:last-child {
          background: linear-gradient(to left, transparent, rgba(197,168,128,0.3));
        }
        .s3d-top-label {
          font-family: var(--font-sans);
          font-size: 0.72rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--accent-gold);
          white-space: nowrap;
        }

        /* ── Main layout ──────────────────────────────────────── */
        .s3d-main {
          position: relative;
          z-index: 5;
          display: grid;
          grid-template-columns: 200px 1fr 300px;
          gap: 2rem;
          max-width: 1500px;
          margin: 0 auto;
          padding: 0 2rem;
          width: 100%;
          align-items: center;
          min-height: 600px;
        }

        /* ── Car Selector ─────────────────────────────────────── */
        .car-selector {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          opacity: 0;
          transform: translateX(-20px);
          transition: opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s;
        }
        .car-selector.visible {
          opacity: 1;
          transform: translateX(0);
        }
        .car-sel-btn {
          display: flex;
          flex-direction: column;
          padding: 1rem 1.2rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 10px;
          cursor: pointer;
          text-align: left;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .car-sel-btn:hover {
          background: rgba(255,255,255,0.04);
          border-color: rgba(197,168,128,0.2);
        }
        .car-sel-btn.active {
          background: rgba(197,168,128,0.06);
          border-color: var(--car-color, var(--accent-gold));
          box-shadow: 0 0 20px rgba(197,168,128,0.08);
        }
        .car-sel-brand {
          font-family: var(--font-sans);
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-bottom: 2px;
          transition: color 0.3s ease;
        }
        .car-sel-btn.active .car-sel-brand {
          color: var(--car-color, var(--accent-gold));
        }
        .car-sel-model {
          font-family: var(--font-serif);
          font-size: 0.95rem;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.05em;
          transition: color 0.3s ease;
        }
        .car-sel-btn.active .car-sel-model {
          color: #ffffff;
        }
        .car-sel-indicator {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: var(--car-color, var(--accent-gold));
          opacity: 0;
          border-radius: 0 2px 2px 0;
          transition: opacity 0.3s ease;
        }
        .car-sel-btn.active .car-sel-indicator {
          opacity: 1;
        }

        /* ── Canvas Wrapper ───────────────────────────────────── */
        .canvas-wrapper {
          position: relative;
          height: 560px;
          border-radius: 20px;
          overflow: hidden;
          background-color: #07070a;
          background-image: radial-gradient(ellipse at 50% 60%, rgba(197,168,128,0.05) 0%, transparent 70%);
          border: 1px solid rgba(197,168,128,0.1);
          transition: opacity 0.5s ease;
        }
        .canvas-wrapper.switching {
          opacity: 0.3;
        }

        /* Ground line */
        .ground-line {
          position: absolute;
          bottom: 80px;
          left: 10%;
          right: 10%;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(197,168,128,0.15) 30%, rgba(197,168,128,0.3) 50%, rgba(197,168,128,0.15) 70%, transparent);
          pointer-events: none;
          z-index: 3;
        }

        /* Car name overlay */
        .car-name-overlay {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          z-index: 10;
          pointer-events: none;
          transition: opacity 0.4s ease;
        }
        .car-name-overlay.fade-out { opacity: 0; }
        .car-name-overlay.fade-in { opacity: 1; }
        .cno-brand {
          font-family: var(--font-sans);
          font-size: 0.6rem;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: var(--accent-gold);
          opacity: 0.7;
        }
        .cno-model {
          font-family: var(--font-serif);
          font-size: 1.1rem;
          color: rgba(255,255,255,0.6);
          letter-spacing: 0.1em;
        }


        /* ── model-viewer hotspot styles are in Car3DScene.js ─── */


        /* ── Loading state ────────────────────────────────────── */
        :global(.mv-fallback) {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
        }
        :global(.mv-fallback-ring) {
          width: 44px;
          height: 44px;
          border: 2px solid rgba(197,168,128,0.12);
          border-top-color: var(--accent-gold);
          border-radius: 50%;
          animation: mvFallbackSpin 1s linear infinite;
        }
        @keyframes mvFallbackSpin {
          to { transform: rotate(360deg); }
        }

        /* ── Info Panel ───────────────────────────────────────── */
        .s3d-info-panel {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          opacity: 0;
          transform: translateX(20px);
          transition: opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s;
        }
        .s3d-info-panel.visible {
          opacity: 1;
          transform: translateX(0);
        }
        .s3d-heading {
          font-family: var(--font-serif);
          font-size: 1.8rem;
          color: #ffffff;
          line-height: 1.2;
          letter-spacing: 0.05em;
        }
        .s3d-heading-gold { color: var(--accent-gold); }
        .s3d-body {
          font-size: 0.88rem;
          color: rgba(255,255,255,0.35);
          line-height: 1.75;
        }
        .s3d-divider {
          width: 40px;
          height: 1px;
          background: var(--accent-gold);
          opacity: 0.4;
        }

        /* Hotspot hint (when none active) */
        .hotspot-hint {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 10px;
          padding: 1rem;
        }
        .hint-dots {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .hint-dot-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0.6rem;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .hint-dot-item:hover {
          background: rgba(197,168,128,0.06);
        }
        .hdi-icon {
          color: var(--accent-gold);
          font-size: 0.9rem;
          width: 20px;
          text-align: center;
          flex-shrink: 0;
        }
        .hdi-label {
          font-family: var(--font-sans);
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
        }

        /* Hotspot Info Card */
        .hotspot-info-card {
          background: rgba(197,168,128,0.04);
          border: 1px solid rgba(197,168,128,0.2);
          border-radius: 12px;
          padding: 1.2rem;
          animation: cardIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hic-header {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin-bottom: 0.85rem;
        }
        .hic-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: rgba(197,168,128,0.1);
          border: 1px solid rgba(197,168,128,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-gold);
          font-size: 1rem;
          flex-shrink: 0;
        }
        .hic-tag {
          font-family: var(--font-sans);
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--accent-gold);
          margin-bottom: 3px;
          opacity: 0.8;
        }
        .hic-title {
          font-family: var(--font-serif);
          font-size: 0.95rem;
          color: #ffffff;
          letter-spacing: 0.03em;
        }
        .hic-close {
          margin-left: auto;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.3);
          cursor: pointer;
          font-size: 0.7rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .hic-close:hover {
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.7);
        }
        .hic-desc {
          font-family: var(--font-sans);
          font-size: 0.82rem;
          line-height: 1.7;
          color: rgba(255,255,255,0.5);
        }

        .s3d-cta {
          align-self: flex-start;
          font-size: 0.75rem;
          padding: 0.85rem 1.6rem;
          letter-spacing: 0.15em;
          color: #ffffff !important;
          text-decoration: none !important;
        }

        /* ── Responsive ───────────────────────────────────────── */
        @media (max-width: 1200px) {
          .s3d-main {
            grid-template-columns: 170px 1fr 260px;
          }
        }

        @media (max-width: 960px) {
          .s3d-main {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto auto;
            min-height: unset;
          }
          .car-selector {
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: 0.5rem;
            gap: 0.5rem;
          }
          .car-sel-btn {
            min-width: 120px;
            flex-shrink: 0;
          }
          .canvas-wrapper {
            height: 420px;
          }
          .s3d-info-panel {
            text-align: center;
            align-items: center;
          }
          .s3d-cta { align-self: center; }
          .hint-dots {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
          }
        }

        @media (max-width: 600px) {
          .canvas-wrapper { height: 320px; }
          .s3d-heading { font-size: 1.5rem; }
          .hotspot-dot { width: 30px; height: 30px; font-size: 0.7rem; }
        }
      `}</style>
    </section>
  );
}
