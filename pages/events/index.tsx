import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import PageHero from '../../components/Hero/PageHero';
import EventList from '../../components/Event/EventList';
import { getRandomCrewPhoto } from '../../lib/imageUtils';

const EventsPage: NextPage = () => {
  const [heroBackground, setHeroBackground] = useState<string>('');

  useEffect(() => {
    // Set random crew photo as background on each page visit
    setHeroBackground(getRandomCrewPhoto());
  }, []);

  return (
    <>
      <Head>
        <title>Events - Running Crews</title>
        <meta name="description" content="Discover running events, races, and meetups from crews around the world" />
      </Head>

      <PageHero
        title="EVENTS"
        subtitle="Discover running events, races, and meetups from crews around the world"
        backgroundImage={heroBackground}
        height="large"
      />

      <main className="container mx-auto px-4 py-8">
        <EventList />
      </main>
    </>
  );
};

export default EventsPage;