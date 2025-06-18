import React, { useState, useEffect, useRef } from 'react';

// 1. Daten an das Zieldesign angepasst - now with 6 items for 3x2 grid
const stats = [
  { id: 1, label: 'Active Crews', value: 247, priority: 'high' },
  { id: 2, label: 'Runners', value: 15420, priority: 'high' },
  { id: 3, label: 'Cities', value: 156, priority: 'high' },
  { id: 4, label: 'Countries', value: 68, priority: 'medium' },
  { id: 5, label: 'Routes', value: 542, priority: 'medium' },
  { id: 6, label: 'Events', value: 350, priority: 'medium' },
];

const Statistics = () => {
  // Der 'counts'-State wird weiterhin verwendet, um die Zahlen im UI zu aktualisieren
  const [counts, setCounts] = useState(stats.map(() => 0));
  // Ein Ref wird benötigt, um das Section-Element zu beobachten
  const sectionRef = useRef<HTMLElement>(null);

  // 3. Logik für die Animation so angepasst, dass sie beim Scrollen startet
  useEffect(() => {
    const section = sectionRef.current;
    
    // Die Funktion, die die Zahlen animiert
    const startAnimation = () => {
      const duration = 2000; // 2 Sekunden
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
          // Aktualisiert den State für die jeweilige Zahl
          setCounts(prevCounts => {
            const newCounts = [...prevCounts];
            newCounts[index] = Math.floor(start);
            return newCounts;
          });
        }, intervalTime);
      });
    };

    // IntersectionObserver, der prüft, wann die Sektion sichtbar wird
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          startAnimation();
          // Stoppt die Beobachtung, nachdem die Animation einmal gestartet wurde
          if (section) {
            observer.unobserve(section);
          }
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Startet, wenn 10% der Sektion sichtbar sind
      }
    );

    if (section) {
      observer.observe(section);
    }

    // Aufräumfunktion
    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  // 2. JSX-Struktur und Klassen an die HTML-Vorlage angepasst
  return (
    <section className="stats-section" ref={sectionRef}>
      <h2 className="section-title">Global Impact</h2>
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div className={`stat-item ${stat.priority}`} key={stat.id}>
            <span className="stat-number">{counts[i].toLocaleString()}</span>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Statistics;