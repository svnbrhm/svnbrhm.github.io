import React, { useEffect } from 'react';

// Dynamically import Leaflet to avoid SSR issues
const loadLeaflet = async () => {
  const L = (await import('leaflet')).default;
  
  // Fix für fehlende Marker-Icons in Next.js
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/marker-icon-2x.png',
    iconUrl: '/marker-icon.png',
    shadowUrl: '/marker-shadow.png',
  });
  
  return L;
};

const crews = [
  { id: 1, lat: 40.6782, lng: -73.9442, name: "Brooklyn Street Runners", city: "New York City, USA" },
  { id: 2, lat: 52.5200, lng: 13.4050, name: "Berlin Urban Runners", city: "Berlin, Germany" },
  { id: 3, lat: 35.6762, lng: 139.6503, name: "Tokyo Night Runners", city: "Tokyo, Japan" },
  { id: 4, lat: 51.5074, lng: -0.1278, name: "London Bridge Runners", city: "London, UK" },
  { id: 5, lat: 34.0522, lng: -118.2437, name: "LA Coast Runners", city: "Los Angeles, USA" },
  { id: 6, lat: 48.8566, lng: 2.3522, name: "Paris Street Squad", city: "Paris, France" },
];

const WorldMap = () => {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const initMap = async () => {
      try {
        // Verhindert die doppelte Initialisierung der Karte.
        const mapContainer = document.getElementById('map');
        if (!mapContainer || (mapContainer as any)._leaflet_id) {
          return;
        }

        const L = await loadLeaflet();
        const map = L.map('map').setView([20, 0], 2);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        crews.forEach((crew) => {
          const marker = L.marker([crew.lat, crew.lng]).addTo(map);
          marker.bindPopup(`
            <div style="text-align:center; padding:10px;">
              <h3 style="margin:0 0 5px 0; color:#2f2f2f;">${crew.name}</h3>
              <p style="margin:0 0 10px 0; color:#6A8B9C;">${crew.city}</p>
              <button style="background:#5C8147; color:white; border:none; padding:5px 15px; border-radius:15px; cursor:pointer;">
                View Crew
              </button>
            </div>
          `);
        });

        return () => {
          map.remove();
        };
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };
    
    initMap();
  }, []);

  // Die JSX-Struktur behält das neue Design, aber OHNE die "scroll-reveal"-Klasse.
  return (
    <section className="section">
      <h2 className="section-title">Discover Crews Worldwide</h2>
      <div className="map-section">
        <div id="map"></div>
      </div>
    </section>
  );
};

export default WorldMap;