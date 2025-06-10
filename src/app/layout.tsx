import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import '@/styles/globals.css';
import { ApolloWrapper } from '@/lib/apollo/apollo-wrapper';
import { I18nProvider } from '@/lib/i18n';
import { HeaderWrapper, FooterWrapper } from '@/components/layout';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Beykush - Ukrainian Premium Wines',
    template: '%s | Beykush',
  },
  description:
    'Discover premium Ukrainian wines from Beykush winery. Shop our collection of red, white, and rosé wines crafted in the heart of Ukraine.',
  keywords: ['Ukrainian wine', 'Beykush', 'premium wine', 'вино', 'українське вино'],
  authors: [{ name: 'Beykush Winery' }],
  creator: 'Beykush',
  publisher: 'Beykush',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://beykush.com'),
  openGraph: {
    title: 'Beykush - Ukrainian Premium Wines',
    description: 'Discover premium Ukrainian wines from Beykush winery.',
    url: 'https://beykush.com',
    siteName: 'Beykush',
    locale: 'uk_UA',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className={`${inter.variable} ${playfair.variable}`}>
      <body className={inter.className}>
        <I18nProvider>
          <ApolloWrapper>
            <div className="min-h-screen flex flex-col">
              <HeaderWrapper />
              <main className="flex-grow">{children}</main>
              <FooterWrapper />
            </div>
          </ApolloWrapper>
        </I18nProvider>
      </body>
    </html>
  );
}
