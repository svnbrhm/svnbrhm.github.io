import React from 'react';
import { NextPage, GetStaticProps } from 'next';
import Head from 'next/head';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import EventList from '../../components/Event/EventList';
import { airtableService } from '../../lib/airtable';

interface EventsPageProps {
  events: any[];
}

const EventsPage: NextPage<EventsPageProps> = ({ events }) => {
  return (
    <>
      <Head>
        <title>Running Events - Running Crews</title>
        <meta name="description" content="Discover running events and races from crews around the world" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="page-hero events">
          <div className="hero-content">
            <h1 className="hero-title">RUNNING EVENTS</h1>
            <p className="hero-subtitle">Join amazing events and races worldwide</p>
          </div>
        </section>

        <EventList events={events} />
      </main>

      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  try {
    const events = await airtableService.getAllEvents();
    
    return {
      props: {
        events,
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error fetching events:', error);
    return {
      props: {
        events: [],
      },
      revalidate: 3600,
    };
  }
};

export default EventsPage;