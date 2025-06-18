import '../styles/globals.css';
import Head from 'next/head';
import type { AppProps } from 'next/app';

import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import '../styles/components/hero.css';
import 'leaflet/dist/leaflet.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Running Crews</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />           {/* Global header for all pages */}
      <Component {...pageProps} />  {/* Page content */}
      <Footer />           {/* Global footer for all pages */}
    </>
  );
}

export default MyApp;