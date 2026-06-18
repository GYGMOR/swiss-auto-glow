'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DEFAULT_CONTENT } from '@/lib/content-defaults';

const DEFAULT_CONTACT = DEFAULT_CONTENT.contact;

export default function Footer() {
  const pathname = usePathname();
  const [contact, setContact] = useState(DEFAULT_CONTACT);

  useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then(d => { if (d?.contact) setContact(c => ({ ...c, ...d.contact })); })
      .catch(() => {});
  }, []);

  if (pathname.startsWith('/admin')) return null;

  return (
    <footer className="main-footer">
      <div className="footer-accent-line" />

      <div className="container footer-grid">
        {/* Brand */}
        <div className="footer-section brand-info">
          <Link href="/" className="footer-logo">
            <span className="footer-logo-name">CHRISTIAN</span>
            <span className="footer-logo-sub">PREMIUM DETAILING</span>
          </Link>
          <p className="footer-desc">{contact.footer_desc}</p>
          <div className="contact-details">
            <div className="detail-item">
              <span className="detail-label">Standort</span>
              <span className="detail-value">{contact.address}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Telefon</span>
              <a href={`tel:${contact.phone.replace(/\s/g,'')}`} className="detail-value detail-link">{contact.phone}</a>
            </div>
            <div className="detail-item">
              <span className="detail-label">E-Mail</span>
              <a href={`mailto:${contact.email}`} className="detail-value detail-link">{contact.email}</a>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="footer-section links-section">
          <h4 className="footer-title">Navigation</h4>
          <ul className="footer-links">
            <li><Link href="/#philosophie" className="footer-link">Philosophie</Link></li>
            <li><Link href="/#services" className="footer-link">Dienstleistungen</Link></li>
            <li><Link href="/#showroom" className="footer-link">Showroom</Link></li>
            <li><Link href="/#transformation" className="footer-link">Resultate</Link></li>
            <li><Link href="/about" className="footer-link">Über Uns</Link></li>
            <li><Link href="/#anfrage" className="footer-link">Anfrage starten</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div className="footer-section links-section">
          <h4 className="footer-title">Rechtliches</h4>
          <ul className="footer-links">
            <li><Link href="/legal/impressum" className="footer-link">Impressum</Link></li>
            <li><Link href="/legal/datenschutz" className="footer-link">Datenschutzerklärung</Link></li>
            <li><Link href="/legal/agb" className="footer-link">AGB</Link></li>
            <li><Link href="/legal/dsgvo" className="footer-link">DSGVO / DSG</Link></li>
          </ul>
        </div>

        {/* Map */}
        <div className="footer-section maps-section">
          <h4 className="footer-title">Standort</h4>
          <div className="map-wrapper">
            {contact.maps_url && (
              <iframe
                src={contact.maps_url}
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps Standort"
              />
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p className="copyright">
            &copy; {new Date().getFullYear()} Christian Premium Detailing — Alle Rechte vorbehalten.
          </p>
          <p className="footer-tagline">High-End Fahrzeugpflege &amp; Rostschutz.</p>
        </div>
      </div>

      <style jsx>{`
        .main-footer {
          position: relative;
          background: #09090b;
          padding: 5rem 0 0 0;
          z-index: 10;
        }

        .footer-accent-line {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(197,168,128,.5) 30%, rgba(197,168,128,.5) 70%, transparent);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.8fr;
          gap: 3rem;
          padding-bottom: 4rem;
        }

        @media (max-width: 1100px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 2.5rem; }
        }
        @media (max-width: 600px) {
          .footer-grid { grid-template-columns: 1fr; gap: 2.5rem; }
        }

        .brand-info { display: flex; flex-direction: column; gap: 1.2rem; }

        .footer-logo { display: flex; flex-direction: column; gap: 5px; text-decoration: none; line-height: 1; }
        .footer-logo-name { font-family: var(--font-serif); font-size: 1.15rem; color: #fff; letter-spacing: .22em; font-weight: 500; }
        .footer-logo-sub { font-family: var(--font-sans); font-size: .55rem; letter-spacing: .32em; color: var(--accent-gold); text-transform: uppercase; }

        .footer-desc { font-size: .9rem; color: rgba(255,255,255,.4); line-height: 1.75; max-width: 360px; font-weight: 300; }

        .contact-details { display: flex; flex-direction: column; gap: .6rem; }
        .detail-item { display: flex; flex-direction: column; gap: 2px; }
        .detail-label { font-family: var(--font-sans); font-size: .68rem; letter-spacing: .1em; text-transform: uppercase; color: var(--accent-gold); opacity: .7; }
        .detail-value { font-size: .88rem; color: rgba(255,255,255,.55); }
        .detail-link { text-decoration: none; transition: color .25s ease; }
        .detail-link:hover { color: rgba(255,255,255,.9); }

        .links-section { display: flex; flex-direction: column; }
        .footer-title { font-family: var(--font-sans); font-size: .68rem; letter-spacing: .18em; text-transform: uppercase; color: var(--accent-gold); margin-bottom: 1.6rem; font-weight: 500; }
        .footer-links { list-style: none; display: flex; flex-direction: column; gap: .75rem; }
        .footer-link { font-size: .88rem; color: rgba(255,255,255,.45); text-decoration: none; transition: color .25s ease, padding-left .25s ease; display: inline-block; }
        .footer-link:hover { color: rgba(255,255,255,.9); padding-left: 6px; }

        .maps-section { display: flex; flex-direction: column; }
        .map-wrapper { border-radius: 10px; overflow: hidden; border: 1px solid rgba(197,168,128,.1); box-shadow: 0 10px 40px rgba(0,0,0,.4); filter: invert(90%) hue-rotate(180deg) grayscale(100%) contrast(88%); transition: filter .4s ease, box-shadow .4s ease; flex: 1; min-height: 160px; }
        .map-wrapper:hover { filter: invert(88%) hue-rotate(180deg) grayscale(70%) contrast(92%); box-shadow: 0 10px 40px rgba(197,168,128,.1); }

        .footer-bottom { border-top: 1px solid rgba(255,255,255,.04); padding: 1.8rem 0; }
        .footer-bottom-content { display: flex; justify-content: space-between; align-items: center; }
        .copyright { font-size: .8rem; color: rgba(255,255,255,.25); font-weight: 300; }
        .footer-tagline { font-size: .78rem; color: rgba(255,255,255,.2); letter-spacing: .05em; }

        @media (max-width: 600px) {
          .footer-bottom-content { flex-direction: column; gap: .75rem; text-align: center; }
        }
      `}</style>
    </footer>
  );
}
