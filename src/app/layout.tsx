import type { Metadata } from 'next';
import './globals.css';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/context/CartContext';

export const metadata: Metadata = {
  title: {
    template: '%s | TRUCKORA — Commercial Truck Spare Parts',
    default: 'TRUCKORA | Truck Parts. Trusted Supply. European Commercial Spares Hub',
  },
  description:
    'Dedicated European B2B distributor of genuine OEM, factory-reconditioned, and tested used truck spare parts for DAF, Volvo, Scania, Mercedes-Benz, MAN, IVECO, and Renault Trucks.',
  keywords: [
    'truck spare parts',
    'DAF parts',
    'Volvo FH truck parts',
    'Scania R series parts',
    'Mercedes Actros parts',
    'truck gearbox',
    'truck turbocharger',
    'commercial vehicle salvage',
    'European truck parts',
    'OEM truck spares',
  ],
  authors: [{ name: 'TRUCKORA European B.V.' }],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://truckora.eu',
    siteName: 'TRUCKORA Commercial Vehicle Spares',
    title: 'TRUCKORA | Truck Parts. Trusted Supply.',
    description:
      'European distributor of verified OEM, refurbished, and tested used commercial truck spare parts.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* Structured Data: Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'AutoPartsStore',
              name: 'TRUCKORA',
              alternateName: 'TRUCKORA European Commercial Parts',
              url: 'https://truckora.eu',
              logo: 'https://truckora.eu/logo.png',
              description:
                'European commercial truck spare parts distribution hub for DAF, Volvo, Scania, Mercedes-Benz, MAN, IVECO, and Renault.',
              telephone: '+31105554900',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Port Logistics Zone 4',
                addressLocality: 'Rotterdam',
                postalCode: '3088 HD',
                addressCountry: 'NL',
              },
              currenciesAccepted: 'EUR',
              paymentAccepted: 'Credit Card, Bank Transfer (SEPA B2B)',
              priceRange: '€€',
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-truckora-bg text-truckora-text antialiased">
        <CartProvider>
          <AnnouncementBar />
          <Header />
          <Navigation />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
