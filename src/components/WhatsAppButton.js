'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

// WhatsApp-Nummer hier anpassen sobald bekannt:
const WHATSAPP_NUMBER = '41790000000';
const WHATSAPP_MSG = encodeURIComponent('Hallo Christian, ich interessiere mich für Ihre Detailing-Leistungen.');

export default function WhatsAppButton() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (pathname.startsWith('/admin')) { setVisible(false); return; }
    const t = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(t);
  }, [pathname]);

  if (!visible) return null;

  return (
    <>
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-btn"
        aria-label="WhatsApp kontaktieren"
      >
        {/* WhatsApp SVG */}
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
        </svg>
        <span className="wa-label">WhatsApp</span>
      </a>

      <style jsx>{`
        .wa-btn {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: .55rem;
          background: #25d366;
          color: #fff;
          border-radius: 50px;
          padding: .75rem 1.25rem .75rem 1rem;
          text-decoration: none;
          font-family: system-ui, sans-serif;
          font-size: .88rem;
          font-weight: 600;
          box-shadow: 0 4px 24px rgba(37,211,102,.4), 0 2px 8px rgba(0,0,0,.3);
          animation: wa-enter .5s cubic-bezier(.34,1.56,.64,1) both;
          transition: transform .2s, box-shadow .2s;
        }
        .wa-btn:hover {
          transform: translateY(-3px) scale(1.04);
          box-shadow: 0 8px 32px rgba(37,211,102,.5), 0 4px 12px rgba(0,0,0,.3);
        }
        .wa-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50px;
          background: #25d366;
          animation: wa-ping 2.5s ease-out 2s infinite;
          z-index: -1;
        }
        @keyframes wa-ping {
          0% { transform: scale(1); opacity: .6; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes wa-enter {
          from { opacity: 0; transform: translateY(20px) scale(.8); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (max-width: 500px) {
          .wa-btn { bottom: 1.25rem; right: 1.25rem; padding: .75rem; border-radius: 50%; }
          .wa-label { display: none; }
        }
      `}</style>
    </>
  );
}
