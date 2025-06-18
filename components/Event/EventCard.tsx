import React from 'react';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    date: string;
    location: string;
    snippet: string;
    image?: string;
    subheadline?: string;
  };
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="info-card event-card cursor-pointer" onClick={() => window.location.href = `/events/${event.id}`}>
      {/* Top Section: Event Image with Headline Overlay */}
      <div 
        className="info-card-image" 
        style={{ 
          backgroundImage: event.image ? `url(${event.image})` : 'linear-gradient(135deg, #FF6B3D 0%, #E05A2A 100%)',
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
          }}>{event.title}</h3>
        </div>
      </div>
      
      {/* Info Section */}
      <div className="info-card-content">
        {/* Date & Location Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="card-badge event-badge">
            {new Date(event.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
          <span className="card-badge event-badge">
            {event.location}
          </span>
        </div>
        
        {/* Subheadline */}
        {event.subheadline && (
          <h4 className="info-card-title">{event.subheadline}</h4>
        )}
        
        {/* Snippet */}
        <p className="info-card-snippet">{event.snippet}</p>
        
        {/* CTA Button */}
        <div className="info-card-footer">
          <span className="info-card-cta">Join Event...</span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;