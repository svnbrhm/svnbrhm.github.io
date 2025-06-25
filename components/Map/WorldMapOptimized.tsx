import React, { useState, useEffect, useRef } from 'react';
import { Crew } from '../../types/crew';
import 'leaflet/dist/leaflet.css';

interface WorldMapOptimizedProps {
  crews: Crew[];
  className?: string;
}

interface StaticCrewData {
  metadata: {
    generatedAt: string;
    version: string;
    source: string;
    statistics: {
      total: number;
      withCoordinates: number;
      fromHeadquarters: number;
      geocoded: number;
      failed: number;
      missingData: number;
    };
  };
  crews: (Crew & {
    coordinates: { lat: number; lng: number } | null;
    coordinateSource: 'headquarters' | 'geocoded' | 'failed' | 'missing_data';
  })[];
}

const WorldMapOptimized: React.FC<WorldMapOptimizedProps> = ({ crews: fallbackCrews, className }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [staticCrews, setStaticCrews] = useState<StaticCrewData['crews']>([]);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'static' | 'ssg'>('static');


  // Load static crew data
  useEffect(() => {
    const loadStaticData = async () => {
      try {

        console.log('📊 Loading static crew data...');
        const response = await fetch('/data/crews-with-coordinates.json');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const data: StaticCrewData = await response.json();
        console.log('✅ Static data loaded:', {
          totalCrews: data.crews.length,
          sampleCrew: data.crews[0]?.CrewName || 'None'
        });
        
        // Validate data structure
        if (!data.crews || !Array.isArray(data.crews)) {
          throw new Error('Invalid data structure');
        }
        
        setStaticCrews(data.crews);
        setDataSource('static');
        setDebugInfo(`Loaded ${data.crews.length} crews from static data`);
        setIsLoading(false);
        
      } catch (error) {
        console.error('❌ Failed to load static data:', error);
        console.log('🔄 Falling back to SSG data...');
        setDebugInfo('Static data failed, using fallback...');
        
        // Fallback to SSG data
        if (fallbackCrews && fallbackCrews.length > 0) {
          const processedCrews = fallbackCrews
            .filter(crew => crew.HeadquarterLatitude && crew.HeadquarterLongitude)
            .map(crew => ({
              ...crew,
              coordinates: {
                lat: crew.HeadquarterLatitude!,
                lng: crew.HeadquarterLongitude!
              },
              coordinateSource: 'headquarters' as const
            }));
          
          console.log('✅ Using SSG fallback data:', {
            totalCrews: processedCrews.length,
            sampleCrew: processedCrews[0]?.CrewName || 'None'
          });
          
          setStaticCrews(processedCrews);
          setDataSource('ssg');
          setDebugInfo(`Using ${processedCrews.length} crews from fallback data`);
        } else {
          setError('Failed to load crew data');
          setDebugInfo('Error: No crew data available');
        }
        
        setIsLoading(false);
      }
    };
    
    loadStaticData();
  }, [fallbackCrews]);

  // Initialize map
  useEffect(() => {
    console.log('🗺️ Map initialization check:', {
      mapRefExists: !!mapRef.current,
      staticCrewsLength: staticCrews.length,
      shouldInitialize: !!(mapRef.current && staticCrews.length > 0),
      isClient: typeof window !== 'undefined'
    });
    
    // Only initialize on client side
    if (typeof window === 'undefined') {
      console.log('⏸️ Skipping map initialization on server side');
      return;
    }
    
    if (!mapRef.current || staticCrews.length === 0) return;

    const initializeMap = async () => {
      try {
        // Check if map is already initialized
        if (mapInstanceRef.current) {
          console.log('🔄 Map already initialized, updating markers only...');
          const L = await import('leaflet');
          if (markersLayerRef.current) {
            updateMarkersForBounds(mapInstanceRef.current, markersLayerRef.current, L);
          }
          return;
        }
        setDebugInfo('Initializing map...');
        console.log('🚀 Starting map initialization...');
        console.log('📦 Starting Leaflet import...');
        
        // Check if map container exists and is visible
        const mapContainer = mapRef.current;
        if (mapContainer) {
          const rect = mapContainer.getBoundingClientRect();
          console.log('📐 Map container dimensions:', {
            width: rect.width,
            height: rect.height,
            visible: rect.width > 0 && rect.height > 0,
            display: window.getComputedStyle(mapContainer).display,
            visibility: window.getComputedStyle(mapContainer).visibility
          });
          setDebugInfo(`Map container: ${rect.width}x${rect.height}`);
        }
        
        const L = await import('leaflet');
        console.log('✅ Leaflet imported successfully');
        setDebugInfo('Leaflet loaded, creating map...');
        

        
        // Fix for default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: '/marker-icon-2x.png',
          iconUrl: '/marker-icon.png',
          shadowUrl: '/marker-shadow.png',
        });

        // Initialize map
        if (!mapRef.current) return;
        const map = L.map(mapRef.current).setView([20, 0], 3);
        mapInstanceRef.current = map;

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18,
        }).addTo(map);

        // Create markers layer
        const markersLayer = L.layerGroup().addTo(map);
        markersLayerRef.current = markersLayer;

        // Add initial markers
        updateMarkersForBounds(map, markersLayer, L);

        // Update markers when map moves or zooms
        map.on('moveend zoomend', () => {
          updateMarkersForBounds(map, markersLayer, L);
        });

        setIsLoading(false);
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('❌ Failed to initialize map:', error);
        console.error('Error details:', {
          message: errorMessage,
          stack: error instanceof Error ? error.stack : undefined,
          mapRef: !!mapRef.current,
          staticCrewsLength: staticCrews.length
        });
        setError('Failed to initialize map: ' + errorMessage);
        setDebugInfo(`Error: ${errorMessage}`);
        setIsLoading(false);
      }
    };

    initializeMap();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [staticCrews]);

  // Function to update markers based on current map bounds
  const updateMarkersForBounds = (map: any, markersLayer: any, L: any) => {
    if (!map || !markersLayer || !L) return;

    const bounds = map.getBounds();
    const zoom = map.getZoom();
    
    // Clear existing markers
    markersLayer.clearLayers();
    
    // Show markers at all zoom levels for debugging
    // if (zoom < 3) {
    //   return;
    // }
    
    // Filter crews with valid coordinates (temporarily show crews without names for debugging)
    const visibleCrews = staticCrews.filter(crew => {
      if (!crew.coordinates) return false;
      // Temporarily allow crews without names to debug the marker display
      // if (!crew.CrewName || crew.CrewName.trim() === '') return false;
      
      return true; // Show all crews for debugging
      // const { lat, lng } = crew.coordinates;
      // return bounds.contains([lat, lng]);
    });
    
    // Limit to first 50 crews for performance during debugging
    const limitedCrews = visibleCrews.slice(0, 50);
    
    console.log(`🗺️ Showing ${limitedCrews.length} crews at zoom level ${zoom}`);
    console.log('📊 Total static crews:', staticCrews.length);
    console.log('📍 Crews with coordinates:', staticCrews.filter(c => c.coordinates).length);
    console.log('📝 Crews with names:', staticCrews.filter(c => c.CrewName && c.CrewName.trim() !== '').length);
    console.log('🏙️ Crews with cities:', staticCrews.filter(c => c.City && c.City.trim() !== '').length);
    console.log('🔍 Sample visible crew:', limitedCrews[0]);
    console.log('🎯 Adding markers to map...');
    
    // Debug logging
    console.log('🔍 Debug info:', {
      staticCrewsLength: staticCrews.length,
      limitedCrewsLength: limitedCrews.length,
      mapInstance: !!mapInstanceRef.current,
      markersLayer: !!markersLayerRef.current
    });
    
    // Add markers for visible crews
    limitedCrews.forEach(crew => {
      if (!crew.coordinates) return;
      
      const { lat, lng } = crew.coordinates;
      
      // Create custom icon based on crew status
      const iconColor = getCrewStatusColor('active'); // Default to active status
      const customIcon = L.divIcon({
        className: 'custom-crew-marker',
        html: `<div style="background-color: ${iconColor}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.5); z-index: 1000;"></div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });
      
      // Create marker
      const marker = L.marker([lat, lng], { icon: customIcon });
      
      // Create popup content with fallback for empty names
      const displayName = crew.CrewName && crew.CrewName.trim() !== '' ? crew.CrewName : `${crew.City}, ${crew.Country}`;
      const popupContent = `
        <div class="crew-popup">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${displayName}</h3>
          <p style="margin: 0 0 4px 0; color: #666; font-size: 14px;">${crew.City}, ${crew.Country}</p>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #888;">Status: Active</p>
          <div style="display: flex; gap: 8px; margin-top: 8px;">
            <a href="/crews/${crew.id}" style="background: #3b82f6; color: white; padding: 4px 8px; border-radius: 4px; text-decoration: none; font-size: 12px;">View Details</a>
            ${crew.HomepageURL ? `<a href="${crew.HomepageURL}" target="_blank" rel="noopener noreferrer" style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; text-decoration: none; font-size: 12px;">Website</a>` : ''}
          </div>
          <div style="margin-top: 8px; font-size: 10px; color: #aaa;">
            Coordinates: ${crew.coordinateSource === 'headquarters' ? 'HQ' : 'Geocoded'}
          </div>
        </div>
      `;
      
      marker.bindPopup(popupContent, {
        maxWidth: 250,
        className: 'crew-popup-container'
      });
      
      // Add marker to layer
      markersLayer.addLayer(marker);
      console.log(`✅ Added marker for ${displayName} at [${lat}, ${lng}]`);
    });
    
    console.log(`🎉 Successfully added ${limitedCrews.length} markers to the map!`);

  };

  // Get color based on crew status
  const getCrewStatusColor = (status: string): string => {
    switch (status?.toLowerCase()) {
      case 'active':
        return '#10b981'; // green
      case 'inactive':
        return '#ef4444'; // red
      case 'pending':
        return '#f59e0b'; // yellow
      case 'verified':
        return '#3b82f6'; // blue
      default:
        return '#6b7280'; // gray
    }
  };

  if (error && dataSource === 'static') {
    return (
      <div key="world-map-optimized-error" className={`world-map-container ${className || ''}`}>
        <div className="map-error">
          <p>⚠️ {error}</p>
          <p>The map is using fallback data and may have limited functionality.</p>

        </div>
        <div ref={mapRef} className="world-map" style={{ height: '835px', width: '100%', backgroundColor: '#f0f0f0', border: '2px solid #ccc' }} />
        {isLoading && (
          <div className="map-loading">
            <div className="loading-spinner"></div>
            <p>Loading map...</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div key="world-map-optimized" className={`world-map-container ${className || ''}`}>
      <div className="map-header">
        <h2>Global Running Crews Map</h2>
        <p>Explore running communities around the world</p>
        {dataSource === 'ssg' && (
          <div className="map-warning">
            <p>⚠️ Using fallback data - static data unavailable</p>
          </div>
        )}

      </div>
      
      <div ref={mapRef} className="world-map" style={{ height: '835px', width: '100%', backgroundColor: '#f0f0f0', border: '2px solid #ccc' }} />
      
      {isLoading && (
        <div className="map-loading">
          <div className="loading-spinner"></div>
          <p>Loading map...</p>
        </div>
      )}
      
      <style jsx>{`
        .world-map-container {
          position: relative;
          width: 100%;
          max-width: 1114px;
          margin: 0 auto;
          padding: 0;
          background: transparent;
        }
        
        .map-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .map-header h2 {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary, #1a1a1a);
          margin: 0 0 0.5rem 0;
        }
        
        .map-header p {
          font-size: 1.1rem;
          color: var(--text-secondary, #666);
          margin: 0;
        }
        
        .world-map {
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.1);
          position: relative;
          z-index: 1;
        }
        
        /* Override any conflicting global map styles */
        .world-map :global(.leaflet-container) {
          border-radius: 12px;
        }
        
        /* Ensure no duplicate maps */
        .world-map-container + .world-map-container {
          display: none;
        }
        
        .map-info {
          padding: 8px;
          background: #f0f9ff;
          border: 1px solid #0ea5e9;
          border-radius: 4px;
          margin-bottom: 8px;
        }
        
        .map-error {
          padding: 12px;
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 4px;
          margin-bottom: 8px;
        }
        
        .map-error p {
          margin: 4px 0;
          font-size: 14px;
        }
        
        .map-loading {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(255, 255, 255, 0.9);
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          z-index: 1000;
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f4f6;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 10px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        :global(.custom-crew-marker) {
          background: transparent !important;
          border: none !important;
        }
        
        :global(.crew-popup-container .leaflet-popup-content) {
          margin: 8px;
        }
        
        :global(.crew-popup) {
          font-family: system-ui, -apple-system, sans-serif;
        }
      `}</style>
    </div>
  );
};

export default WorldMapOptimized;