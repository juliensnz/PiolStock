import StyledComponentsRegistry from '@/lib/registry';
import type {Metadata} from 'next';
import {Lato} from 'next/font/google';
import {Analytics} from '@vercel/analytics/react';

const lato = Lato({weight: ['300', '400', '700'], subsets: ['latin']});

export const metadata: Metadata = {
  title: 'PeePooBoo',
  description: 'PeePooBoo tracking app',
  // viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
  manifest: '/manifest.json',
  // themeColor: '#000000',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{margin: 0}} className={lato.className}>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        <Analytics />
      </body>
    </html>
  );
}
