import React, { useEffect, useState } from 'react';
import { Crew } from '@/types/crew';

interface CrewStatsProps {
  crews: Crew[];
}

const CrewStats: React.FC<CrewStatsProps> = ({ crews }) => {
  const [animatedStats, setAnimatedStats] = useState({
    totalCrews: 0,
    totalCountries: 0,
    totalContinents: 0,
    totalMembers: 0
  });

  // Calculate actual statistics
  const stats = React.useMemo(() => {
    const countries = new Set(crews.map(crew => crew.Country).filter(Boolean));
    const continents = new Set(crews.map(crew => crew.Continent).filter(Boolean));
    const totalMembers = crews.reduce((sum, crew) => sum + (crew.ApproxMemberCount || 0), 0);
    
    return {
      totalCrews: crews.length,
      totalCountries: countries.size,
      totalContinents: continents.size,
      totalMembers
    };
  }, [crews]);

  // Animate counters on mount
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setAnimatedStats({
        totalCrews: Math.floor(stats.totalCrews * easeOutQuart),
        totalCountries: Math.floor(stats.totalCountries * easeOutQuart),
        totalContinents: Math.floor(stats.totalContinents * easeOutQuart),
        totalMembers: Math.floor(stats.totalMembers * easeOutQuart)
      });
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedStats(stats); // Ensure final values are exact
      }
    }, stepDuration);
    
    return () => clearInterval(timer);
  }, [stats]);

  return (
    <section className="crew-stats-section">
      <div className="container">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🏃‍♂️</div>
            <div className="stat-number">{animatedStats.totalCrews.toLocaleString()}</div>
            <div className="stat-label">Running Crews</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🌍</div>
            <div className="stat-number">{animatedStats.totalCountries.toLocaleString()}</div>
            <div className="stat-label">Countries</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🗺️</div>
            <div className="stat-number">{animatedStats.totalContinents.toLocaleString()}</div>
            <div className="stat-label">Continents</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-number">{animatedStats.totalMembers.toLocaleString()}</div>
            <div className="stat-label">Total Members</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CrewStats;