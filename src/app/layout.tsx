import type {Metadata} from 'next';
import {Lato} from 'next/font/google';
import {Analytics} from '@vercel/analytics/react';
import './globals.css';

const lato = Lato({weight: ['300', '400', '700'], subsets: ['latin']});

export const metadata: Metadata = {
  title: 'PeePooBoo',
  description: 'PeePooBoo tracking app',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={lato.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
