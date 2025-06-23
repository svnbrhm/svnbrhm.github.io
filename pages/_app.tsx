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
  useEffect(() => {
    // Report web vitals to our API
    if (typeof window !== 'undefined') {
      // Monitor Core Web Vitals
      const reportWebVitals = ({ name, delta, id }: { name: string, delta: number, id: string }) => {
        fetch('/api/error-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            url: window.location.href,
            metric: name,
            value: delta,
            id: id
          }),
        }).catch(console.error);
      };

      // Setup performance observer
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
              const metric = entry as PerformanceEntry & { id?: string };
              reportWebVitals({
                name: entry.name,
                delta: entry.startTime,
                id: metric.id || ''
              });
            });
          });
          observer.observe({ type: 'largest-contentful-paint', buffered: true });
          observer.observe({ type: 'first-input', buffered: true });
          observer.observe({ type: 'layout-shift', buffered: true });
          
          return () => observer.disconnect();
        } catch (e) {
          console.error('Performance monitoring error:', e);
        }
      }
    }
  }, []);

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