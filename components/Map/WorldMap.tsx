import React, { useEffect, useState, useCallback } from 'react';
import { Crew } from '../../types/crew';
import Link from 'next/link';

// Geocoding function to get coordinates from city/country
const geocodeLocation = async (city: string, country: string): Promise<{lat: number, lng: number} | null> => {
  try {
    const query = encodeURIComponent(`${city}, ${country}`);
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`);
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

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

interface WorldMapProps {
  crews: Crew[];
}

const WorldMap = ({ crews }: WorldMapProps) => {
  const [dynamicCrews, setDynamicCrews] = useState<Crew[]>(crews);
  const [isLoading, setIsLoading] = useState(false);
  const [mapInstance, setMapInstance] = useState<any>(null);
  
  // Function to load crews within current map bounds
  const loadCrewsInBounds = useCallback(async (map: any) => {
    if (!map || isLoading) return;
    
    try {
      setIsLoading(true);
      const bounds = map.getBounds();
      const zoom = map.getZoom();
      
      // Only load dynamic crews when zoomed in enough (zoom level 6 or higher)
      if (zoom >= 6) {
        const response = await fetch(
          `/api/crews/bounds?north=${bounds.getNorth()}&south=${bounds.getSouth()}&east=${bounds.getEast()}&west=${bounds.getWest()}&zoom=${zoom}`
        );
        
        if (response.ok) {
          const data = await response.json();
          setDynamicCrews(data.crews || []);
        }
      } else {
        // Use initial crews for lower zoom levels
        setDynamicCrews(crews);
      }
    } catch (error) {
      console.error('Error loading crews in bounds:', error);
    } finally {
      setIsLoading(false);
    }
  }, [crews, isLoading]);

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
        
        // Store map instance for dynamic loading
        setMapInstance(map);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(map);
        
        // Add event listeners for dynamic crew loading
        map.on('moveend zoomend', () => {
          loadCrewsInBounds(map);
        });

        // Create a layer group for markers to manage them efficiently
        const markersLayer = L.layerGroup().addTo(map);
        
        // Process crews with coordinates or geocode from city/country
        const processCrews = async (crewsToProcess: Crew[]) => {
          // Clear existing markers
          markersLayer.clearLayers();
          
          for (const crew of crewsToProcess) {
            let lat: number | undefined;
            let lng: number | undefined;
            
            // First try to use headquarter coordinates
            if (crew.HeadquarterLatitude && crew.HeadquarterLongitude && 
                !isNaN(crew.HeadquarterLatitude) && !isNaN(crew.HeadquarterLongitude)) {
              lat = crew.HeadquarterLatitude;
              lng = crew.HeadquarterLongitude;
            } 
            // Fallback to geocoding city/country
            else if (crew.City && crew.Country) {
              const geocoded = await geocodeLocation(crew.City, crew.Country);
              if (geocoded) {
                lat = geocoded.lat;
                lng = geocoded.lng;
              }
            }
            
            // Only create marker if we have valid coordinates
            if (lat && lng) {
              const marker = L.marker([lat, lng]).addTo(markersLayer);
          
              // Create popup content with clickable link
              const popupContent = `
                <div style="text-align:center; padding:10px; min-width:200px;">
                  <h3 style="margin:0 0 5px 0; color:#2f2f2f; font-size:16px;">${crew.CrewName}</h3>
                  <p style="margin:0 0 10px 0; color:#6A8B9C; font-size:14px;">${crew.City}, ${crew.Country}</p>
                  ${crew.ApproxMemberCount ? `<p style="margin:0 0 10px 0; color:#888; font-size:12px;">~${crew.ApproxMemberCount} members</p>` : ''}
                  <a href="/crews/${crew.id}" style="display:inline-block; background:#5C8147; color:white; text-decoration:none; padding:8px 16px; border-radius:15px; font-size:14px; transition:background 0.3s;" 
                      onmouseover="this.style.background='#4a6b39'" onmouseout="this.style.background='#5C8147'">
                     View Crew
                   </a>
                 </div>
               `;
               
               marker.bindPopup(popupContent);
               
               // Make marker clickable to navigate to crew page
               marker.on('click', () => {
                 window.location.href = `/crews/${crew.id}`;
               });
            }
          }
        };
        
        // Initial crew processing
        await processCrews(dynamicCrews);
        
        // Store processCrews function on map instance for later use
        (map as any)._processCrews = processCrews;

        return () => {
          map.remove();
        };
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };
    
    initMap();
  }, []);
  
  // Handle dynamic crews changes
  useEffect(() => {
    if (mapInstance && (mapInstance as any)._processCrews) {
      (mapInstance as any)._processCrews(dynamicCrews);
    }
  }, [dynamicCrews, mapInstance]);

  // Die JSX-Struktur behält das neue Design, aber OHNE die "scroll-reveal"-Klasse.
  return (
    <section className="section">
      <h2 className="section-title">Discover Crews Worldwide</h2>
      <div className="map-section">
        {isLoading && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '14px',
            zIndex: 1000
          }}>
            Loading crews...
          </div>
        )}
        <div id="map"></div>
      </div>
    </section>
  );
};

export default WorldMap;