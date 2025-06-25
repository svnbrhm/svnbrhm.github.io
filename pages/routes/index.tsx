import React, { useState, useEffect } from 'react';
import { NextPage, GetStaticProps } from 'next';
import Head from 'next/head';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import RouteList from '../../components/Route/RouteList';
import { airtableService } from '../../lib/airtable';

interface RoutesPageProps {
  routes: any[];
}

const RoutesPage: NextPage<RoutesPageProps> = ({ routes }) => {
  return (
    <>
      <Head>
        <title>Running Routes - Running Crews</title>
        <meta name="description" content="Discover amazing running routes from crews around the world" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="page-hero routes">
          <div className="hero-content">
            <h1 className="hero-title">RUNNING ROUTES</h1>
            <p className="hero-subtitle">Discover amazing routes from crews worldwide</p>
          </div>
        </section>

        <RouteList routes={routes} />
      </main>

      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  try {
    const routes = await airtableService.getAllRoutes();
    
    return {
      props: {
        routes,
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error fetching routes:', error);
    return {
      props: {
        routes: [],
      },
      revalidate: 3600,
    };
  }
};

export default RoutesPage;