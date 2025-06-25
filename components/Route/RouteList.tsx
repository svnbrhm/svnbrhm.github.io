import React from 'react';
import RouteCard from './RouteCard';

interface RouteListProps {
  routes?: any[];
}

const RouteList: React.FC<RouteListProps> = ({ routes = [] }) => {
  if (routes.length === 0) {
    return (
      <section className="section" id="routes">
        <div className="cards-container">
          <div className="empty-state">
            <h3>No routes available</h3>
            <p>Check back soon for amazing running routes from crews worldwide!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section" id="routes">
      <div className="cards-container">
        {routes.map((route) => (
          <RouteCard key={route.id} route={route} />
        ))}
      </div>
      <div className="section-footer">
        <a 
          href="/routes" 
          className="view-all-button"
          style={{ backgroundColor: 'var(--routes-green)' }}
        >
          View All Routes
        </a>
      </div>
    </section>
  );
};

export default RouteList;