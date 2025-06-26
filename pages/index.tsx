import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { NextPage, GetStaticProps } from 'next';
import Hero from '../components/Hero';
import Statistics from '../components/Statistics';
import CrewListHomepage from '../components/Crew/CrewListHomepage';
import BlogList from '../components/Blog/BlogList';
import EventList from '../components/Event/EventList';
import RouteList from '../components/Route/RouteList';
import { Crew } from '../types/crew';
import { airtableService } from '../lib/airtable';
// Removed mock data imports - using only real Airtable data

const WorldMapFast = dynamic(() => import('../components/Map/WorldMapFast'), { ssr: false });

interface HomeProps {
  crews: Crew[];
  routes: any[];
  events: any[];
  blogs: any[];
}

const Home: NextPage<HomeProps> = ({ crews, routes, events, blogs }) => {
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
        <WorldMapFast 
          className="w-full h-[600px]" 
          initialZoom={2}
          maxCrews={1000}
          enableClustering={true}
        />
      </section>
      
      <div className="section-divider"></div>
      
      <section className="homepage-section">
        <CrewListHomepage crews={crews} />
      </section>
      
      <div className="section-divider"></div>
      
      <section className="homepage-section">
        <BlogList blogs={blogs} />
      </section>
      
      <div className="section-divider"></div>
      
      <section className="homepage-section">
        <EventList events={events} />
      </section>
      
      <div className="section-divider"></div>
      
      <section className="homepage-section">
        <RouteList routes={routes} />
      </section>
    </main>
  );
};

// Static Site Generation - Pre-build data at build time
export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    // Fetch all data in parallel for better performance
    const [crews, routes, events, blogs] = await Promise.all([
      airtableService.getCrewsWithImages({ limit: 100, includeImages: true }),
      airtableService.getAllRoutes(),
      airtableService.getAllEvents(),
      airtableService.getAllBlogs()
    ]);
    
    return {
      props: {
        crews: crews || [],
        routes: routes || [],
        events: events || [],
        blogs: blogs || [],
      },
      // Revalidate every 24 hours
      revalidate: 86400,
    };
  } catch (error) {
    console.error('Error fetching data for homepage:', error);
    
    // Return empty arrays if there's an error
    return {
      props: {
        crews: [],
        routes: [],
        events: [],
        blogs: [],
      },
      revalidate: 86400,
    };
  }
};

export default Home;