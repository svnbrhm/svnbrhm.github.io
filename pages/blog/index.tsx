import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import PageHero from '../../components/Hero/PageHero';
import BlogList from '../../components/Blog/BlogList';
import { getRandomCrewHeroImage } from '../../lib/randomImageUtils';

const BlogPage: NextPage = () => {
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
        <title>Blog - Running Crews</title>
        <meta name="description" content="Latest news, stories, and insights from the global running crew community" />
      </Head>

      <PageHero
        title="BLOG"
        subtitle="Latest news, stories, and insights from the global running crew community"
        backgroundImage={heroBackground}
        height="large"
      />

      <main className="container mx-auto px-4 py-8">
        <BlogList />
      </main>
    </>
  );
};

export default BlogPage;