import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return [
    { slug: 'impressum' },
    { slug: 'datenschutz' },
    { slug: 'agb' },
    { slug: 'dsgvo' }
  ];
}

export default async function LegalPage({ params }) {
  const { slug } = await params;
  
  const legalContent = getLegalContent(slug);
  
  if (!legalContent) {
    notFound();
  }

  return (
    <div className="legal-page-wrapper">
      <div className="ambient-glow" style={{ top: '10%', right: '10%' }}></div>
      
      <div className="container legal-container">
        <Link href="/" className="back-link">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          ZURÜCK ZUR HOMEPAGE
        </Link>
        
        <h1 className="legal-title">{legalContent.title}</h1>
        <div className="legal-meta">Zuletzt aktualisiert: Juni 2026 | Gültig für CH & EU</div>
        
        <div className="legal-body glass-panel" dangerouslySetInnerHTML={{ __html: legalContent.html }} />
      </div>    </div>
  );
}

function getLegalContent(slug) {
  const contents = {
    impressum: {
      title: 'Impressum',
      html: `
        <h2>Angaben gemäß § 5 TMG / DSG</h2>
        <p>
          <strong>Betreiber der Website:</strong><br />
          Christian Premium Detailing<br />
          Inhaber: Christian Hediger<br />
          Industriestrasse 12<br />
          8000 Zürich<br />
          Schweiz
        </p>

        <h2>Kontakt</h2>
        <p>
          Telefon: +41 79 000 00 00<br />
          E-Mail: info@detailing-christian.ch<br />
          Webseite: https://detailing-christian.ch
        </p>

        <h2>Vertretungsberechtigte Person</h2>
        <p>Christian Hediger, Inhaber & Chef-Detailer</p>

        <h2>Mehrwertsteuer-Nummer (UID)</h2>
        <p>CHE-123.456.789 MWST (Mockup)</p>

        <h2>Verantwortlich für den Inhalt</h2>
        <p>Christian Hediger, Anschrift wie oben.</p>

        <h2>Haftungsausschluss</h2>
        <p>
          Der Autor übernimmt keinerlei Gewähr hinsichtlich der inhaltlichen Richtigkeit, Genauigkeit, Aktualität, Zuverlässigkeit und Vollständigkeit der Informationen. Haftungsansprüche gegen den Autor wegen Schäden materieller oder immaterieller Art, welche aus dem Zugriff oder der Nutzung bzw. Nichtnutzung der veröffentlichten Informationen, durch Missbrauch der Verbindung oder durch technische Störungen entstanden sind, werden ausgeschlossen.
        </p>
        <p>
          Alle Angebote sind unverbindlich. Der Autor behält es sich ausdrücklich vor, Teile der Seiten oder das gesamte Angebot ohne gesonderte Ankündigung zu verändern, zu ergänzen, zu löschen oder die Veröffentlichung zeitweise oder endgültig einzustellen.
        </p>
      `
    },
    datenschutz: {
      title: 'Datenschutzerklärung',
      html: `
        <h2>1. Datenschutz auf einen Blick</h2>
        <h3>Allgemeine Hinweise</h3>
        <p>
          Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesen Text aufgeführten Datenschutzerklärung.
        </p>

        <h2>2. Datenerfassung auf unserer Website</h2>
        <h3>Wie erfassen wir Ihre Daten?</h3>
        <p>
          Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie in unser Anfrageformular eingeben.
        </p>
        <p>
          Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie diese Website betreten — sofern Sie der Cookie-Einwilligung zugestimmt haben.
        </p>

        <h3>Wofür nutzen wir Ihre Daten?</h3>
        <p>
          Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten und anonyme Nutzungsstatistiken (z.B. Besuchszahlen, Gerätetypen) im Admin-Dashboard anzuzeigen. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
        </p>

        <h3>Rechte bezüglich Ihrer Daten</h3>
        <p>
          Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen.
        </p>

        <h2>3. Analyse-Tools und Tools von Drittanbietern</h2>
        <p>
          Beim Besuch unserer Website kann Ihr Surf-Verhalten statistisch ausgewertet werden. Dies geschieht vor allem mit sogenannten Analyseprogrammen.
        </p>
        <p>
          <strong>Wichtig (DSGVO/DSG Konformität):</strong> Unsere Analysen laufen vollständig auf unserem eigenen Server (Node.js backend) ohne Weiterleitung an Google Analytics, Facebook Pixel oder andere Werbenetzwerke. IPs werden noch während der Anfrage mittels SHA-256 kryptografisch gehasht und anonymisiert. Es findet keine dauerhafte Speicherung von unverschlüsselten IP-Adressen statt.
        </p>
      `
    },
    agb: {
      title: 'Allgemeine Geschäftsbedingungen (AGB)',
      html: `
        <h2>1. Geltungsbereich und Allgemeines</h2>
        <p>
          Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Dienstleistungen und Verträge im Bereich Fahrzeugpflege, Lackaufbereitung, Unterbodenschutz und Korrosionsschutz (Rostschutz) von Christian Premium Detailing.
        </p>

        <h2>2. Vertragsabschluss / Premium-Modell</h2>
        <p>
          Unsere Dienstleistungen richten sich an anspruchsvolle Kunden und Sammler. Wir bieten keine standardisierten Pauschalpreise, Abonnements oder Online-Direktbuchungen an. Ein Vertrag kommt ausschließlich nach einer persönlichen Begutachtung des Fahrzeugs vor Ort und der Erstellung eines individuellen, schriftlichen Angebots zustande.
        </p>

        <h2>3. Pflichten des Kunden</h2>
        <p>
          Der Kunde ist verpflichtet, vor Beginn der Arbeiten auf alle ihm bekannten Mängel, Beschädigungen, Vorschäden oder Besonderheiten des Fahrzeugs (z. B. Nachlackierungen, Steinschläge, elektronische Störungen, Rostherde) hinzuweisen.
        </p>

        <h2>4. Abholung und Annahmeverzug</h2>
        <p>
          Das Fahrzeug wird zum vereinbarten Fertigstellungstermin übergeben. Holt der Kunde das Fahrzeug nicht innerhalb von 48 Stunden nach Benachrichtigung ab, können Standgebühren in Höhe von CHF 50.00 pro Tag erhoben werden.
        </p>

        <h2>5. Haftungsausschluss</h2>
        <p>
          Wir haften nur für Schäden, die nachweislich durch grobe Fahrlässigkeit oder Vorsatz bei unseren Arbeiten entstanden sind. Die Haftung für bereits bestehende Mängel (z. B. Steinschläge im Lack, brüchiges Altleder, durchgerostete Karosserieteile) ist ausgeschlossen.
        </p>
      `
    },
    dsgvo: {
      title: 'DSGVO / Schweizer DSG Compliance',
      html: `
        <h2>Datenschutzkonformität (EU-DSGVO & Schweizer DSG)</h2>
        <p>
          Als Schweizer Unternehmen mit Sitz in Zürich richten wir unsere Datenverarbeitung nach dem schweizerischen Bundesgesetz über den Datenschutz (DSG) sowie — wo anwendbar — nach der europäischen Datenschutz-Grundverordnung (EU-DSGVO) aus.
        </p>

        <h2>Verantwortliche Stelle</h2>
        <p>
          Verantwortlicher für die Datenverarbeitungen auf dieser Website ist:<br />
          Christian Hediger<br />
          E-Mail: info@detailing-christian.ch
        </p>

        <h2>Datenminimierung und Server-Analysen</h2>
        <p>
          Im Sinne der DSGVO und des DSG erheben wir nur Daten, die für den Betrieb und die Sicherheit der Website unbedingt erforderlich sind:
        </p>
        <ul>
          <li><strong>Anfrageformular:</strong> Daten, die Sie eingeben (Fahrzeug, Name, Kontakt), werden verschlüsselt an unser internes System übertragen und nur zur Beantwortung Ihrer Anfrage genutzt. Keine Weitergabe an Dritte.</li>
          <li><strong>Statistiken:</strong> Wir erheben Zugriffsstatistiken (Pfad, Browsertyp, Gerät, Referrer). Ihre IP-Adresse wird unter Verwendung eines täglichen Zufallssalts per SHA-256 gehasht. Dadurch sind Sie für uns nicht identifizierbar, wodurch die Vorgaben zur Anonymität voll erfüllt sind.</li>
        </ul>

        <h2>Ihre Rechte</h2>
        <p>
          Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerruf. Wenden Sie sich hierzu bitte per E-Mail an uns.
        </p>
      `
    }
  };

  return contents[slug];
}
