import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ashar Rahman — Founding Engineer & AI Builder',
  description:
    'Founding Engineer and full-stack AI builder. Previously at Aviary AI (YC S22), $3M ARR. Building Local — an AI-native concierge for NYC. Based in New York.',
  keywords: [
    'Ashar Rahman',
    'Founding Engineer',
    'Full Stack Developer',
    'AI Engineer',
    'Next.js',
    'React',
    'LangGraph',
    'RAG',
    'New York',
    'Portfolio',
  ],
  authors: [{ name: 'Ashar Rahman', url: 'https://asharrahman.com' }],
  openGraph: {
    title: 'Ashar Rahman — Founding Engineer & AI Builder',
    description: 'Building AI-native products from 0→1.',
    type: 'website',
    url: 'https://asharrahman.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ashar Rahman — Founding Engineer & AI Builder',
    description: 'Building AI-native products from 0→1.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
