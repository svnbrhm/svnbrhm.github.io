import React, { useState, useEffect, useRef } from 'react';
import airtableService, { GlobalStatistics } from '../lib/airtable';

interface StatItem {
  id: number;
  label: string;
  value: number;
  priority: 'high' | 'medium';
}

// Default stats structure - will be populated with real data
const defaultStats: StatItem[] = [
  { id: 1, label: 'Active Crews', value: 0, priority: 'high' },
  { id: 2, label: 'Runners', value: 0, priority: 'high' },
  { id: 3, label: 'Cities', value: 0, priority: 'high' },
  { id: 4, label: 'Countries', value: 0, priority: 'medium' },
  { id: 5, label: 'Routes', value: 0, priority: 'medium' },
  { id: 6, label: 'Events', value: 0, priority: 'medium' },
];

const Statistics = () => {
  // State for the actual statistics data from Airtable
  const [stats, setStats] = useState<StatItem[]>(defaultStats);
  // State for animated counts in the UI
  const [counts, setCounts] = useState(defaultStats.map(() => 0));
  // State for loading status
  const [isLoading, setIsLoading] = useState(true);
  // Ref for the section element to observe
  const sectionRef = useRef<HTMLElement>(null);
  // Flag to prevent multiple animations
  const [hasAnimated, setHasAnimated] = useState(false);

  // Fetch real statistics from Airtable
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        console.log('Statistics component: Starting to fetch statistics...');
        setIsLoading(true);
        const globalStats = await airtableService.getGlobalStatistics();
        console.log('Statistics component: Received global stats:', globalStats);
        
        const updatedStats: StatItem[] = [
          { id: 1, label: 'Active Crews', value: globalStats.activeCrews, priority: 'high' },
          { id: 2, label: 'Runners', value: globalStats.totalRunners, priority: 'high' },
          { id: 3, label: 'Cities', value: globalStats.cities, priority: 'high' },
          { id: 4, label: 'Countries', value: globalStats.countries, priority: 'medium' },
          { id: 5, label: 'Routes', value: globalStats.routes, priority: 'medium' },
          { id: 6, label: 'Events', value: globalStats.events, priority: 'medium' },
        ];
        
        console.log('Statistics component: Updated stats:', updatedStats);
        setStats(updatedStats);
        // Reset counts to start animation from 0
        setCounts(updatedStats.map(() => 0));
      } catch (error) {
        console.error('Statistics component: Failed to fetch statistics:', error);
        // Keep default stats if fetch fails
      } finally {
        setIsLoading(false);
        console.log('Statistics component: Loading finished, isLoading set to false');
      }
    };

    fetchStatistics();
  }, []);

  // Animation effect for numbers
  useEffect(() => {
    const section = sectionRef.current;
    
    const startAnimation = () => {
      if (hasAnimated || isLoading) return; // Prevent multiple animations or animation while loading
      
      setHasAnimated(true);
      const duration = 2000; // 2 seconds
      const intervalTime = 20;
      
      stats.forEach((stat, index) => {
        let start = 0;
        const end = stat.value;
        const steps = duration / intervalTime;
        const increment = end / steps;

        const timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            start = end;
            clearInterval(timer);
          }
          setCounts(prevCounts => {
            const newCounts = [...prevCounts];
            newCounts[index] = Math.floor(start);
            return newCounts;
          });
        }, intervalTime);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          startAnimation();
          if (section) {
            observer.unobserve(section);
          }
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      }
    );

    if (section && !isLoading) { // Only observe after data is loaded
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, [stats, hasAnimated, isLoading]);

  // JSX structure adapted to the HTML template
  return (
    <section ref={sectionRef} className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">GLOBAL IMPACT</h2>
          <div className="w-16 h-1 bg-green-500 mx-auto"></div>
        </div>
        
        {isLoading ? (
          <div className="text-center">
            <div className="text-gray-600">Loading statistics...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div key={stat.id} className="bg-white rounded-lg shadow-lg p-6 text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                <div className="mb-4">
                  <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-600 mb-2">
                    {counts[index].toLocaleString()}
                  </div>
                  <div className="text-lg md:text-xl text-gray-800 font-semibold uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
                <div className="w-12 h-1 bg-green-500 mx-auto rounded-full"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Statistics;