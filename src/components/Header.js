'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/#philosophie', label: 'Philosophie' },
  { href: '/#services',    label: 'Leistungen'  },
  { href: '/#showroom',    label: 'Showroom'    },
  { href: '/#transformation', label: 'Resultate' },
  { href: '/about',        label: 'Über Uns'    },
];

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (pathname.startsWith('/admin')) return null;

  const close = () => setIsOpen(false);

  return (
    <>
      <header className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container header-container">
          <Link href="/" className="logo" onClick={close}>
            <span className="logo-name">CHRISTIAN</span>
            <span className="logo-sub">PREMIUM DETAILING</span>
          </Link>

          <nav className="desktop-nav" aria-label="Hauptnavigation">
            {NAV_ITEMS.map(n => (
              <Link key={n.href} href={n.href} className="nav-link">{n.label}</Link>
            ))}
            <Link href="/#anfrage" className="btn-premium nav-cta">Anfrage senden</Link>
          </nav>

          <button
            className={`menu-toggle ${isOpen ? 'active' : ''}`}
            onClick={() => setIsOpen(o => !o)}
            aria-label={isOpen ? 'Menü schließen' : 'Menü öffnen'}
            aria-expanded={isOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* Backdrop */}
      <div
        className={`mobile-overlay ${isOpen ? 'active' : ''}`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Side drawer */}
      <nav
        className={`mobile-nav ${isOpen ? 'active' : ''}`}
        aria-label="Mobile Navigation"
      >
        {/* Decorative vertical gold line */}
        <div className="mn-gold-line" />

        <div className="mn-inner">
          {/* Header row: logo + close */}
          <div className="mn-header">
            <div className="mn-logo">
              <span className="logo-name">CHRISTIAN</span>
              <span className="logo-sub">PREMIUM DETAILING</span>
            </div>
            <button className="mn-close" onClick={close} aria-label="Schließen">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <line x1="1" y1="1" x2="17" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="17" y1="1" x2="1" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Divider */}
          <div className="mn-divider" />

          {/* Numbered nav items */}
          <ul className="mn-list">
            {NAV_ITEMS.map((n, i) => (
              <li key={n.href} className="mn-item">
                <Link href={n.href} className="mn-link" onClick={close}>
                  <span className="mn-num">0{i + 1}</span>
                  <span className="mn-label">{n.label}</span>
                  <span className="mn-arrow">→</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Spacer */}
          <div className="mn-spacer" />

          {/* Contact strip */}
          <div className="mn-contact">
            <p className="mn-contact-label">Kontakt</p>
            <a href="tel:+41790000000" className="mn-contact-value">+41 79 000 00 00</a>
            <a href="mailto:info@detailing-christian.ch" className="mn-contact-value">info@detailing-christian.ch</a>
          </div>

          {/* CTA */}
          <Link href="/#anfrage" className="btn-premium mn-cta" onClick={close}>
            Anfrage senden
          </Link>

          {/* Bottom badge */}
          <div className="mn-badge">
            <span className="mn-badge-dot" />
            <span>Exklusiv · Nur auf Anfrage</span>
          </div>
        </div>
      </nav>

    </>
  );
}
