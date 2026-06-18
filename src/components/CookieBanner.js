'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CookieBanner() {
  const pathname = usePathname();
  const [consent, setConsent] = useState(null);

  useEffect(() => {
    // Read consent from localStorage
    const savedConsent = localStorage.getItem('chris_cookie_consent');
    if (savedConsent) {
      setConsent(savedConsent);
    } else {
      setConsent('none');
    }
  }, []);

  // Hide on admin routes and when consent is already provided
  if (pathname.startsWith('/admin') || consent === 'accepted' || consent === 'declined' || consent === null) {
    return null;
  }

  const handleAccept = () => {
    localStorage.setItem('chris_cookie_consent', 'accepted');
    setConsent('accepted');
    // Dispatch custom event to notify StatsTracker immediately
    window.dispatchEvent(new Event('cookie_consent_changed'));
  };

  const handleDecline = () => {
    localStorage.setItem('chris_cookie_consent', 'declined');
    setConsent('declined');
    window.dispatchEvent(new Event('cookie_consent_changed'));
  };

  return (
    <div className="cookie-banner-container glass-panel-gold">
      <div className="cookie-content">
        <p className="cookie-text">
          Um das Online-Erlebnis zu optimieren, nutzen wir anonyme Analyseverfahren. Sie können der statistischen Erfassung hier zustimmen oder sie ablehnen. Weitere Details finden Sie in unserer <Link href="/legal/datenschutz" className="cookie-link">Datenschutzerklärung</Link>.
        </p>
        <div className="cookie-actions">
          <button onClick={handleDecline} className="btn-decline">ABLEHNEN</button>
          <button onClick={handleAccept} className="btn-accept">AKZEPTIEREN</button>
        </div>
      </div>

      <style jsx>{`
        .cookie-banner-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          max-width: 450px;
          z-index: 9999;
          padding: 1.5rem;
          animation: slideInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @media (max-width: 600px) {
          .cookie-banner-container {
            bottom: 12px;
            left: 12px;
            right: 12px;
            max-width: none;
          }
        }

        @keyframes slideInUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .cookie-content {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .cookie-text {
          font-size: 0.85rem;
          line-height: 1.5;
          color: var(--text-secondary);
        }

        .cookie-link {
          color: var(--accent-gold);
          text-decoration: underline;
        }

        .cookie-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }

        .btn-decline {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-family: var(--font-serif);
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          cursor: pointer;
          padding: 0.5rem 1rem;
          transition: var(--transition-fast);
        }

        .btn-decline:hover {
          color: var(--text-primary);
        }

        .btn-accept {
          background: var(--accent-gold);
          border: 1px solid var(--accent-gold);
          color: #000;
          font-family: var(--font-serif);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          cursor: pointer;
          padding: 0.5rem 1.5rem;
          border-radius: 4px;
          transition: var(--transition-fast);
        }

        .btn-accept:hover {
          background: var(--accent-gold-hover);
          border-color: var(--accent-gold-hover);
          box-shadow: 0 4px 10px rgba(197, 168, 128, 0.2);
        }
      `}</style>
    </div>
  );
}
