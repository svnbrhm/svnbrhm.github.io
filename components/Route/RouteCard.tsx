import React from 'react';

interface RouteCardProps {
  route: {
    id: string;
    title: string;
    city: string;
    distance: string;
    snippet: string;
    image?: string;
    subheadline?: string;
  };
}

const RouteCard: React.FC<RouteCardProps> = ({ route }) => {
  return (
    <div className="info-card route-card cursor-pointer" onClick={() => window.location.href = `/routes/${route.id}`}>
      {/* Top Section: Route Image with Headline Overlay */}
      <div 
        className="info-card-image" 
        style={{ 
          backgroundImage: route.image ? `url(${route.image})` : 'linear-gradient(135deg, #6B8E23 0%, #8B7D6B 100%)',
          position: 'relative'
        }}
      >
        <div style={{
          position: 'absolute',
          bottom: '0.5rem',
          left: '1rem',
          right: '1rem',
          color: 'white',
          padding: '0.75rem 1rem'
        }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: 'bold',
            color: '#f5f5f5',
            lineHeight: '1.25',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
            margin: 0
          }}>{route.title}</h3>
        </div>
      </div>
      
      {/* Info Section */}
      <div className="info-card-content">
        {/* Distance & Location Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="card-badge route-badge">
            {route.distance}
          </span>
          <span className="card-badge route-badge">
            {route.city}
          </span>
        </div>
        
        {/* Subheadline */}
        {route.subheadline && (
          <h4 className="info-card-title">{route.subheadline}</h4>
        )}
        
        {/* Snippet */}
        <p className="info-card-snippet">{route.snippet}</p>
        
        {/* CTA Button */}
        <div className="info-card-footer">
          <span className="info-card-cta">Explore Route...</span>
        </div>
      </div>
    </div>
  );
};

export default RouteCard;