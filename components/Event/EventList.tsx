import React from 'react';
import EventCard from './EventCard';

interface EventListProps {
  events?: any[];
}

const EventList: React.FC<EventListProps> = ({ events = [] }) => {
  if (events.length === 0) {
    return (
      <section className="section" id="events">
        <div className="cards-container">
          <div className="empty-state">
            <h3>No events available</h3>
            <p>Check back soon for exciting running events from crews worldwide!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section" id="events">
      <div className="cards-container">
        {events.map((event) => (
          <EventCard key={event.id} event={{
            id: event.id,
            title: event.eventName,
            date: event.eventStartDate,
            location: `${event.city || ''}${event.city && event.country ? ', ' : ''}${event.country || ''}`.trim(),
            snippet: event.briefDescription,
            image: event.eventImage,
            subheadline: event.eventType?.join(', ') || 'Running Event'
          }} />
        ))}
      </div>
      <div className="section-footer">
        <a 
          href="/events" 
          className="view-all-button"
          style={{ backgroundColor: 'var(--events-blue)' }}
        >
          View All Events
        </a>
      </div>
    </section>
  );
};

export default EventList;