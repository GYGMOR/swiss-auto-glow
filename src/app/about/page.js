import Link from 'next/link';

export const metadata = {
  title: "Über Uns | Swiss Auto Glow",
  description: "Erfahren Sie mehr über die Leidenschaft, Präzision und das Handwerk hinter unseren exklusiven Autopflege-Leistungen.",
};

export default function AboutPage() {
  return (
    <div className="about-page-wrapper">
      <div className="ambient-glow pulsing-backdrop" style={{ top: '20%', left: '5%' }}></div>
      <div className="ambient-glow" style={{ top: '50%', right: '5%' }}></div>

      <div className="container about-container">
        <div className="about-intro">
          <span className="about-sub">DIE STORY</span>
          <h1 className="about-title">Präzision <span className="highlight-word">Aus Leidenschaft</span></h1>
          <p className="about-subtitle">
            Hinter Swiss Auto Glow steht der Anspruch, das Beste aus jedem Fahrzeug herauszuholen und Werte für Jahrzehnte zu schützen.
          </p>
        </div>

        <div className="about-content-grid">
          <div className="about-text-panel glass-panel">
            <h2>Wer ist Christian?</h2>
            <p>
              Gegründet wurde Swiss Auto Glow aus einer reinen Passion für klassische Automobile und exklusive Sportwagen. Schnell wurde klar: Standard-Waschstraßen und schnelle Aufbereitungen werden der Seele eines Automobils nicht gerecht. 
            </p>
            <p>
              Nach jahrelanger Perfektionierung von Techniken in der Lackkorrektur, der Lederrestaurierung und dem Hohlraum- & Unterbodenschutz haben wir uns im Großraum Zürich niedergelassen, um Fahrzeughaltern eine kompromisslose Anlaufstelle zu bieten.
            </p>
            
            <h2>Unser Versprechen</h2>
            <p>
              Bei uns steht nicht der Durchlauf im Fokus, sondern das Resultat. Jedes Fahrzeug durchläuft eine präzise Diagnose, bevor auch nur der erste Arbeitsschritt getan wird. Wir reinigen nicht nur — wir veredeln, versiegeln und stoppen den Verfall (Korrosion).
            </p>
            <ul>
              <li>Ausschließliche Verwendung zertifizierter Premium-Produkte</li>
              <li>Trockeneis-Reinigungstechnologien für materialschonenden Schutz</li>
              <li>Langjährige Erfahrung in der Oldtimer-Konservierung</li>
              <li>Vollständige fotografische Dokumentation der ausgeführten Arbeiten</li>
            </ul>
          </div>

          <div className="about-visual-panel">
            <div className="visual-card glass-panel-gold">
              <img src="/interior_detailing.png" alt="Christian Detailer Handarbeit" className="visual-img" />
              <div className="visual-caption">
                <h3>MANUFAKTUR FÜR AUTOMOBILE</h3>
                <p>Jeder Handgriff sitzt. Keine Kompromisse, keine Abos.</p>
              </div>
            </div>
            
            <div className="cta-box">
              <h3>Bereit für ein Beratungsgespräch?</h3>
              <p>Lassen Sie uns gemeinsam abstimmen, wie wir den Wert Ihres Automobils maximieren können.</p>
              <Link href="/#anfrage" className="btn-gold-fill">TERMIN BEWERBEN</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
