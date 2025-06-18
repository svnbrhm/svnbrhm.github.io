import React from 'react';
import BlogCard from './BlogCard';

const blogs = [
  { 
    id: "1", 
    title: "Von der Couch zum 5K", 
    date: "2024-12-05", 
    snippet: "Wie der Beitritt zu einer lokalen Laufgruppe meine Fitness-Reise verändert hat...", 
    image: "https://images.pexels.com/photos/3764558/pexels-photo-3764558.jpeg",
    subheadline: "Meine Reise mit den Berlin Runners"
  },
  { 
    id: "2", 
    title: "Marathon-Trainingstipps", 
    date: "2024-11-28", 
    snippet: "Erfahrene Läufer der Brooklyn Street Runners teilen ihre besten Tipps...", 
    image: "https://images.pexels.com/photos/3764154/pexels-photo-3764154.jpeg",
    subheadline: "Von NYC-Veteranen"
  },
  { 
    id: "3", 
    title: "Die Magie des Nachtlaufs", 
    date: "2024-11-20", 
    snippet: "Entdecke, warum Tokios neonbeleuchtete Straßen die perfekte Kulisse bieten...", 
    image: "https://images.pexels.com/photos/204546/pexels-photo-204546.jpeg",
    subheadline: "Nachtlauf in Tokyo"
  },
  { 
    id: "4", 
    title: "Laufgruppen weltweit", 
    date: "2024-11-15", 
    snippet: "Ein Blick auf die vielfältigen Laufgemeinschaften rund um den Globus...", 
    image: "https://images.pexels.com/photos/5038818/pexels-photo-5038818.jpeg",
    subheadline: "Globale Community"
  },
];

const BlogList = () => {
  return (
    <section className="section" id="blog">
      <h2 className="section-title">Community Stories</h2>
      <div className="card-grid">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} post={blog} />
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <a 
          href="/blog" 
          className="cta-button" 
          style={{ backgroundColor: 'var(--blog-orange)' }}
        >
          Alle Stories lesen
        </a>
      </div>
    </section>
  );
};

export default BlogList;