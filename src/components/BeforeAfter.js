'use client';

import { useState, useRef, useEffect } from 'react';

export default function BeforeAfter() {
  const [sliderPos, setSliderPos] = useState(35); // start at 35% so AFTER is more visible
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let percentage = ((clientX - rect.left) / rect.width) * 100;
    percentage = Math.max(2, Math.min(98, percentage));
    setSliderPos(percentage);
    setHasInteracted(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    if (e.touches.length > 0) handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  useEffect(() => {
    const up = () => setIsDragging(false);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchend', up);
    return () => {
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchend', up);
    };
  }, []);

  return (
    <div className="slider-wrapper">
      {/* Header */}
      <div className="slider-header scroll-animate">
        <span className="slider-eyebrow">Vorher — Nachher</span>
        <h2 className="slider-title">
          Die <span className="highlight-word">Transformation</span> spricht für sich
        </h2>
        <p className="slider-desc">
          Von stark verschmutztem Fahrzeug zu makellosem Showroom-Zustand. Ziehen Sie den Regler.
        </p>
      </div>

      {/* Comparison stage */}
      <div
        ref={containerRef}
        className="ba-container"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      >
        {/* AFTER — clean (background, full width) */}
        <div className="ba-panel ba-after">
          <img src="/interior_detailing.png" alt="Nachher: Professionell aufbereitetes Fahrzeug" className="ba-img" />
          <div className="ba-overlay after-overlay" />
        </div>

        {/* BEFORE — dirty (clipped overlay) */}
        <div className="ba-panel ba-before" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
          <img
            src="/car_dirty_before.png"
            alt="Vorher: Stark verschmutztes Fahrzeug"
            className="ba-img"
          />
          <div className="ba-overlay before-overlay" />
          {/* Grime vignette */}
          <div className="grime-vignette" />
        </div>

        {/* Badges */}
        <div className="ba-badge badge-before" style={{ opacity: sliderPos > 15 ? 1 : 0 }}>
          <span className="badge-dot dot-red" />
          VORHER
        </div>
        <div className="ba-badge badge-after" style={{ opacity: sliderPos < 90 ? 1 : 0 }}>
          <span className="badge-dot dot-gold" />
          NACHHER
        </div>

        {/* Drag handle */}
        <div className="ba-handle" style={{ left: `${sliderPos}%` }}>
          <div className="handle-track" />
          <div className="handle-grip">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="8 18 2 12 8 6" />
              <polyline points="16 6 22 12 16 18" />
            </svg>
          </div>
          <div className="handle-track" />
        </div>

        {/* Hint — disappears after first interaction */}
        {!hasInteracted && (
          <div className="ba-hint">
            <span>← Ziehen →</span>
          </div>
        )}
      </div>

      {/* Stats bar */}
      <div className="ba-stats scroll-animate">
        {[
          { value: '100%', label: 'Schmutzentfernung' },
          { value: '8h+', label: 'Handarbeit' },
          { value: '3-Stufen', label: 'Reinigungsprotokoll' },
          { value: '∞', label: 'Qualitätsgarantie' },
        ].map((s) => (
          <div key={s.label} className="stat-item">
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        /* ── Wrapper ──────────────────────────────────── */
        .slider-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          gap: 0;
        }

        /* ── Header ───────────────────────────────────── */
        .slider-header {
          text-align: center;
          margin-bottom: 3rem;
          max-width: 640px;
        }
        .slider-eyebrow {
          display: inline-block;
          font-family: var(--font-sans);
          font-size: 0.72rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--accent-gold);
          margin-bottom: 1rem;
        }
        .slider-title {
          font-family: var(--font-serif);
          font-size: 2.5rem;
          color: #ffffff;
          line-height: 1.2;
          margin-bottom: 1rem;
        }
        .highlight-word { color: var(--accent-gold); }
        .slider-desc {
          font-size: 1rem;
          color: rgba(255,255,255,0.45);
          line-height: 1.7;
        }

        @media (max-width: 768px) {
          .slider-title { font-size: 1.9rem; }
        }

        /* ── Comparison Container ─────────────────────── */
        .ba-container {
          position: relative;
          width: 100%;
          max-width: 1100px;
          height: 600px;
          border-radius: 16px;
          overflow: hidden;
          cursor: ew-resize;
          user-select: none;
          border: 1px solid rgba(197, 168, 128, 0.15);
          box-shadow:
            0 50px 100px rgba(0,0,0,0.9),
            0 0 0 1px rgba(255,255,255,0.03);
        }

        @media (max-width: 900px) { .ba-container { height: 440px; } }
        @media (max-width: 600px) { .ba-container { height: 320px; border-radius: 10px; } }

        /* ── Panels ───────────────────────────────────── */
        .ba-panel {
          position: absolute;
          inset: 0;
        }
        .ba-before {
          z-index: 3;
          transition: clip-path 0.02s linear;
        }
        .ba-after {
          z-index: 2;
        }

        .ba-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
        }

        /* Overlays */
        .ba-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 2;
        }
        .before-overlay {
          background: linear-gradient(
            to right,
            rgba(60, 30, 10, 0.35) 0%,
            transparent 60%
          );
        }
        .after-overlay {
          background: linear-gradient(
            to left,
            rgba(197, 168, 128, 0.06) 0%,
            transparent 60%
          );
        }

        /* Extra grime vignette on BEFORE side */
        .grime-vignette {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 30% 80%, rgba(80, 50, 20, 0.4) 0%, transparent 60%),
            radial-gradient(ellipse at 70% 20%, rgba(40, 30, 15, 0.3) 0%, transparent 50%);
          pointer-events: none;
          z-index: 3;
          mix-blend-mode: multiply;
        }

        /* ── Badges ───────────────────────────────────── */
        .ba-badge {
          position: absolute;
          top: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-sans);
          font-size: 0.68rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 0.45rem 0.9rem;
          border-radius: 4px;
          z-index: 10;
          pointer-events: none;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: opacity 0.4s ease;
        }
        .badge-before {
          left: 24px;
          background: rgba(20, 8, 4, 0.85);
          border: 1px solid rgba(200, 80, 60, 0.35);
          color: #e07060;
        }
        .badge-after {
          right: 24px;
          background: rgba(8, 7, 5, 0.85);
          border: 1px solid rgba(197, 168, 128, 0.35);
          color: var(--accent-gold);
        }
        .badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: block;
          flex-shrink: 0;
        }
        .dot-red { background: #e07060; box-shadow: 0 0 6px #e0706080; }
        .dot-gold { background: var(--accent-gold); box-shadow: 0 0 6px rgba(197,168,128,0.6); }

        /* ── Drag Handle ──────────────────────────────── */
        .ba-handle {
          position: absolute;
          top: 0;
          height: 100%;
          z-index: 20;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          pointer-events: none;
        }
        .handle-track {
          flex: 1;
          width: 2px;
          background: linear-gradient(to bottom, transparent, var(--accent-gold) 20%, var(--accent-gold) 80%, transparent);
          box-shadow: 0 0 12px rgba(197,168,128,0.6);
        }
        .handle-grip {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #0a0a0c;
          border: 2px solid var(--accent-gold);
          color: var(--accent-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow:
            0 0 20px rgba(197,168,128,0.3),
            0 8px 24px rgba(0,0,0,0.6);
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .ba-container:hover .handle-grip,
        .ba-container:active .handle-grip {
          background: var(--accent-gold);
          color: #000;
          transform: scale(1.1);
        }

        /* ── Hint ─────────────────────────────────────── */
        .ba-hint {
          position: absolute;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          font-family: var(--font-sans);
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          pointer-events: none;
          z-index: 15;
          animation: float-hint 2s ease-in-out infinite;
        }
        @keyframes float-hint {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-5px); }
        }

        /* ── Stats Bar ────────────────────────────────── */
        .ba-stats {
          display: flex;
          gap: 0;
          width: 100%;
          max-width: 1100px;
          margin-top: 1px;
          border: 1px solid rgba(197, 168, 128, 0.1);
          border-top: none;
          border-radius: 0 0 16px 16px;
          overflow: hidden;
        }
        .stat-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 1.5rem 1rem;
          background: rgba(10, 10, 12, 0.9);
          border-right: 1px solid rgba(255,255,255,0.04);
          transition: background 0.25s ease;
        }
        .stat-item:last-child { border-right: none; }
        .stat-item:hover { background: rgba(197,168,128,0.04); }
        .stat-value {
          font-family: var(--font-serif);
          font-size: 1.3rem;
          color: var(--accent-gold);
          letter-spacing: 0.05em;
        }
        .stat-label {
          font-family: var(--font-sans);
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
        }

        @media (max-width: 600px) {
          .ba-stats { flex-wrap: wrap; border-radius: 0; }
          .stat-item { min-width: 50%; border-bottom: 1px solid rgba(255,255,255,0.04); }
          .ba-hint { display: none; }
        }
      `}</style>
    </div>
  );
}
