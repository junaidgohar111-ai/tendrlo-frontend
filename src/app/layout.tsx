import type { Metadata } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const sg = Space_Grotesk({ subsets:['latin'], variable:'--font-space-grotesk' });
const inter = Inter({ subsets:['latin'], variable:'--font-inter' });
const jb = JetBrains_Mono({ subsets:['latin'], variable:'--font-jetbrains' });

export const metadata = {
  title: {
    default: 'Tendrlo — Post a project. Get real bids from verified contractors.',
    template: '%s | Tendrlo',
  },
  description: 'B2B tendering marketplace for construction, engineering, HVAC, MEP, civil works, food and materials in Saudi Arabia and Pakistan. Post projects free, get competitive bids.',
  keywords: ['tendering', 'contractors', 'construction', 'Saudi Arabia', 'KSA', 'HVAC', 'MEP', 'civil engineering', 'bids', 'projects'],
  openGraph: {
    title: 'Tendrlo — Post a project. Get real bids from verified contractors.',
    description: 'B2B tendering marketplace for construction, engineering and industrial services.',
    url: 'https://www.tendrlo.com',
    siteName: 'Tendrlo',
    images: [{ url: 'https://tendrlo.s3.ap-southeast-1.amazonaws.com/Blue+Modern+Playful+Typographic+Patisserie+Logo+.png', width: 1080, height: 1080 }],
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: '/apple-touch-icon.png',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sg.variable} ${inter.variable} ${jb.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any"/>
        <link rel="icon" href="/favicon-32x32.png" type="image/png"/>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png"/>
      </head>
      <body>{children}</body>
    </html>
  );
}