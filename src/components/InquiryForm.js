'use client';

import { useState, useEffect } from 'react';
import { DEFAULT_CONTENT } from '@/lib/content-defaults';

const DEFAULT_SERVICES = DEFAULT_CONTENT.inquiry.services;

export default function InquiryForm() {
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [step, setStep] = useState(1);

  useEffect(() => {
    fetch('/api/content').then(r => r.json()).then(d => {
      if (d?.inquiry?.services?.length) setServices(d.inquiry.services);
    }).catch(() => {});
  }, []);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    carBrandModel: '',
    carYear: '',
    carCondition: 'well_maintained',
    services: [],
    clientPhilosophy: 'value_preservation',
    message: ''
  });

  const nextStep = () => {
    // Validate current step
    if (step === 1 && !formData.carBrandModel) {
      setError('Bitte geben Sie Marke & Modell an.');
      return;
    }
    if (step === 2 && formData.services.length === 0) {
      setError('Bitte wählen Sie mindestens einen gewünschten Service.');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(step - 1);
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (serviceId) => {
    setFormData(prev => {
      const services = prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId];
      return { ...prev, services };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || (!formData.email && !formData.phone)) {
      setError('Bitte geben Sie Ihren Namen sowie eine E-Mail-Adresse oder Telefonnummer an.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.');
      }
    } catch (err) {
      setError('Verbindung zum Server fehlgeschlagen.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="glass-panel-gold success-container scroll-animate animated">
        <div className="success-icon">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h3 className="success-title">Exklusive Anfrage Eingegangen</h3>
        <p className="success-desc">
          Sehr geehrte(r) {formData.name},<br /><br />
          vielen Dank für Ihr Vertrauen in unsere Expertise. Wir nehmen uns für jedes Fahrzeug überdurchschnittlich viel Zeit, um makellose Ergebnisse zu garantieren.
          <br /><br />
          Ihre Anfrage für den <strong>{formData.carBrandModel}</strong> wird von Christian persönlich geprüft. Sie erhalten innerhalb von 48 Stunden eine Rückmeldung bezüglich einer ersten Begutachtung.
        </p>
        <span className="success-footer">Christian Premium Detailing — Nur auf Anfrage.</span>
      </div>
    );
  }

  return (
    <div className="form-wrapper">
      {/* Progress Indicator */}
      <div className="progress-bar-container">
        <div className={`progress-step-indicator ${step >= 1 ? 'active' : ''}`}>Fahrzeug</div>
        <div className="progress-line">
          <div className="progress-line-fill" style={{ width: `${(step - 1) * 33.3}%` }}></div>
        </div>
        <div className={`progress-step-indicator ${step >= 2 ? 'active' : ''}`}>Leistungen</div>
        <div className="progress-line"></div>
        <div className={`progress-step-indicator ${step >= 3 ? 'active' : ''}`}>Philosophie</div>
        <div className="progress-line"></div>
        <div className={`progress-step-indicator ${step >= 4 ? 'active' : ''}`}>Kontakt</div>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel-gold config-form">
        {error && <div className="form-error">{error}</div>}

        {/* STEP 1: VEHICLE DETAILS */}
        {step === 1 && (
          <div className="step-content">
            <h3 className="step-title">Geben Sie Ihre Fahrzeugdaten an</h3>
            <p className="step-subtitle">Wir stimmen unsere Behandlung perfekt auf die Beschaffenheit und Bauart Ihres Wagens ab.</p>
            
            <div className="input-group">
              <label htmlFor="carBrandModel">Hersteller & Modell <span className="req">*</span></label>
              <input 
                type="text" 
                id="carBrandModel" 
                name="carBrandModel" 
                value={formData.carBrandModel}
                onChange={handleTextChange}
                placeholder="z.B. Porsche 911 Carrera (992)" 
                required
              />
            </div>

            <div className="input-row">
              <div className="input-group">
                <label htmlFor="carYear">Baujahr</label>
                <input 
                  type="number" 
                  id="carYear" 
                  name="carYear" 
                  value={formData.carYear}
                  onChange={handleTextChange}
                  placeholder="z.B. 2022" 
                />
              </div>

              <div className="input-group">
                <label htmlFor="carCondition">Aktueller Zustand</label>
                <select 
                  id="carCondition" 
                  name="carCondition" 
                  value={formData.carCondition}
                  onChange={handleTextChange}
                >
                  <option value="well_maintained">Gepflegter Erstbesitz / Gut erhalten</option>
                  <option value="needs_correction">Gebrauchsspuren / Feine Kratzer</option>
                  <option value="restoration_needed">Starker Verschleiß / Rostbefall vorhanden</option>
                  <option value="collector_item">Klassiker / Oldtimer / Sammlerfahrzeug</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: SERVICE PILLARS */}
        {step === 2 && (
          <div className="step-content">
            <h3 className="step-title">Wählen Sie das gewünschte Veredelungspaket</h3>
            <p className="step-subtitle">Gerne kombinieren wir die Leistungen individuell nach Absprache.</p>
            
            <div className="services-grid">
              {services.map(s => {
                const isSelected = formData.services.includes(s.id);
                return (
                  <div 
                    key={s.id} 
                    className={`service-card-select ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleServiceToggle(s.id)}
                  >
                    <div className="select-indicator">
                      {isSelected && (
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </div>
                    <div className="card-select-text">
                      <h4>{s.title}</h4>
                      <p>{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: INTENT / TARGETING FILTER */}
        {step === 3 && (
          <div className="step-content">
            <h3 className="step-title">Welche Ansprüche stellen Sie an das Resultat?</h3>
            <p className="step-subtitle">Unser Angebot richtet sich an Fahrzeughalter, die keine Kompromisse eingehen wollen.</p>
            
            <div className="phil-selector">
              <label className={`phil-option ${formData.clientPhilosophy === 'value_preservation' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="clientPhilosophy" 
                  value="value_preservation"
                  checked={formData.clientPhilosophy === 'value_preservation'}
                  onChange={handleTextChange}
                />
                <span className="phil-title">Langfristige Werterhaltung</span>
                <span className="phil-desc">Ich suche einen festen Partner für die regelmäßige Veredelung und Werterhaltung meines Automobils.</span>
              </label>

              <label className={`phil-option ${formData.clientPhilosophy === 'one_time_perfect' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="clientPhilosophy" 
                  value="one_time_perfect"
                  checked={formData.clientPhilosophy === 'one_time_perfect'}
                  onChange={handleTextChange}
                />
                <span className="phil-title">Komplette Neuzustand-Veredelung</span>
                <span className="phil-desc">Das Fahrzeug soll einmalig in einen makellosen Concours- oder rostgeschützten Zustand versetzt werden.</span>
              </label>

              <label className={`phil-option ${formData.clientPhilosophy === 'budget_oriented' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="clientPhilosophy" 
                  value="budget_oriented"
                  checked={formData.clientPhilosophy === 'budget_oriented'}
                  onChange={handleTextChange}
                />
                <span className="phil-title">Günstige Standardaufbereitung</span>
                <span className="phil-desc">Ich suche primär eine schnelle und kostengünstige Reinigung für den zeitnahen Autoverkauf.</span>
              </label>
            </div>
          </div>
        )}

        {/* STEP 4: CONTACT INFO */}
        {step === 4 && (
          <div className="step-content">
            <h3 className="step-title">Persönliche Angaben</h3>
            <p className="step-subtitle">Geben Sie an, wie Christian Sie am besten kontaktieren kann.</p>

            <div className="input-group">
              <label htmlFor="name">Vollständiger Name <span className="req">*</span></label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleTextChange}
                placeholder="z.B. Dr. Adrian Müller" 
                required
              />
            </div>

            <div className="input-row">
              <div className="input-group">
                <label htmlFor="email">E-Mail-Adresse</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleTextChange}
                  placeholder="z.B. adrian.mueller@domain.ch" 
                />
              </div>

              <div className="input-group">
                <label htmlFor="phone">Telefonnummer</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  value={formData.phone}
                  onChange={handleTextChange}
                  placeholder="z.B. +41 79 123 45 67" 
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="message">Besondere Wünsche oder Anmerkungen</label>
              <textarea 
                id="message" 
                name="message" 
                value={formData.message}
                onChange={handleTextChange}
                placeholder="Beschreiben Sie spezifische Kratzer, Hohlraumwünsche oder zeitliche Dringlichkeiten..."
                rows="4"
              ></textarea>
            </div>
          </div>
        )}

        {/* NAVIGATION BUTTONS */}
        <div className="form-nav-buttons">
          {step > 1 && (
            <button type="button" className="btn-secondary" onClick={prevStep}>
              ZURÜCK
            </button>
          )}
          
          {step < 4 ? (
            <button type="button" className="btn-premium" onClick={nextStep} style={{ marginLeft: 'auto' }}>
              WEITER
            </button>
          ) : (
            <button type="submit" className="btn-gold-fill" disabled={loading} style={{ marginLeft: 'auto' }}>
              {loading ? 'SENDET ANFRAGE...' : 'EXKLUSIVE ANFRAGE ABSENDEN'}
            </button>
          )}
        </div>
      </form>

      <style jsx>{`
        .form-wrapper {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
        }

        /* Progress Steps styling */
        .progress-bar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2.5rem;
          padding: 0 1rem;
        }

        .progress-step-indicator {
          font-family: var(--font-serif);
          font-size: 0.8rem;
          color: var(--text-muted);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          transition: var(--transition-fast);
        }

        .progress-step-indicator.active {
          color: var(--accent-gold);
          text-shadow: 0 0 10px rgba(197, 168, 128, 0.3);
        }

        .progress-line {
          flex-grow: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.05);
          margin: 0 1rem;
          position: relative;
        }

        .progress-line-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: var(--accent-gold);
          transition: var(--transition-smooth);
        }

        /* Config Form Container */
        .config-form {
          padding: 3rem;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        @media (max-width: 600px) {
          .config-form {
            padding: 1.5rem;
          }
          .progress-bar-container {
            font-size: 0.7rem;
          }
        }

        .form-error {
          padding: 1rem;
          background: rgba(255, 107, 107, 0.1);
          border: 1px solid rgba(255, 107, 107, 0.3);
          color: #ff6b6b;
          border-radius: 4px;
          font-size: 0.95rem;
        }

        .step-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          animation: fadeIn 0.4s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .step-title {
          font-size: 1.6rem;
          color: var(--text-primary);
        }

        .step-subtitle {
          font-size: 0.95rem;
          color: var(--text-secondary);
          margin-top: -0.5rem;
        }

        /* Inputs */
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        @media (max-width: 600px) {
          .input-row {
            grid-template-columns: 1fr;
          }
        }

        label {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-secondary);
        }

        .req {
          color: var(--accent-gold);
        }

        input[type="text"],
        input[type="number"],
        input[type="email"],
        input[type="tel"],
        select,
        textarea {
          background: rgba(255, 255, 255, 0.02);
          border: var(--border-thin);
          color: var(--text-primary);
          padding: 1rem;
          font-size: 1rem;
          border-radius: 4px;
          font-family: var(--font-sans);
          transition: var(--transition-fast);
          width: 100%;
        }

        input:focus,
        select:focus,
        textarea:focus {
          outline: none;
          border-color: var(--accent-gold);
          background: rgba(255, 255, 255, 0.04);
          box-shadow: 0 0 10px rgba(197, 168, 128, 0.15);
        }

        /* Custom select */
        select option {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }

        /* Services selector */
        .services-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        @media (max-width: 600px) {
          .services-grid {
            grid-template-columns: 1fr;
          }
        }

        .service-card-select {
          border: var(--border-thin);
          background: rgba(255, 255, 255, 0.02);
          padding: 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          gap: 1rem;
          transition: var(--transition-fast);
        }

        .service-card-select:hover {
          border-color: rgba(197, 168, 128, 0.5);
          background: rgba(255, 255, 255, 0.04);
        }

        .service-card-select.selected {
          border-color: var(--accent-gold);
          background: rgba(197, 168, 128, 0.05);
        }

        .select-indicator {
          width: 20px;
          height: 20px;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          background: transparent;
        }

        .service-card-select.selected .select-indicator {
          background: var(--accent-gold);
          border-color: var(--accent-gold);
        }

        .card-select-text h4 {
          font-family: var(--font-sans);
          font-size: 1.05rem;
          font-weight: 500;
          margin-bottom: 0.3rem;
          color: var(--text-primary);
        }

        .card-select-text p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        /* Philosophy selector */
        .phil-selector {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .phil-option {
          border: var(--border-thin);
          background: rgba(255, 255, 255, 0.02);
          padding: 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          transition: var(--transition-fast);
          position: relative;
        }

        .phil-option input {
          position: absolute;
          opacity: 0;
        }

        .phil-option:hover {
          border-color: rgba(197, 168, 128, 0.5);
          background: rgba(255, 255, 255, 0.04);
        }

        .phil-option.selected {
          border-color: var(--accent-gold);
          background: rgba(197, 168, 128, 0.05);
        }

        .phil-title {
          font-family: var(--font-serif);
          font-size: 1.1rem;
          color: var(--text-primary);
        }

        .phil-option.selected .phil-title {
          color: var(--accent-gold);
        }

        .phil-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        /* Buttons row */
        .form-nav-buttons {
          display: flex;
          margin-top: 1rem;
          border-top: var(--border-thin);
          padding-top: 2rem;
        }

        /* Success screen styling */
        .success-container {
          padding: 4rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          max-width: 700px;
          margin: 0 auto;
        }

        .success-icon {
          color: var(--accent-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(0 0 10px rgba(197, 168, 128, 0.3));
        }

        .success-title {
          font-size: 2rem;
        }

        .success-desc {
          font-size: 1.05rem;
          color: var(--text-secondary);
          line-height: 1.8;
          text-align: left;
        }

        .success-footer {
          font-family: var(--font-serif);
          font-size: 0.8rem;
          color: var(--text-muted);
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }
      `}</style>
    </div>
  );
}
