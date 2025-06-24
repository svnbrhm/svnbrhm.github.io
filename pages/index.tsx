import { NextPage, GetStaticProps } from 'next';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { NextPage, GetStaticProps } from 'next';
// Remove duplicate import since it's already imported at the top
import Hero from '../components/Hero';
import Statistics from '../components/Statistics';
import CrewListHomepage from '../components/Crew/CrewListHomepage';
import BlogList from '../components/Blog/BlogList';
import EventList from '../components/Event/EventList';
import RouteList from '../components/Route/RouteList';
import { Crew } from '../types/crew';
import airtableService from '../lib/airtable';
import { mockCrews } from '../lib/mockData';

const WorldMap = dynamic(() => import('../components/Map/WorldMap'), { ssr: false });

interface HomeProps {
  crews: Crew[];
}

const Home: NextPage<HomeProps> = ({ crews }) => {
  // Monitor Core Web Vitals
  useEffect(() => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime);
          }
        });
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      
      return () => observer.disconnect();
    }
  }, []);

  return (
    <main className="homepage">
      <Hero />
      
      {/* Statistics moved between Hero and Map */}
      <section className="homepage-section">
        <Statistics />
      </section>
      
      <div className="section-divider"></div>
      
      {/* Kompaktere Sektion-Abstände */}
      <section className="homepage-section">
        <WorldMap />
      </section>
      
      <div className="section-divider"></div>
      
      <section className="homepage-section">
        <CrewListHomepage crews={crews} />
      </section>
      
      <div className="section-divider"></div>
      
      <section className="homepage-section">
        <BlogList />
      </section>
      
      <div className="section-divider"></div>
      
      <section className="homepage-section">
        <EventList />
      </section>
      
      <div className="section-divider"></div>
      
      <section className="homepage-section">
        <RouteList />
      </section>
    </main>
  );
};

// Static Site Generation - Pre-build crew data at build time
export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    // Fetch crews with optimized image loading to prevent timeouts
    const crews = await airtableService.getCrewsWithImages({ limit: 20, includeImages: true });
    
    return {
      props: {
        crews: crews || mockCrews, // Fallback to mock data if Airtable fails
      },
      // Revalidate every 24 hours
      revalidate: 86400,
    };
  } catch (error) {
    console.error('Error fetching crews for homepage:', error);
    
    // Fallback to mock data if there's an error
    return {
      props: {
        crews: mockCrews,
      },
      revalidate: 86400,
    };
  }
};

export default Home;