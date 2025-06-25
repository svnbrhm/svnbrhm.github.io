import React from 'react';
import { NextPage, GetStaticProps } from 'next';
import Head from 'next/head';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import BlogList from '../../components/Blog/BlogList';
import { airtableService } from '../../lib/airtable';

interface BlogPageProps {
  blogs: any[];
}

const BlogPage: NextPage<BlogPageProps> = ({ blogs }) => {
  return (
    <>
      <Head>
        <title>Blog - Running Crews</title>
        <meta name="description" content="Read stories, tips, and insights from the running community" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="page-hero blog">
          <div className="hero-content">
            <h1 className="hero-title">RUNNING BLOG</h1>
            <p className="hero-subtitle">Stories, tips, and insights from the community</p>
          </div>
        </section>

        <BlogList blogs={blogs} />
      </main>

      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  try {
    const blogs = await airtableService.getAllBlogs();
    
    return {
      props: {
        blogs,
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return {
      props: {
        blogs: [],
      },
      revalidate: 3600,
    };
  }
};

export default BlogPage;