import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import { inter } from '@/lib/fonts';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: '🎄 My Christmas Stage',
  description: '내 크리스마스 무대 취향 테스트 🎶',
  openGraph: {
    title: '🎄 My Christmas Stage',
    description: '크리스마스 무대 취향 테스트 결과를 확인해보세요!',
    url: 'https://my-christmas-stage.vercel.app/',
    siteName: 'My Christmas Stage',
    images: [
      {
        url: 'https://my-christmas-stage.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'My Christmas Stage',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

