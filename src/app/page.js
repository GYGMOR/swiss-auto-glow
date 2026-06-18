'use client';

import { useEffect, useRef, useState } from 'react';
import BeforeAfter from '@/components/BeforeAfter';
import InquiryForm from '@/components/InquiryForm';
import CookieBanner from '@/components/CookieBanner';
import Car3DShowroom from '@/components/Car3DShowroom';
import { DEFAULT_CONTENT } from '@/lib/content-defaults';

/* ── Animated counter ─────────────────────────────────────────── */
function Counter({ target, suffix = '', duration = 2000 }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(Math.floor(eased * target));
          if (progress < 1) requestAnimationFrame(tick);
          else setValue(target);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{value}{suffix}</span>;
}

const ROMAN = ['I', 'II', 'III', 'IV'];

export default function Home() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const bgVideoRef = useRef(null);
  const carVideoRef = useRef(null);

  useEffect(() => {
    fetch('/api/content').then(r => r.json()).then(d => {
      if (d && d.hero) setContent(d);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    [bgVideoRef, carVideoRef].forEach(r => {
      if (r.current) r.current.play().catch(() => {});
    });
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('animated');
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll(
      '.scroll-animate, .car-swipe-left, .car-swipe-right, .fade-up, .fade-left, .fade-right'
    ).forEach(el => obs.observe(el));

    return () => obs.disconnect();
  }, []);

  const h = content.hero;
  const ph = content.philosophy;
  const sv = content.services;
  const iq = content.inquiry;

  return (
    <div className="home-page">

      {/* ═══════════════════════════════════════════════════════════
          HERO — Fullscreen animated
      ═══════════════════════════════════════════════════════════ */}
      <section className="hero">
        <video ref={bgVideoRef} className="hero-video" autoPlay muted loop playsInline poster={h.image} aria-hidden="true">
          <source src="/hero_video.mp4" type="video/mp4"/>
        </video>
        <div className="hero-video-overlay"/>
        <div className="hero-bg-grid" />
        <div className="hero-bg-glow hero-bg-glow--1" />
        <div className="hero-bg-glow hero-bg-glow--2" />

        <div className="container hero-inner">
          {/* Text side */}
          <div className="hero-text fade-up">
            <div className="hero-eyebrow">
              <span className="hero-dot" />
              {h.eyebrow}
            </div>
            <h1 className="hero-h1">
              {h.h1_1}<br />
              {h.h1_2.split('AUTOMOBILS').length > 1
                ? <>{h.h1_2.replace('AUTOMOBILS', '')} <span className="gold">AUTOMOBILS</span></>
                : h.h1_2}<br />
              {h.h1_3}
            </h1>
            <p className="hero-sub">{h.subtitle}</p>
            <div className="hero-actions">
              <a href={h.btn1_href} className="btn-gold">{h.btn1}</a>
              <a href={h.btn2_href} className="btn-ghost">{h.btn2}</a>
            </div>
            <div className="trust-row">
              {(h.trust || []).map(t => (
                <span key={t} className="trust-pill">{t}</span>
              ))}
            </div>
          </div>

          {/* Car video */}
          <div className="hero-visual car-swipe-right">
            <div className="hero-img-wrap">
              <video
                ref={carVideoRef}
                className="hero-img"
                autoPlay
                muted
                playsInline
                poster={h.image}
                onEnded={e => { e.target.pause(); e.target.currentTime = e.target.duration; }}
              >
                <source src="/video/car.mp4" type="video/mp4" />
              </video>
              <div className="hero-img-glare" />
            </div>
            <div className="hero-badge">
              <div className="hero-badge-icon">✦</div>
              <div>
                <div className="hero-badge-val">{h.badge_val}</div>
                <div className="hero-badge-sub">{h.badge_sub}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="hero-stats-bar">
          <div className="container hero-stats-inner">
            {(h.stats || []).map(s => (
              <div key={s.label} className="hero-stat">
                <div className="hero-stat-val">
                  <Counter target={Number(s.val)} suffix={s.suffix} />
                </div>
                <div className="hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PHILOSOPHY
      ═══════════════════════════════════════════════════════════ */}
      <section id="philosophie" className="philosophy">
        <div className="phil-bg-accent" />
        <div className="container philosophy-inner">
          {/* Left decoration */}
          <div className="phil-left fade-left">
            <div className="phil-pin-wrap">
              <svg className="phil-pin" viewBox="0 0 60 80" fill="none">
                <circle cx="30" cy="26" r="20" fill="#e63946" />
                <circle cx="30" cy="26" r="10" fill="rgba(255,255,255,0.25)" />
                <circle cx="30" cy="26" r="4" fill="#fff" />
                <path d="M30 46 L30 78" stroke="#e63946" strokeWidth="3" strokeLinecap="round" />
                <ellipse cx="30" cy="79" rx="6" ry="2" fill="#e6394640" />
              </svg>
              <div className="phil-pin-ring phil-pin-ring--1" />
              <div className="phil-pin-ring phil-pin-ring--2" />
            </div>
            <div className="phil-vertical-text">UNSERE PHILOSOPHIE</div>
          </div>

          {/* Quote block */}
          <div className="phil-content fade-up">
            <div className="phil-red-line" />
            <blockquote className="phil-quote">{ph.quote}</blockquote>
            <p className="phil-body">{ph.body}</p>
            <div className="phil-signature">
              <div className="phil-sig-line" />
              <span>{ph.signature}</span>
            </div>
          </div>

          {/* Right stats */}
          <div className="phil-right fade-right">
            {(ph.stats || []).map(p => (
              <div key={p.label} className="phil-stat-card">
                <div className="phil-stat-num red"><Counter target={Number(p.n)} suffix={p.s} /></div>
                <div className="phil-stat-label">{p.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SERVICES — 4 Säulen
      ═══════════════════════════════════════════════════════════ */}
      <section id="services" className="services">
        <div className="container">
          <div className="section-header scroll-animate">
            <span className="eyebrow">{sv.eyebrow}</span>
            <h2 className="section-title">{sv.title.includes('PFLEGE')
              ? <>{sv.title.replace(' PFLEGE', '')} <span className="gold">PFLEGE</span></>
              : sv.title}
            </h2>
          </div>

          {(sv.pillars || []).map((pillar, idx) => {
            const isReverse = idx % 2 !== 0;
            return (
              <div key={idx} className={`pillar-row ${isReverse ? 'pillar-row--reverse' : 'pillar-row--normal'}`}>
                {isReverse ? (
                  <>
                    <div className="pillar-img-wrap car-swipe-left">
                      <img src={pillar.image} alt={pillar.title} className="pillar-img" />
                      <div className="pillar-img-overlay" />
                      <div className="pillar-img-tag">{ROMAN[idx]}</div>
                    </div>
                    <div className="pillar-text fade-right">
                      <div className="pillar-num">{String(idx + 1).padStart(2, '0')}</div>
                      <h3 className="pillar-name">{pillar.title}</h3>
                      <p className="pillar-desc">{pillar.description}</p>
                      <ul className="pillar-features">
                        {(pillar.features || []).map(f => <li key={f}>{f}</li>)}
                      </ul>
                      <a href="#anfrage" className="btn-red-outline">Anfrage stellen →</a>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="pillar-text fade-left">
                      <div className="pillar-num">{String(idx + 1).padStart(2, '0')}</div>
                      <h3 className="pillar-name">{pillar.title}</h3>
                      <p className="pillar-desc">{pillar.description}</p>
                      <ul className="pillar-features">
                        {(pillar.features || []).map(f => <li key={f}>{f}</li>)}
                      </ul>
                      <a href="#anfrage" className="btn-red-outline">Anfrage stellen →</a>
                    </div>
                    <div className="pillar-img-wrap car-swipe-right">
                      <img src={pillar.image} alt={pillar.title} className="pillar-img" />
                      <div className="pillar-img-overlay" />
                      <div className="pillar-img-tag">{ROMAN[idx]}</div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          3D SHOWROOM
      ═══════════════════════════════════════════════════════════ */}
      <Car3DShowroom />

      {/* ═══════════════════════════════════════════════════════════
          BEFORE / AFTER
      ═══════════════════════════════════════════════════════════ */}
      <section id="transformation" className="transformation">
        <div className="container">
          <BeforeAfter />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          REQUEST FORM
      ═══════════════════════════════════════════════════════════ */}
      <section id="anfrage" className="anfrage">
        <div className="container">
          <div className="section-header scroll-animate">
            <span className="eyebrow">{iq.eyebrow}</span>
            <h2 className="section-title">
              {iq.title.includes('TERMIN')
                ? <>{iq.title.replace(' TERMIN', '')} <span className="gold">TERMIN</span></>
                : iq.title}
            </h2>
            <p className="section-sub-text">{iq.subtitle}</p>
          </div>
          <InquiryForm />
        </div>
      </section>

      <CookieBanner />

      <style jsx>{`
        /* ── Shared ─────────────────────────────────────── */
        .gold { color: var(--accent-gold); }
        .red  { color: #e63946; }
        .home-page { padding-top: 88px; overflow-x: hidden; }

        /* ── Eyebrow / Section Header ─────────────────── */
        .eyebrow {
          display: inline-block;
          font-size: 0.72rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--accent-gold);
          margin-bottom: 0.75rem;
        }
        .section-title { font-size: 2.4rem; line-height: 1.15; margin-bottom: 1rem; }
        .section-sub-text { color: var(--text-secondary); max-width: 580px; margin: 0 auto; text-align: center; }
        .section-header { text-align: center; margin-bottom: 5rem; }
        @media(max-width:768px){ .section-title{ font-size: 1.8rem; } }

        /* ── Buttons ─────────────────────────────────── */
        .btn-gold {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 1rem 2.5rem; background: var(--accent-gold); color: #000;
          font-family: var(--font-serif); font-size: 0.9rem; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase; border-radius: 4px;
          transition: all 0.3s; border: 1px solid var(--accent-gold);
          box-shadow: 0 4px 20px rgba(197,168,128,0.25);
          text-decoration: none;
        }
        .btn-gold:hover { background: #b3966e; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(197,168,128,0.4); }
        .btn-ghost {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 1rem 2.5rem; background: transparent; color: #fff;
          border: 1px solid rgba(255,255,255,0.2); font-family: var(--font-serif);
          font-size: 0.9rem; letter-spacing: 0.15em; text-transform: uppercase;
          border-radius: 4px; transition: all 0.3s; text-decoration: none;
        }
        .btn-ghost:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.5); }
        .btn-red-outline {
          display: inline-flex; align-items: center;
          font-size: 0.82rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: #e63946; border-bottom: 1px solid rgba(230,57,70,0.4);
          padding-bottom: 2px; transition: all 0.3s; text-decoration: none;
          margin-top: 1.5rem;
        }
        .btn-red-outline:hover { color: #ff4d5e; border-color: #ff4d5e; letter-spacing: 0.15em; }

        /* ═══════════════════════════════════════════
           HERO
        ═══════════════════════════════════════════ */
        .hero {
          min-height: 100vh;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: #070708;
          overflow: hidden;
        }
        .hero-video {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; z-index: 0; opacity: 0.35;
          pointer-events: none;
        }
        .hero-video-overlay {
          position: absolute; inset: 0; z-index: 0;
          background: linear-gradient(to bottom, rgba(7,7,8,.55) 0%, rgba(7,7,8,.15) 50%, rgba(7,7,8,.85) 100%);
        }
        .hero-bg-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(197,168,128,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(197,168,128,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }
        .hero-bg-glow {
          position: absolute; border-radius: 50%;
          pointer-events: none; filter: blur(120px);
        }
        .hero-bg-glow--1 {
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(197,168,128,0.06) 0%, transparent 70%);
          top: -10%; left: -10%;
          animation: heroGlow1 12s ease-in-out infinite alternate;
        }
        .hero-bg-glow--2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(230,57,70,0.04) 0%, transparent 70%);
          bottom: 10%; right: -5%;
          animation: heroGlow2 15s ease-in-out infinite alternate;
        }
        @keyframes heroGlow1 { from{transform:translate(0,0)} to{transform:translate(60px,40px)} }
        @keyframes heroGlow2 { from{transform:translate(0,0)} to{transform:translate(-40px,30px)} }

        .hero-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          padding: 6rem 2rem 3rem;
          position: relative;
          z-index: 2;
        }
        @media(max-width:1024px){
          .hero-inner { grid-template-columns: 1fr; text-align: center; gap: 3rem; padding: 4rem 1.5rem 2rem; }
        }

        .hero-text { display: flex; flex-direction: column; gap: 1.5rem; }
        .hero-eyebrow {
          display: flex; align-items: center; gap: 0.5rem;
          font-size: 0.75rem; letter-spacing: 0.25em; text-transform: uppercase;
          color: var(--accent-gold);
        }
        @media(max-width:1024px){ .hero-eyebrow{ justify-content: center; } }
        .hero-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #e63946;
          box-shadow: 0 0 8px #e63946;
          animation: dot-pulse 2s ease-in-out infinite;
        }
        @keyframes dot-pulse { 0%,100%{box-shadow:0 0 8px #e63946} 50%{box-shadow:0 0 20px #e63946,0 0 40px rgba(230,57,70,0.4)} }

        .hero-h1 {
          font-family: var(--font-serif);
          font-size: clamp(2.2rem, 5vw, 4rem);
          line-height: 1.12;
          color: #fff;
          letter-spacing: 0.04em;
        }
        .hero-sub { color: rgba(255,255,255,0.55); font-size: 1.1rem; line-height: 1.75; max-width: 520px; }
        @media(max-width:1024px){ .hero-sub{ margin: 0 auto; } }

        .hero-actions {
          display: flex; gap: 1rem; flex-wrap: wrap;
        }
        @media(max-width:1024px){ .hero-actions{ justify-content: center; } }
        @media(max-width:480px){ .hero-actions{ flex-direction: column; } }

        .trust-row { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.5rem; }
        @media(max-width:1024px){ .trust-row{ justify-content: center; } }
        .trust-pill {
          font-size: 0.72rem; letter-spacing: 0.08em;
          color: rgba(255,255,255,0.45);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px; padding: 0.3rem 0.75rem;
        }

        .hero-visual { position: relative; }
        .hero-img-wrap {
          position: relative;
          border-radius: 20px; overflow: hidden;
          border: 1px solid rgba(197,168,128,0.15);
          box-shadow: 0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.02);
          aspect-ratio: 16/10;
        }
        .hero-img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .hero-img-glare {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%);
          pointer-events: none;
        }
        .hero-badge {
          position: absolute; bottom: -16px; left: 24px;
          background: rgba(15,15,18,0.95);
          border: 1px solid rgba(197,168,128,0.25);
          border-radius: 12px; padding: 0.85rem 1.1rem;
          display: flex; align-items: center; gap: 0.75rem;
          backdrop-filter: blur(12px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        }
        .hero-badge-icon { font-size: 1.2rem; color: var(--accent-gold); }
        .hero-badge-val { font-size: 0.85rem; font-weight: 700; color: #fff; letter-spacing: 0.08em; }
        .hero-badge-sub { font-size: 0.68rem; color: var(--accent-gold); letter-spacing: 0.1em; }

        /* Stats bar */
        .hero-stats-bar {
          position: relative; z-index: 2;
          border-top: 1px solid rgba(197,168,128,0.08);
          background: rgba(7,7,8,0.95);
          backdrop-filter: blur(20px);
          margin-top: 3rem;
        }
        .hero-stats-inner {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          padding: 1.75rem 2rem;
        }
        @media(max-width:600px){ .hero-stats-inner{ grid-template-columns: repeat(2,1fr); gap: 1.5rem; padding: 1.5rem; } }
        .hero-stat {
          text-align: center;
          border-right: 1px solid rgba(255,255,255,0.05);
          padding: 0 1rem;
        }
        .hero-stat:last-child { border-right: none; }
        .hero-stat-val {
          font-family: var(--font-serif);
          font-size: 1.8rem; color: var(--accent-gold);
          font-weight: 500; letter-spacing: 0.03em;
          display: block; margin-bottom: 0.25rem;
        }
        .hero-stat-label { font-size: 0.7rem; color: rgba(255,255,255,0.35); letter-spacing: 0.08em; text-transform: uppercase; }

        /* ═══════════════════════════════════════════
           PHILOSOPHY
        ═══════════════════════════════════════════ */
        .philosophy {
          padding: 9rem 0;
          position: relative;
          background: linear-gradient(180deg, #070708 0%, #0c0a0f 50%, #070708 100%);
          overflow: hidden;
        }
        .phil-bg-accent {
          position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background:
            radial-gradient(ellipse at 15% 50%, rgba(230,57,70,0.04) 0%, transparent 50%),
            radial-gradient(ellipse at 85% 50%, rgba(197,168,128,0.04) 0%, transparent 50%);
          pointer-events: none;
        }
        .philosophy-inner {
          display: grid;
          grid-template-columns: 120px 1fr 200px;
          gap: 4rem;
          align-items: center;
          position: relative;
          z-index: 2;
        }
        @media(max-width:1100px){
          .philosophy-inner {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 3rem;
          }
          .phil-left, .phil-right { align-items: center; }
          .phil-right { display: grid; grid-template-columns: repeat(3,1fr); }
        }
        @media(max-width:600px){
          .phil-right { grid-template-columns: 1fr; }
        }

        .phil-left { display: flex; flex-direction: column; align-items: center; gap: 2rem; }

        .phil-pin-wrap {
          position: relative; width: 80px; height: 100px;
          display: flex; align-items: flex-start; justify-content: center;
        }
        .phil-pin { width: 60px; height: 80px; filter: drop-shadow(0 8px 24px rgba(230,57,70,0.5)); animation: pin-bob 3s ease-in-out infinite; }
        @keyframes pin-bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .phil-pin-ring {
          position: absolute; border-radius: 50%; border: 1px solid rgba(230,57,70,0.2);
          animation: ring-expand 2.5s ease-out infinite;
        }
        .phil-pin-ring--1 { width: 60px; height: 60px; top: 0; left: 10px; animation-delay: 0s; }
        .phil-pin-ring--2 { width: 90px; height: 90px; top: -15px; left: -5px; animation-delay: 0.5s; }
        @keyframes ring-expand { 0%{opacity:0.6;transform:scale(0.8)} 100%{opacity:0;transform:scale(1.5)} }

        .phil-vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
          font-size: 0.65rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(230,57,70,0.6);
          transform: rotate(180deg);
        }
        @media(max-width:1100px){ .phil-vertical-text{ writing-mode: horizontal-tb; transform: none; } }

        .phil-content { display: flex; flex-direction: column; gap: 1.5rem; }
        .phil-red-line {
          width: 60px; height: 3px;
          background: linear-gradient(90deg, #e63946, transparent);
          border-radius: 2px;
        }
        @media(max-width:1100px){ .phil-red-line{ margin: 0 auto; } }

        .phil-quote {
          font-family: var(--font-serif);
          font-size: clamp(1.5rem, 2.5vw, 2.2rem);
          line-height: 1.45;
          color: #fff;
          font-style: normal;
          font-weight: 500;
        }
        .phil-body { color: rgba(255,255,255,0.5); line-height: 1.8; font-size: 1rem; max-width: 680px; }
        @media(max-width:1100px){ .phil-body{ margin: 0 auto; } }
        .phil-signature { display: flex; align-items: center; gap: 1rem; }
        @media(max-width:1100px){ .phil-signature{ justify-content: center; } }
        .phil-sig-line { width: 40px; height: 1px; background: var(--accent-gold); }
        .phil-signature span { font-size: 0.82rem; color: var(--accent-gold); letter-spacing: 0.08em; }

        .phil-right { display: flex; flex-direction: column; gap: 1.25rem; }
        .phil-stat-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(230,57,70,0.15);
          border-radius: 12px; padding: 1.25rem;
          text-align: center; transition: all 0.3s;
        }
        .phil-stat-card:hover {
          background: rgba(230,57,70,0.04);
          border-color: rgba(230,57,70,0.3);
          transform: translateY(-4px);
        }
        .phil-stat-num {
          font-family: var(--font-serif); font-size: 1.75rem;
          font-weight: 500; margin-bottom: 0.35rem;
        }
        .phil-stat-label { font-size: 0.72rem; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.08em; }

        /* ═══════════════════════════════════════════
           SERVICES / PILLARS
        ═══════════════════════════════════════════ */
        .services { padding: 8rem 0 10rem; }

        .pillar-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          min-height: 520px;
          margin-bottom: 0;
          border-top: 1px solid rgba(255,255,255,0.04);
          overflow: hidden;
        }
        .pillar-row:last-child { border-bottom: 1px solid rgba(255,255,255,0.04); }
        @media(max-width:900px){
          .pillar-row { grid-template-columns: 1fr; min-height: unset; }
          .pillar-text { order: 0; }
          .pillar-img-wrap { order: 1; }
        }

        .pillar-text {
          display: flex; flex-direction: column; justify-content: center;
          padding: 5rem 4rem;
          background: var(--bg-secondary);
          position: relative;
        }
        @media(max-width:1200px){ .pillar-text{ padding: 3.5rem 2.5rem; } }
        @media(max-width:600px){ .pillar-text{ padding: 2.5rem 1.5rem; } }

        .pillar-num {
          font-family: var(--font-serif);
          font-size: 4rem; font-weight: 700;
          color: rgba(197,168,128,0.08);
          line-height: 1; margin-bottom: 0.5rem;
          user-select: none;
        }
        .pillar-name {
          font-family: var(--font-serif);
          font-size: 1.35rem; color: #fff;
          letter-spacing: 0.06em; margin-bottom: 1.25rem;
          line-height: 1.3;
        }
        .pillar-desc { color: rgba(255,255,255,0.5); font-size: 0.975rem; line-height: 1.8; margin-bottom: 1.25rem; }
        .pillar-features {
          list-style: none; display: flex; flex-direction: column; gap: 0.55rem;
          margin-bottom: 0.5rem;
        }
        .pillar-features li {
          font-size: 0.875rem; color: rgba(255,255,255,0.4);
          display: flex; align-items: center; gap: 0.6rem;
        }
        .pillar-features li::before {
          content: ''; width: 16px; height: 1px;
          background: var(--accent-gold); flex-shrink: 0;
        }

        .pillar-img-wrap {
          position: relative; overflow: hidden; min-height: 400px;
        }
        @media(max-width:900px){ .pillar-img-wrap{ min-height: 280px; } }
        .pillar-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.8s cubic-bezier(0.16,1,0.3,1); }
        .pillar-img-wrap:hover .pillar-img { transform: scale(1.04); }
        .pillar-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to right, rgba(7,7,8,0.4) 0%, transparent 50%);
          pointer-events: none;
        }
        .pillar-row--reverse .pillar-img-overlay {
          background: linear-gradient(to left, rgba(7,7,8,0.4) 0%, transparent 50%);
        }
        .pillar-img-tag {
          position: absolute; top: 1.5rem; right: 1.5rem;
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(7,7,8,0.85);
          border: 1px solid rgba(197,168,128,0.3);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-serif); font-size: 0.8rem; color: var(--accent-gold);
          backdrop-filter: blur(8px);
        }
        .pillar-row--reverse .pillar-img-tag { right: auto; left: 1.5rem; }

        /* ═══════════════════════════════════════════
           TRANSFORMATION
        ═══════════════════════════════════════════ */
        .transformation {
          padding: 8rem 0;
          background: linear-gradient(180deg, transparent, var(--bg-secondary), transparent);
        }

        /* ═══════════════════════════════════════════
           ANFRAGE
        ═══════════════════════════════════════════ */
        .anfrage { padding: 8rem 0 10rem; }

        /* ── Fade animations ─────────────────────── */
        .fade-up {
          opacity: 0; transform: translateY(50px);
          transition: all 0.9s cubic-bezier(0.16,1,0.3,1);
        }
        .fade-up.animated { opacity: 1; transform: translateY(0); }
        .fade-left {
          opacity: 0; transform: translateX(-60px);
          transition: all 0.9s cubic-bezier(0.16,1,0.3,1);
        }
        .fade-left.animated { opacity: 1; transform: translateX(0); }
        .fade-right {
          opacity: 0; transform: translateX(60px);
          transition: all 0.9s cubic-bezier(0.16,1,0.3,1);
        }
        .fade-right.animated { opacity: 1; transform: translateX(0); }
      `}</style>
    </div>
  );
}
