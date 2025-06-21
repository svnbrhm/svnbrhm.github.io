import React, { useState, useEffect } from 'react';
import { NextPage, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import CrewList from '../../components/Crew/CrewList';
import { Crew } from '../../types/crew';
import airtableService from '../../lib/airtable';
import { mockCrews } from '../../lib/mockData';
import { getRandomCrewHeroImage } from '../../lib/randomImageUtils';


// Create a Hero component specifically for the crews page
const CrewsHero: React.FC<{ onSearch?: (query: string) => void }> = ({ onSearch }) => {
  const [heroBackground, setHeroBackground] = useState('/images/hero-bg.jpg');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Set random crew photo as background
    const loadRandomImage = async () => {
      const randomImage = await getRandomCrewHeroImage();
      setHeroBackground(randomImage);
    };
    loadRandomImage();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <section
      className="hero crews-hero"
      style={{
        backgroundImage: `url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '70vh',
        minHeight: '500px'
      }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content fade-in">
        <h1>DISCOVER RUNNING CREWS WORLDWIDE</h1>
        <p>Find and connect with running communities in your area and beyond</p>
        <form onSubmit={handleSearch} className="hero-search">
          <input 
            type="text" 
            placeholder="Search crews by name, continent, country, city..." 
            className="hero-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="hero-search-button">
            🔍
          </button>
        </form>
      </div>
    </section>
  );
};

interface CrewsPageProps {
  crews: Crew[];
}

const CrewsPage: NextPage<CrewsPageProps> = ({ crews }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Extract city parameter from URL and set as initial search query
  useEffect(() => {
    if (router.isReady && router.query.city) {
      const cityQuery = Array.isArray(router.query.city) ? router.query.city[0] : router.query.city;
      setSearchQuery(cityQuery);
    }
  }, [router.isReady, router.query.city]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Scroll to the crew list section when search is performed
    const crewListSection = document.querySelector('.crew-overview-section');
    if (crewListSection) {
      crewListSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Head>
        <title>Running Crews - Find Your Local Running Community</title>
        <meta name="description" content="Discover running crews and communities around the world. Find your local running group and join the community." />
      </Head>
      
      {/* Remove duplicate Header and Footer - they're handled in _app.tsx */}
      <CrewsHero onSearch={handleSearch} />
      <main>
        <CrewList crews={crews} initialSearchQuery={searchQuery} />
      </main>
    </>
  );
};

// Static Site Generation - Pre-build all crew data at build time
export const getStaticProps: GetStaticProps<CrewsPageProps> = async () => {
  console.log('Starting getStaticProps for crews page...');
  
  try {
    console.log('Attempting to fetch crews from Airtable...');
    // Fetch all crews from Airtable with media data for images
    const crews = await airtableService.getAllCrewsWithMedia();
    
    console.log('Successfully fetched crews:', crews.length, 'crews');
    
    return {
      props: {
        crews,
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error fetching crews for static generation:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown'
    });
    
    // Fallback to mock data if there's an error
    console.log('Falling back to mock data...');
    return {
      props: {
        crews: mockCrews,
      },
      revalidate: 86400,
    };
  }
};

export default CrewsPage;
