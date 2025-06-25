import React from 'react';
import BlogCard from './BlogCard';

interface BlogListProps {
  blogs?: any[];
}

const BlogList: React.FC<BlogListProps> = ({ blogs = [] }) => {
  if (blogs.length === 0) {
    return (
      <section className="section" id="blog">
        <div className="cards-container">
          <div className="empty-state">
            <h3>No blog posts available</h3>
            <p>Check back soon for inspiring stories and insights from the running community!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section" id="blog">
      <div className="cards-container">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} post={{
            id: blog.id,
            title: blog.title,
            snippet: blog.excerpt,
            date: blog.publishDate,
            image: blog.featuredImage,
            subheadline: blog.category
          }} />
        ))}
      </div>
      <div className="section-footer">
        <a 
          href="/blog" 
          className="view-all-button"
          style={{ backgroundColor: 'var(--blog-purple)' }}
        >
          View All Posts
        </a>
      </div>
    </section>
  );
};

export default BlogList;