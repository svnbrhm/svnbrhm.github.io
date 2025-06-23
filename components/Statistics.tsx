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
        setIsLoading(true);
        const globalStats = await airtableService.getGlobalStatistics();
        
        const updatedStats: StatItem[] = [
          { id: 1, label: 'Active Crews', value: globalStats.activeCrews, priority: 'high' },
          { id: 2, label: 'Runners', value: globalStats.totalRunners, priority: 'high' },
          { id: 3, label: 'Cities', value: globalStats.cities, priority: 'high' },
          { id: 4, label: 'Countries', value: globalStats.countries, priority: 'medium' },
          { id: 5, label: 'Routes', value: globalStats.routes, priority: 'medium' },
          { id: 6, label: 'Events', value: globalStats.events, priority: 'medium' },
        ];
        
        setStats(updatedStats);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
        // Keep default stats if fetch fails
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // Animation logic that starts when scrolling into view
  useEffect(() => {
    const section = sectionRef.current;
    
    // Function to animate the numbers
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
          // Update the state for the respective number
          setCounts(prevCounts => {
            const newCounts = [...prevCounts];
            newCounts[index] = Math.floor(start);
            return newCounts;
          });
        }, intervalTime);
      });
    };

    // IntersectionObserver that checks when the section becomes visible
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          startAnimation();
          // Stop observing after animation has started once
          if (section) {
            observer.unobserve(section);
          }
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Starts when 10% of the section is visible
      }
    );

    if (section && !isLoading) {
      observer.observe(section);
    }

    // Cleanup function
    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, [stats, isLoading, hasAnimated]);

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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.id} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  {counts[index].toLocaleString()}
                </div>
                <div className="text-sm md:text-base text-gray-600 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Statistics;