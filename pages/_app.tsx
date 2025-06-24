import '../styles/globals.css';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';
import { useEffect } from 'react';

import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import GlobalErrorBoundary from '../components/GlobalErrorBoundary';
import '../styles/components/hero.css';
import '../styles/globals.css';
import 'leaflet/dist/leaflet.css';

function MyApp({ Component, pageProps }: AppProps) {
  // Performance monitoring removed to prevent false error reports

  return (
    <GlobalErrorBoundary>
      <Head>
        <title>Running Crews</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />           {/* Global header for all pages */}
      <Component {...pageProps} />  {/* Page content */}
      <Footer />           {/* Global footer for all pages */}
      <Analytics />
    </GlobalErrorBoundary>
  );
}

export default MyApp;