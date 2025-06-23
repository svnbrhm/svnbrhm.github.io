import React, { useState, useEffect } from 'react';
import { NextPage, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import CrewList from '../../components/Crew/CrewList';
import { Crew } from '../../types/crew';
import airtableService, { CrewWithImages } from '../../lib/airtable';
import { getDefaultCrewLogo, getDefaultCrewPicture } from '../../lib/imageUtils';
import { mockCrews } from '../../lib/mockData';
import { getRandomCrewHeroImage } from '../../lib/randomImageUtils';
import CrewCard from '../../components/Crew/CrewCard';


// Create a Hero component specifically for the crews page
const CrewsHero: React.FC<{ onSearch?: (query: string) => void }> = ({ onSearch }) => {
  const [heroBackground, setHeroBackground] = useState('/images/hero-bg.svg');
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
  featuredCrews: CrewWithImages[];
  allCrews: Crew[];
  totalCount: number;
}

const CrewsPage: NextPage<CrewsPageProps> = ({ featuredCrews, allCrews, totalCount }) => {
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
        {/* Featured Crews Section */}
        {featuredCrews.length > 0 && (
          <section className="featured-crews mb-12">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8">Featured Crews</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredCrews.map(crew => (
                  <CrewCard key={crew.id} crew={crew} priority />
                ))}
              </div>
            </div>
          </section>
        )}
        
        {/* All Crews Section */}
        <section className="crew-list-section">
          <div className="container">
            <CrewList allCrews={allCrews} />
          </div>
        </section>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  try {
    console.log('=== FETCHING CREW DATA FOR STATIC GENERATION WITH ISR ===');
    
    // Get featured crews with images (limited to prevent timeout)
    const featuredCrews = await airtableService.getCrewsWithImages({
      featured: true,
      limit: 10,
      includeImages: true
    });
    
    // Get all crews without images for basic listing (much faster)
    const allCrews = await airtableService.getAllCrews();
    
    console.log(`Successfully fetched ${featuredCrews.length} featured crews and ${allCrews.length} total crews`);
    
    return {
      props: {
        featuredCrews,
        allCrews,
        totalCount: allCrews.length,
      },
      // Enable ISR - regenerate page every 24 hours
      revalidate: 604800, // 7 days (weekly) - images change less frequently in seconds
    };
  } catch (error) {
    console.error('Error in getStaticProps for crews page:', error);
    
    // Fallback to mock data to prevent build failure
    const mockCrews = [
      {
        id: 'mock-1',
        name: 'Sample Running Crew',
        city: 'Sample City',
        country: 'Sample Country',
        description: 'This is a sample crew for fallback purposes.',
        logoUrl: getDefaultCrewLogo(),
        heroImageUrl: getDefaultCrewPicture(),
        instagramUrl: '',
        homepageUrl: '',
        featured: false,
        slug: 'sample-crew'
      }
    ];
    
    return {
      props: {
        featuredCrews: [],
        allCrews: mockCrews,
        totalCount: mockCrews.length,
      },
      // Still enable ISR even for fallback
      revalidate: 86400, // 24 hours in case of fallback (more frequent for error recovery)
    };
  }
};

export default CrewsPage;
