import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Taman San Jaya (成功之园) - Jasa Pembuatan Taman & Tanaman Hias',
  description:
    'Layanan profesional landscape design, perencanaan 3D, pembuatan taman minimalis, tropis, relief tebing alami, air mancur, perawatan berkala, serta katalog tanaman hias berkualitas.',
  keywords: [
    'taman san jaya',
    'jasa pembuatan taman',
    'jasa landscape',
    'tukang taman',
    'perencanaan taman',
    'perawatan taman',
    'katalog tanaman hias',
    'lidah mertua',
    'monstera',
    'relief tebing alami',
  ],
  openGraph: {
    title: 'Taman San Jaya - Jasa Pembuatan Taman & Tanaman Hias',
    description:
      'Solusi taman idaman yang asri, bernilai estetika tinggi, dan bergaransi. Konsultasi gratis via WhatsApp.',
    type: 'website',
    images: [
      {
        url: '/images/proyek-4.avif',
        width: 1200,
        height: 630,
        alt: 'Taman San Jaya Landscape',
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#D8CDAE',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${jakarta.variable}`}>
      <body className="min-h-screen bg-[#F7F4EC] text-brand-earth selection:bg-brand-crimson selection:text-white font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
