import React from 'react';
import CrewCard from './CrewCard';
import { Crew } from '@/types/crew';

interface FeaturedCrewsProps {
  crews: Crew[];
}

const FeaturedCrews: React.FC<FeaturedCrewsProps> = ({ crews }) => {
  // Select featured crews based on criteria like member count, recent activity, etc.
  const featuredCrews = React.useMemo(() => {
    if (!crews || crews.length === 0) return [];
    
    // Sort by member count and take top crews from different continents
    const sortedByMembers = [...crews]
      .filter(crew => crew.ApproxMemberCount && crew.ApproxMemberCount > 0)
      .sort((a, b) => (b.ApproxMemberCount || 0) - (a.ApproxMemberCount || 0));
    
    // Try to get diverse selection from different continents
    const continentMap = new Map<string, Crew>();
    const featured: Crew[] = [];
    
    // First pass: one crew per continent
    for (const crew of sortedByMembers) {
      if (crew.Continent && !continentMap.has(crew.Continent)) {
        continentMap.set(crew.Continent, crew);
        featured.push(crew);
        if (featured.length >= 3) break;
      }
    }
    
    // Second pass: fill remaining slots with highest member counts
    if (featured.length < 3) {
      for (const crew of sortedByMembers) {
        if (!featured.includes(crew)) {
          featured.push(crew);
          if (featured.length >= 3) break;
        }
      }
    }
    
    return featured.slice(0, 3);
  }, [crews]);

  if (featuredCrews.length === 0) {
    return null;
  }

  return (
    <section className="featured-crews-section">
      <div className="container">
        <div className="section-header">
          <h2>⭐ Featured Running Crews</h2>
          <p>Discover some of the most active and vibrant running communities worldwide</p>
        </div>
        
        <div className="featured-crews-grid">
          {featuredCrews.map((crew, index) => (
            <div key={crew.id} className={`featured-crew-item featured-${index + 1}`}>
              <div className="featured-badge">
                {index === 0 && '🥇'}
                {index === 1 && '🥈'}
                {index === 2 && '🥉'}
                <span className="badge-text">
                  {index === 0 && 'Most Active'}
                  {index === 1 && 'Growing Fast'}
                  {index === 2 && 'Community Favorite'}
                </span>
              </div>
              <CrewCard crew={crew} featured={true} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCrews;