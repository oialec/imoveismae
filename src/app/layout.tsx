import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";

export const metadata: Metadata = {
  title: {
    default: "Imóveis em Peruíbe | Parcelamento Direto com Proprietário — Selma Villar",
    template: "%s | Selma Villar Imóveis Peruíbe",
  },
  description: "Compre sua casa em Peruíbe sem banco e sem consulta de crédito. Parcelamento direto com o proprietário, contrato registrado em cartório e acompanhamento jurídico. Fale com a Selma.",
  keywords: [
    "imóveis Peruíbe", "comprar casa sem banco", "parcelamento direto proprietário",
    "casa própria nome sujo", "imóveis Peruíbe parcela direto", "sair do aluguel Peruíbe",
    "comprar imóvel sem comprovar renda", "casa à venda Itanhaém parcelada",
    "imóvel sem financiamento bancário", "corretora Peruíbe",
    "vender imóvel Peruíbe", "corretora de imóveis Peruíbe CRECI",
    "casa praia Peruíbe", "litoral sul SP"
  ],
  authors: [{ name: "Selma Villar - Corretora CRECI 167207-F" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://imoveismae.vercel.app",
    siteName: "Selma Villar Imóveis",
    title: "Imóveis em Peruíbe | Parcelamento Direto com Proprietário",
    description: "Compre sua casa sem banco e sem consulta de crédito. Parcelamento direto com o proprietário. Corretora Selma Villar CRECI 167207-F.",
    images: [{ url: "/images/hero-peruibe.jpg", width: 1200, height: 630, alt: "Imóveis em Peruíbe - Selma Villar" }],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://imoveismae.vercel.app" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Selma Villar - Corretora de Imóveis",
  description: "Corretora de imóveis em Peruíbe especializada em parcelamento direto com o proprietário. Formada em Direito, segurança jurídica em toda negociação.",
  url: "https://imoveismae.vercel.app",
  telephone: "+5513997158810",
  address: { "@type": "PostalAddress", addressLocality: "Peruíbe", addressRegion: "SP", addressCountry: "BR" },
  areaServed: ["Peruíbe", "Itanhaém", "Mongaguá", "Praia Grande"],
  priceRange: "$$",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="font-body bg-white text-cinza-escuro min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
