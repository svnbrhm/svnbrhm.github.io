import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Crew } from '@/types/crew';
import CrewCard from './CrewCard';

interface CrewListHomepageProps {
  crews: Crew[];
}

// Utility function to get random crews
const getRandomCrews = (crews: Crew[], count: number): Crew[] => {
  const shuffled = [...crews].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const CrewListHomepage: React.FC<CrewListHomepageProps> = ({ crews }) => {
  const [randomCrews, setRandomCrews] = useState<Crew[]>([]);

  useEffect(() => {
    // Get 6 random crews on component mount
    setRandomCrews(getRandomCrews(crews, 6));
  }, [crews]);

  const getFoundingYear = (foundingDate: string | undefined) => {
    if (!foundingDate) return 'N/A';
    return new Date(foundingDate).getFullYear();
  };

  // Schedule-related functions removed - schedules not available in basic crew data

  return (
    <section className="crew-homepage-section">
      <div className="crew-homepage-container">
        <div className="crew-homepage-header">
          <h2>Featured Running Crews</h2>
          <p>Discover amazing running communities around the world</p>
        </div>

        <div className="crew-homepage-container">
          <div className="crew-cards-container">
            {randomCrews.map((crew) => (
              <CrewCard key={crew.id} crew={crew} />
            ))}
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link 
            href="/crews" 
            className="cta-button" 
            style={{ backgroundColor: 'var(--crew-blue)' }}
          >
            View All Crews
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CrewListHomepage;