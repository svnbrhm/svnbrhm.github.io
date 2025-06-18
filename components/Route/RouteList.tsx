import React from 'react';
import RouteCard from './RouteCard';

const routes = [
  { 
    id: "1", 
    title: "Central Park Loop", 
    city: "New York City", 
    distance: "6.1 km", 
    snippet: "Eine klassische Runde durch Manhattans grünes Herz, perfekt für abwechslungsreiches Terrain.",
    image: "https://images.pexels.com/photos/3766204/pexels-photo-3766204.jpeg",
    subheadline: "Manhattan's grünes Herz",
    area: "Central Park"
  },
  { 
    id: "2", 
    title: "Tiergarten Trail", 
    city: "Berlin", 
    distance: "5.5 km", 
    snippet: "Eine friedliche Route durch Berlins größten Park mit baumgesäumten Wegen.",
    image: "https://images.pexels.com/photos/3764154/pexels-photo-3764154.jpeg",
    subheadline: "Berlins grüne Oase",
    area: "Tiergarten"
  },
  { 
    id: "3", 
    title: "Imperial Palace Circuit", 
    city: "Tokyo", 
    distance: "5.0 km", 
    snippet: "Laufe um die Kaiserresidenz auf dieser beliebten Route mit tollen Aussichten.",
    image: "https://images.pexels.com/photos/204546/pexels-photo-204546.jpeg",
    subheadline: "Rund um den Kaiserpalast",
    area: "Imperial Palace"
  },
  { 
    id: "4", 
    title: "Thames Riverside Path", 
    city: "London", 
    distance: "12.8 km", 
    snippet: "Eine Strecke entlang der Themse, vorbei an ikonischen Wahrzeichen wie der Tower Bridge.",
    image: "https://images.pexels.com/photos/5038818/pexels-photo-5038818.jpeg",
    subheadline: "Entlang der Themse",
    area: "Thames Path"
  },
];

const RouteList = () => {
  return (
    <section className="section" id="routes">
      <h2 className="section-title">Discover Running Routes</h2>
      <div className="card-grid">
        {routes.map((route) => (
          <RouteCard key={route.id} route={route} />
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <a 
          href="/routes" 
          className="cta-button" 
          style={{ backgroundColor: 'var(--route-green)' }}
        >
          Alle Routen entdecken
        </a>
      </div>
    </section>
  );
};

export default RouteList;