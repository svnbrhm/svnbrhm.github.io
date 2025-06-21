import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import PageHero from '../../components/Hero/PageHero';
import RouteList from '../../components/Route/RouteList';
import { getRandomCrewHeroImage } from '../../lib/randomImageUtils';


const RoutesPage: NextPage = () => {
  const [heroBackground, setHeroBackground] = useState<string>('');

  useEffect(() => {
    // Set random crew photo as background on each page visit
    const loadRandomImage = async () => {
      const randomImage = await getRandomCrewHeroImage();
      setHeroBackground(randomImage);
    };
    loadRandomImage();
  }, []);

  return (
    <>
      <Head>
        <title>Routes - Running Crews</title>
        <meta name="description" content="Explore popular running routes and trails shared by crews worldwide" />
      </Head>

      <PageHero
        title="ROUTES"
        subtitle="Explore popular running routes and trails shared by crews worldwide"
        backgroundImage={heroBackground}
        height="large"
      />

      <main className="container mx-auto px-4 py-8">
        <RouteList />
      </main>
    </>
  );
};

export default RoutesPage;