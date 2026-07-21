import type { Metadata } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const sg = Space_Grotesk({ subsets:['latin'], variable:'--font-space-grotesk' });
const inter = Inter({ subsets:['latin'], variable:'--font-inter' });
const jb = JetBrains_Mono({ subsets:['latin'], variable:'--font-jetbrains' });

export const metadata: Metadata = {
  title: 'Tendrlo — Post a project. Get real bids from verified contractors.',
  description: 'B2B tendering marketplace for construction, engineering, industrial services, food, materials and more.',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: '/apple-touch-icon.png',
  },
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