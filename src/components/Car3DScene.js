'use client';

import { useEffect, useRef, useState } from 'react';

/* ─────────────────────────────────────────────────────────
   HOTSPOT DEFINITIONS
   posRel: fraction of bounding-box half-size
     x: -1=left +1=right   y: -1=bottom +1=top   z: -1=back +1=front
   normal: outward direction – model-viewer hides the dot when
           this normal faces AWAY from the camera.
───────────────────────────────────────────────────────── */
export const HOTSPOT_DEFS = [
  {
    id: 'reifen',
    label: 'Reifen & Felgen',
    icon: '⚙',
    posRel: [-0.92, -0.55, 0.5],
    normal: '-1 0 0',
    title: 'Reifen & Felgen Pflege',
    tag: 'Tiefenreinigung',
    description:
      'Unsere Felgen werden mit speziellen Felgenreinigern tiefengereinigt, die Bremsstaub und Straßenschmutz zuverlässig lösen. Reifenpflege mit UV-Schutz verleiht dem Gummi einen makellosen, tiefen Glanz und schützt vor Rissbildung.',
  },
  {
    id: 'scheiben',
    label: 'Scheiben',
    icon: '◈',
    posRel: [0.0, 0.38, 0.92],
    normal: '0 0.3 1',
    title: 'Scheiben & Verglasung',
    tag: 'Nano-Versiegelung',
    description:
      'Alle Scheiben werden mit professionellen Glasreinigern streifenfrei gereinigt. Eine optionale Nano-Glasversiegelung sorgt für optimalen Abperleffekt – für bis zu 12 Monate.',
  },
  {
    id: 'lack',
    label: 'Lack & Karosserie',
    icon: '✦',
    posRel: [0.94, 0.12, -0.1],
    normal: '1 0 0',
    title: 'Lackpflege & Versiegelung',
    tag: 'Keramik-Coating',
    description:
      'Mehrstufige Lackkorrektur entfernt Kratzer, Hologramme und Swirls. Danach wird eine Keramik-Versiegelung aufgetragen, die den Lack für 3–5 Jahre schützt und einen außergewöhnlichen Tiefenglanz verleiht.',
  },
  {
    id: 'innenraum',
    label: 'Innenraum',
    icon: '◉',
    posRel: [0.0, 0.96, 0.05],
    normal: '0 1 0',
    title: 'Innenraum Veredelung',
    tag: 'Premium Detail',
    description:
      'Vollständige Tiefenreinigung aller Oberflächen, Lederpflege mit hochwertigen Pflegeprodukten, Alcantara-Reinigung, Cockpit-Versiegelung und professionelle Ozonbehandlung zur Geruchselimination.',
  },
  {
    id: 'scheinwerfer',
    label: 'Scheinwerfer',
    icon: '◎',
    posRel: [0.38, 0.05, 0.94],
    normal: '0 0 1',
    title: 'Scheinwerfer Aufbereitung',
    tag: 'Politur & Schutz',
    description:
      'Vergilbte oder matte Scheinwerfer werden durch unser Polierverfahren wieder kristallklar. Anschließend versiegeln wir die Oberfläche zum Schutz vor UV-Strahlung.',
  },
  {
    id: 'unterboden',
    label: 'Unterboden',
    icon: '▼',
    posRel: [0.0, -0.96, 0.0],
    normal: '0 -1 0',
    title: 'Unterbodenschutz',
    tag: 'Trockeneis + Wachs',
    description:
      'Trockeneis-Reinigung entfernt rückstandsfrei Öl, Rost und Schmutz vom Unterboden. Danach wird eine transparente Polymer- oder Wachsversiegelung aufgetragen, die vor Salz, Feuchtigkeit und Korrosion schützt.',
  },
];

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────── */
export default function Car3DScene({ carFile, onHotspotClick, activeHotspotId, hotspots: hotspotsProp }) {
  const hotspots = hotspotsProp || HOTSPOT_DEFS;
  const [loaded, setLoaded] = useState(false);
  const mvRef = useRef(null);

  /* ── Load model-viewer CDN once ─────────────────────── */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (customElements.get('model-viewer')) { setLoaded(true); return; }
    const s = document.createElement('script');
    s.type = 'module';
    s.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js';
    s.onload = () => setLoaded(true);
    document.head.appendChild(s);
  }, []);

  /* ── Position hotspots using the official updateHotspot() API ── */
  useEffect(() => {
    const mv = mvRef.current;
    if (!mv || !loaded) return;

    function applyPositions() {
      // getDimensions() returns {x, y, z} in metres = bounding box size
      const dims = mv.getDimensions();
      if (!dims || dims.x === 0) {
        console.warn('[Hotspot] getDimensions() empty, retrying in 500ms');
        setTimeout(applyPositions, 500);
        return;
      }

      // For car GLBs the convention is usually Y=0 at the ground,
      // so the bbox centre is at (0, height/2, 0).
      const raw = (mv.cameraTarget || '').trim();
      let tx = 0, ty = dims.y / 2, tz = 0;
      if (raw && !raw.includes('auto')) {
        const p = raw.replace(/m/g, '').split(/\s+/);
        if (p.length >= 3) {
          tx = parseFloat(p[0]) || 0;
          ty = parseFloat(p[1]) || dims.y / 2;
          tz = parseFloat(p[2]) || 0;
        }
      }

      const hw = dims.x / 2;
      const hh = dims.y / 2;
      const hl = dims.z / 2;

      console.log('[Hotspot] dims:', dims, 'centre:', tx, ty, tz);

      hotspots.forEach((hs) => {
        const x = tx + hs.posRel[0] * hw;
        const y = ty + hs.posRel[1] * hh;
        const z = tz + hs.posRel[2] * hl;
        const pos = `${x.toFixed(4)}m ${y.toFixed(4)}m ${z.toFixed(4)}m`;

        // Use model-viewer's official API → forces internal re-render
        if (typeof mv.updateHotspot === 'function') {
          mv.updateHotspot({
            name: `hotspot-${hs.id}`,
            position: pos,
            normal: hs.normal,
          });
        } else {
          // Fallback: direct DOM, then poke model-viewer to re-render
          const el = mv.querySelector(`[slot="hotspot-${hs.id}"]`);
          if (el) {
            el.setAttribute('data-position', pos);
            el.setAttribute('data-normal', hs.normal);
          }
        }
        console.log(`[Hotspot] ${hs.id}: ${pos}`);
      });
    }

    // Run after load event with a safety delay
    function onLoad() {
      setTimeout(applyPositions, 300);
    }

    mv.addEventListener('load', onLoad);

    // Also retry after mount in case load already fired
    const fallbackTimer = setTimeout(() => {
      const dims = mv.getDimensions();
      if (dims && dims.x > 0) applyPositions();
    }, 2000);

    return () => {
      mv.removeEventListener('load', onLoad);
      clearTimeout(fallbackTimer);
    };
  }, [loaded, carFile]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: 'transparent' }}>

      {!loaded && (
        <div className="mv-loader">
          <div className="mv-ring" />
          <span>Modell wird geladen…</span>
        </div>
      )}

      {loaded && (
        <model-viewer
          ref={mvRef}
          src={carFile}
          alt="3D Fahrzeug Modell"
          camera-controls
          disable-pan
          disable-zoom
          environment-image="neutral"
          shadow-intensity="1.2"
          shadow-softness="0.9"
          exposure="0.88"
          camera-orbit="0deg 78deg 5.5m"
          min-camera-orbit="auto 8deg auto"
          max-camera-orbit="auto 148deg auto"
          interaction-prompt="none"
          style={{
            width: '100%',
            height: '100%',
            background: 'transparent',
            '--poster-color': 'transparent',
          }}
          loading="eager"
        >
          <div slot="progress-bar" style={{ display: 'none' }} />

          {/*
            data-visibility-attribute="visible"  →  model-viewer will SET
            the attribute  visible="visible"  or  visible="hidden"  on
            each button depending on whether the data-normal faces toward
            or away from the camera.
          */}
          {hotspots.map((hs) => (
            <button
              key={hs.id}
              slot={`hotspot-${hs.id}`}
              className={`mv-hotspot ${activeHotspotId === hs.id ? 'mv-hs-active' : ''}`}
              data-position="0m 1m 0m"
              data-normal={hs.normal}
              data-visibility-attribute="visible"
              onClick={() => onHotspotClick && onHotspotClick(hs)}
              title={hs.label}
            >
              <span className="mv-hs-icon">{hs.icon}</span>
              <span className="mv-hs-tooltip">{hs.label}</span>
              <span className="mv-hs-ring" />
            </button>
          ))}
        </model-viewer>
      )}

      <style>{`
        .mv-loader {
          display:flex; flex-direction:column; align-items:center;
          justify-content:center; height:100%; gap:1rem;
          color:rgba(255,255,255,.3);
          font-family:var(--font-sans,sans-serif);
          font-size:.8rem; letter-spacing:.1em;
        }
        .mv-ring {
          width:44px; height:44px;
          border:2px solid rgba(197,168,128,.12);
          border-top-color:#c5a880; border-radius:50%;
          animation:mvSpin 1s linear infinite;
        }
        @keyframes mvSpin { to { transform:rotate(360deg); } }

        model-viewer { --progress-bar-color:transparent; --progress-bar-height:0; }

        /* ── Hotspot button ──────────────────────────────── */
        .mv-hotspot {
          position:relative;
          width:40px; height:40px; border-radius:50%;
          background:rgba(6,6,10,.82);
          border:1.5px solid rgba(197,168,128,.55);
          color:#c5a880; font-size:.95rem;
          cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          padding:0;
          transition:transform .22s, background .22s,
                      border-color .22s, box-shadow .22s,
                      opacity .3s;
          backdrop-filter:blur(10px);
          -webkit-backdrop-filter:blur(10px);
          outline:none;
        }

        /*
         * model-viewer sets  visible="hidden"  when the hotspot normal
         * faces away from the camera (data-visibility-attribute="visible").
         * THIS is the correct selector:
         */
        .mv-hotspot[visible="hidden"] {
          opacity:0 !important;
          pointer-events:none !important;
          transform:scale(.7) !important;
        }

        .mv-hotspot:hover,
        .mv-hs-active {
          background:rgba(197,168,128,.2) !important;
          border-color:#c5a880 !important;
          transform:scale(1.25) !important;
          box-shadow:0 0 24px rgba(197,168,128,.5) !important;
        }
        .mv-hs-icon { display:block; line-height:1; pointer-events:none; user-select:none; }

        .mv-hs-ring {
          position:absolute; inset:-2px; border-radius:50%;
          border:1.5px solid rgba(197,168,128,.5);
          animation:mvPulse 2.6s ease-out infinite;
          pointer-events:none;
        }
        @keyframes mvPulse {
          0%   { transform:scale(1);   opacity:.7; }
          100% { transform:scale(2.4); opacity:0; }
        }

        .mv-hs-tooltip {
          position:absolute; bottom:calc(100% + 10px); left:50%;
          transform:translateX(-50%); white-space:nowrap;
          font-family:var(--font-sans,sans-serif);
          font-size:.62rem; letter-spacing:.1em; text-transform:uppercase;
          color:rgba(255,255,255,.85);
          background:rgba(5,5,9,.95);
          border:1px solid rgba(197,168,128,.3);
          border-radius:5px; padding:4px 10px;
          opacity:0; pointer-events:none;
          transition:opacity .2s; backdrop-filter:blur(8px); z-index:99;
        }
        .mv-hotspot:hover .mv-hs-tooltip { opacity:1; }
      `}</style>
    </div>
  );
}
