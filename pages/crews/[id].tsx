import React from 'react';
import { GetStaticProps, GetStaticPaths, NextPage } from 'next';
import Head from 'next/head';
import CrewDetail from '../../components/Crew/CrewDetail';
import { Crew, RunningRoute } from '../../types/crew';
import airtableService from '../../lib/airtable';
import { mockCrews } from '../../lib/mockData';

interface CrewPageProps {
  crew: Crew | null;
  otherCrewsInCity?: Crew[];
  relatedRoutes?: RunningRoute[];
}

const CrewPage: NextPage<CrewPageProps> = ({ crew, otherCrewsInCity, relatedRoutes }) => {

  if (!crew) {
    return (
      <>
        <Head>
          <title>Crew Not Found | Running Crews</title>
        </Head>
        <div className="crew-error">
          <div className="error-content">
            <h1>Crew Not Found</h1>
            <p>The requested crew could not be found.</p>
            <a href="/crews" className="back-to-crews-btn">
              Back to All Crews
            </a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{crew.CrewName} | Running Crews</title>
        <meta name="description" content={crew.CrewStoryExcerpt || `Join ${crew.CrewName} running crew in ${crew.City}, ${crew.Country}`} />
        <meta property="og:title" content={crew.CrewName} />
        <meta property="og:description" content={crew.CrewStoryExcerpt || `Join ${crew.CrewName} running crew in ${crew.City}, ${crew.Country}`} />
        <meta property="og:image" content={crew.PrimaryImageUrl || '/images/default-crew-og.jpg'} />
      </Head>
      <CrewDetail crew={crew} otherCrewsInCity={otherCrewsInCity} relatedRoutes={relatedRoutes} />
    </>
  );
};

// Generate static paths for all crews at build time
export const getStaticPaths: GetStaticPaths = async () => {
  try {
    // Fetch all crews to generate paths
    const crews = await airtableService.getAllCrews();
    
    // Generate paths for all crew IDs
    const paths = (crews || mockCrews).map((crew) => ({
      params: { id: crew.id },
    }));

    return {
      paths,
      // Enable ISR - generate pages on-demand if not pre-built
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('Error generating static paths:', error);
    
    // Fallback to mock data paths
    const paths = mockCrews.map((crew) => ({
      params: { id: crew.id },
    }));

    return {
      paths,
      fallback: 'blocking',
    };
  }
};

// Generate static props for each crew page
export const getStaticProps: GetStaticProps<CrewPageProps> = async ({ params }) => {
  const id = params?.id as string;
  
  if (!id) {
    return {
      notFound: true,
    };
  }

  try {
    // Fetch specific crew data by ID - skip media during build to prevent timeouts
    const isStaticGeneration = process.env.NODE_ENV === 'production' && !params?.preview;
    const crew = await airtableService.getCrewById(id, !isStaticGeneration);
    
    if (!crew) {
      // Try to find in mock data as fallback
      const mockCrew = mockCrews.find(c => c.id === id);
      
      if (!mockCrew) {
        return {
          notFound: true,
        };
      }
      
      return {
        props: {
          crew: mockCrew,
          relatedRoutes: [], // No routes available in fallback
        },
        // Revalidate every 24 hours
        revalidate: 86400,
      };
    }

    // Fetch other crews in the same city
    let otherCrewsInCity: Crew[] = [];
    try {
      const allCrewsInCity = await airtableService.getCrewsByCity(crew.City);
      // Filter out the current crew
      otherCrewsInCity = allCrewsInCity.filter(c => c.id !== crew.id);
    } catch (error) {
      console.warn(`Failed to fetch other crews in ${crew.City}:`, error);
      // Use mock data as fallback
      otherCrewsInCity = mockCrews.filter(c => c.City === crew.City && c.id !== crew.id);
    }

    // Fetch related running routes
    let relatedRoutes: RunningRoute[] = [];
    try {
      relatedRoutes = await airtableService.getRandomRoutes(3);
    } catch (error) {
      console.warn('Failed to fetch related routes:', error);
      // Routes are optional, so we can continue without them
      relatedRoutes = [];
    }

    return {
      props: {
        crew,
        otherCrewsInCity,
        relatedRoutes,
      },
      // Revalidate every 24 hours (86400 seconds)
      // Since crew data is updated monthly/quarterly, this is sufficient
      revalidate: 86400,
    };
  } catch (error) {
    console.error(`Error fetching crew ${id}:`, error);
    
    // Try mock data as fallback
    const mockCrew = mockCrews.find(c => c.id === id);
    
    if (!mockCrew) {
      return {
        notFound: true,
      };
    }
    
    // Get other crews in the same city from mock data
    const otherCrewsInCity = mockCrews.filter(c => c.City === mockCrew.City && c.id !== mockCrew.id);
    
    return {
      props: {
        crew: mockCrew,
        otherCrewsInCity,
        relatedRoutes: [], // No routes available in fallback
      },
      revalidate: 86400,
    };
  }
};

export default CrewPage;