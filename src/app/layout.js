import { Inter, Cinzel } from "next/font/google";
import "./globals.css";
import StatsTracker from "@/components/StatsTracker";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getSeo } from "@/lib/db";

// Load Google Fonts using Next.js optimization
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

// Server-side dynamic SEO metadata generation
export async function generateMetadata() {
  try {
    const seo = getSeo();
    return {
      title: seo.title || "Swiss Auto Glow | High-End Autopflege & Veredelung",
      description: seo.description || "Tiefenreine Innenraumpflege und dauerhafter Unterboden- & Rostschutz. Nur auf Anfrage.",
      keywords: seo.keywords || "Car Detailing, Autoaufbereitung, Unterbodenschutz, Rostschutz",
      metadataBase: new URL("https://swiss-auto-glow.ch"), // Mock/placeholder URL for SEO schema validation
      openGraph: {
        title: seo.title,
        description: seo.description,
        type: "website",
        locale: "de_CH",
      },
    };
  } catch (error) {
    return {
      title: "Swiss Auto Glow",
      description: "High-End Autopflege & Veredelung.",
    };
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="de" className={`${inter.variable} ${cinzel.variable}`}>
      <head>
        {/* Schema.org LocalBusiness JSON-LD structure for strong SEO visibility */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AutoRepair",
              "name": "Swiss Auto Glow",
              "description": "High-End Fahrzeugpflege, Hohlraumversiegelung und professioneller Rostschutz.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Industriestrasse 12",
                "addressLocality": "Zürich",
                "postalCode": "8000",
                "addressCountry": "CH"
              },
              "priceRange": "$$$$",
              "telephone": "+41 79 000 00 00",
              "openingHours": "Mo-Fr 08:00-18:00",
              "url": "https://swiss-auto-glow.ch"
            })
          }}
        />
      </head>
      <body>
        <StatsTracker />
        <WhatsAppButton />
        <Header />
        <main style={{ minHeight: "80vh", position: "relative", zIndex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
