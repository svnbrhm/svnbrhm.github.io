import React, { useEffect, useRef, useState, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';

interface MapCrewData {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  memberCount?: number;
  status: string;
}

interface WorldMapFastProps {
  className?: string;
  initialZoom?: number;
  maxCrews?: number;
  enableClustering?: boolean;
}

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

const WorldMapFast: React.FC<WorldMapFastProps> = ({ 
  className = '',
  initialZoom = 2,
  maxCrews = 1000,
  enableClustering = true
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const clusterGroupRef = useRef<any>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [crews, setCrews] = useState<MapCrewData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadedBounds, setLoadedBounds] = useState<MapBounds | null>(null);
  const [totalCrews, setTotalCrews] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Debounced bounds loading
  const loadCrewsForBounds = useCallback(
    debounce(async (bounds: MapBounds, zoom: number) => {
      try {
        console.log('🗺️ Loading crews for bounds:', bounds, 'zoom:', zoom);
        
        // Determine how many crews to load based on zoom level
        const crewLimit = Math.min(maxCrews, getCrewLimitForZoom(zoom));
        
        const boundsString = `${bounds.north},${bounds.south},${bounds.east},${bounds.west}`;
        const url = `/api/crews/map-data?bounds=${boundsString}&limit=${crewLimit}&zoom=${zoom}`;
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch crews: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.message || data.error);
        }
        
        console.log(`✅ Loaded ${data.crews.length} crews (cached: ${data.cached})`);
        setCrews(data.crews);
        setTotalCrews(data.total);
        setLastUpdated(data.lastUpdated);
        setLoadedBounds(bounds);
        
        // Update markers on map
        if (mapInstanceRef.current && markersLayerRef.current) {
          updateMapMarkers(data.crews);
        }
        
      } catch (error) {
        console.error('❌ Failed to load crews:', error);
        setError(error instanceof Error ? error.message : 'Failed to load crews');
      }
    }, 500), // 500ms debounce
    [maxCrews]
  );

  // Get appropriate crew limit based on zoom level
  const getCrewLimitForZoom = (zoom: number): number => {
    if (zoom <= 3) return 100;   // World view - show major cities only
    if (zoom <= 6) return 300;   // Continental view
    if (zoom <= 9) return 600;   // Country/region view
    if (zoom <= 12) return 1000; // City view
    return maxCrews;             // Street view - show all
  };

  // Update markers on the map
  const updateMapMarkers = useCallback((crewData: MapCrewData[]) => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    
    const map = mapInstanceRef.current;
    
    // Clear existing markers
    if (enableClustering && clusterGroupRef.current) {
      clusterGroupRef.current.clearLayers();
    } else {
      markersLayerRef.current.clearLayers();
    }
    
    // Add new markers
    crewData.forEach(crew => {
      if (!crew.lat || !crew.lng) return;
      
      // Create marker
      const L = (window as any).L;
      const marker = L.marker([crew.lat, crew.lng]);
      
      // Create popup content
      const popupContent = `
        <div class="crew-popup">
          <h3 class="font-bold text-lg mb-2">${crew.name || 'Unnamed Crew'}</h3>
          <p class="text-sm text-gray-600 mb-1">
            📍 ${crew.city}${crew.country ? `, ${crew.country}` : ''}
          </p>
          ${crew.memberCount ? `<p class="text-sm text-gray-600 mb-2">👥 ~${crew.memberCount} members</p>` : ''}
          <a href="/crews/${crew.id}" class="inline-block bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors">
            View Details
          </a>
        </div>
      `;
      
      marker.bindPopup(popupContent);
      
      // Add to appropriate layer
      if (enableClustering && clusterGroupRef.current) {
        clusterGroupRef.current.addLayer(marker);
      } else {
        markersLayerRef.current.addLayer(marker);
      }
    });
    
    console.log(`📍 Added ${crewData.length} markers to map`);
  }, [enableClustering]);

  // Initialize map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;
    
    const initializeMap = async () => {
      try {
        console.log('🚀 Initializing fast map...');
        
        // Dynamic imports for client-side only
        const L = await import('leaflet');
        let MarkerClusterGroup = null;
        if (enableClustering) {
          const markerClusterModule = await import('leaflet.markercluster');
          MarkerClusterGroup = (L as any).MarkerClusterGroup;
        }
        
        // Fix for missing marker icons in Next.js
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: '/marker-icon-2x.png',
          iconUrl: '/marker-icon.png',
          shadowUrl: '/marker-shadow.png',
        });
        
        // Create map
        const map = L.map(mapRef.current!).setView([20, 0], initialZoom);
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18,
        }).addTo(map);
        
        // Create marker layers
        const markersLayer = L.layerGroup().addTo(map);
        markersLayerRef.current = markersLayer;
        
        // Setup clustering if enabled
        if (enableClustering && MarkerClusterGroup) {
          const clusterGroup = new MarkerClusterGroup({
            chunkedLoading: true,
            chunkInterval: 200,
            chunkDelay: 50,
            maxClusterRadius: 50,
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true
          });
          map.addLayer(clusterGroup);
          clusterGroupRef.current = clusterGroup;
        }
        
        mapInstanceRef.current = map;
        
        // Load initial crews
        const bounds = map.getBounds();
        const mapBounds: MapBounds = {
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest()
        };
        
        await loadCrewsForBounds(mapBounds, map.getZoom());
        
        // Setup event listeners for dynamic loading
        map.on('moveend zoomend', () => {
          const newBounds = map.getBounds();
          const newMapBounds: MapBounds = {
            north: newBounds.getNorth(),
            south: newBounds.getSouth(),
            east: newBounds.getEast(),
            west: newBounds.getWest()
          };
          
          // Only reload if bounds changed significantly or zoom level changed
          if (!loadedBounds || 
              Math.abs(newMapBounds.north - loadedBounds.north) > 0.1 ||
              Math.abs(newMapBounds.south - loadedBounds.south) > 0.1 ||
              Math.abs(newMapBounds.east - loadedBounds.east) > 0.1 ||
              Math.abs(newMapBounds.west - loadedBounds.west) > 0.1) {
            loadCrewsForBounds(newMapBounds, map.getZoom());
          }
        });
        
        setIsLoading(false);
        console.log('✅ Fast map initialized successfully');
        
      } catch (error) {
        console.error('❌ Failed to initialize map:', error);
        setError('Failed to initialize map');
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
  }, [initialZoom, enableClustering, loadCrewsForBounds]);

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
        <h3 className="text-red-800 font-semibold mb-2">Map Error</h3>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Reload Page
        </button>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading world map...</p>
          </div>
        </div>
      )}
      
      <div ref={mapRef} className="w-full h-full min-h-[400px] rounded-lg" />
      
      {/* Map info overlay */}
      {!isLoading && (
        <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[1000] text-sm">
          <div className="text-gray-700">
            <div className="font-semibold">📍 {totalCrews} crews loaded</div>
            {lastUpdated && (
              <div className="text-xs text-gray-500 mt-1">
                Updated: {new Date(lastUpdated).toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default WorldMapFast;