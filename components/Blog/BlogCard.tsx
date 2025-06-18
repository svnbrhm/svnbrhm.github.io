import React from 'react';

interface BlogCardProps {
  post: {
    id: string;
    title: string;
    date: string;
    snippet: string;
    image?: string;
    subheadline?: string;
  };
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <div className="info-card blog-card cursor-pointer" onClick={() => window.location.href = `/blog/${post.id}`}>
      {/* Top Section: Article Image with Headline Overlay */}
      <div 
        className="info-card-image" 
        style={{ 
          backgroundImage: post.image ? `url(${post.image})` : 'linear-gradient(135deg, #F7C75C 0%, #F29D4E 100%)',
          position: 'relative'
        }}
      >
        <div style={{
          position: 'absolute',
          bottom: '0.5rem',
          left: '1rem',
          right: '1rem',
          background: 'transparent',
          color: '#f5f5f5',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          backdropFilter: 'none'
        }}>
          <h3 className="font-bold leading-tight" style={{ 
            color: '#f5f5f5',
            fontSize: '1.1rem',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
            margin: 0
          }}>{post.title}</h3>
        </div>
      </div>
      
      {/* Info Section */}
      <div className="info-card-content">
        {/* Publication Date Badge */}
        <div className="mb-4"> {/* Changed from mb-3 to mb-4 for more spacing */}
          <span className="card-badge blog-badge">
            {new Date(post.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        </div>
        
        {/* Subheadline */}
        {post.subheadline && (
          <h4 className="info-card-title">{post.subheadline}</h4>
        )}
        
        {/* Snippet */}
        <p className="info-card-snippet">{post.snippet}</p>
        
        {/* CTA Button */}
        <div className="info-card-footer">
          <span className="info-card-cta">Read More...</span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;