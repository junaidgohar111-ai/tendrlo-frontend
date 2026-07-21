import type { Metadata } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const sg = Space_Grotesk({ subsets:['latin'], variable:'--font-space-grotesk' });
const inter = Inter({ subsets:['latin'], variable:'--font-inter' });
const jb = JetBrains_Mono({ subsets:['latin'], variable:'--font-jetbrains' });

export const metadata: Metadata = {
  title: 'Tendrlo — Post a project. Get real bids from verified contractors.',
  description: 'B2B tendering marketplace for construction, engineering, industrial services, food, materials and more.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sg.variable} ${inter.variable} ${jb.variable}`}>
      <body>{children}</body>
    </html>
  );
}
