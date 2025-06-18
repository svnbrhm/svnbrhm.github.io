import React from 'react';
import EventCard from './EventCard';

const events = [
  { 
    id: "1", 
    title: "Brooklyn Bridge Sunrise Run", 
    date: "2024-12-15", 
    location: "Brooklyn, New York", 
    snippet: "Frühmorgendlicher Lauf über die ikonische Brooklyn Bridge mit atemberaubendem Sonnenaufgang.",
    image: "https://images.pexels.com/photos/3766204/pexels-photo-3766204.jpeg",
    subheadline: "Sonnenaufgang über NYC"
  },
  { 
    id: "2", 
    title: "Berlin Winter Solstice Marathon", 
    date: "2024-12-22", 
    location: "Berlin, Germany", 
    snippet: "Feiere die Wintersonnenwende bei diesem besonderen Marathon durch historische Viertel.",
    image: "https://images.pexels.com/photos/3764154/pexels-photo-3764154.jpeg",
    subheadline: "Wintersonnenwende-Special"
  },
  { 
    id: "3", 
    title: "New Year Tokyo Night Run", 
    date: "2025-01-01", 
    location: "Tokyo, Japan", 
    snippet: "Starte das neue Jahr richtig mit einem spektakulären Mitternachtslauf durch Shibuya.",
    image: "https://images.pexels.com/photos/204546/pexels-photo-204546.jpeg",
    subheadline: "Neujahrs-Spektakel"
  },
  { 
    id: "4", 
    title: "Thames Path Challenge", 
    date: "2025-01-08", 
    location: "London, United Kingdom", 
    snippet: "Bewältige den Thames Path bei dieser malerischen Flussufer-Laufherausforderung.",
    image: "https://images.pexels.com/photos/5038818/pexels-photo-5038818.jpeg",
    subheadline: "Riverside Challenge"
  },
];

const EventList = () => {
  return (
    <section className="section" id="events">
      <h2 className="section-title">Upcoming Runs & Events</h2>
      <div className="card-grid">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <a 
          href="/events" 
          className="cta-button" 
          style={{ backgroundColor: 'var(--event-orange)' }}
        >
          Alle Events entdecken
        </a>
      </div>
    </section>
  );
};

export default EventList;