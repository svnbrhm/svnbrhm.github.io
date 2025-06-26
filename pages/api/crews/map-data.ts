import { NextApiRequest, NextApiResponse } from 'next';
import { airtableService } from '../../../lib/airtable';
import { Crew } from '../../../types/crew';
import fs from 'fs';
import path from 'path';

interface MapCrewData {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  memberCount?: number;
  status: string;
  pageStatus?: string;
}

interface MapDataResponse {
  crews: MapCrewData[];
  total: number;
  cached: boolean;
  lastUpdated: string;
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

type Data = MapDataResponse | { error: string; message?: string };

// Cache configuration
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
const STATIC_DATA_PATH = path.join(process.cwd(), 'public/data/crews-with-coordinates.json');
const MAP_CACHE_PATH = path.join(process.cwd(), 'public/data/map-crews-cache.json');

// In-memory cache
let memoryCache: {
  data: MapCrewData[];
  timestamp: number;
  bounds?: { north: number; south: number; east: number; west: number };
} | null = null;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600'); // 30min cache, 1hr stale

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { bounds, limit, zoom } = req.query;
    const requestedLimit = limit ? parseInt(limit as string) : undefined;
    const currentZoom = zoom ? parseFloat(zoom as string) : undefined;

    // Parse bounds if provided
    let requestedBounds: { north: number; south: number; east: number; west: number } | undefined;
    if (bounds && typeof bounds === 'string') {
      try {
        const [north, south, east, west] = bounds.split(',').map(Number);
        if (!isNaN(north) && !isNaN(south) && !isNaN(east) && !isNaN(west)) {
          requestedBounds = { north, south, east, west };
        }
      } catch (e) {
        console.warn('Invalid bounds format:', bounds);
      }
    }

    // Check memory cache first
    const now = Date.now();
    if (memoryCache && (now - memoryCache.timestamp) < CACHE_DURATION) {
      console.log('🚀 Serving from memory cache');
      let crews = memoryCache.data;
      
      // Filter by bounds if requested
      if (requestedBounds) {
        crews = crews.filter(crew => 
          crew.lat >= requestedBounds!.south &&
          crew.lat <= requestedBounds!.north &&
          crew.lng >= requestedBounds!.west &&
          crew.lng <= requestedBounds!.east
        );
      }
      
      // Apply limit if requested
      if (requestedLimit && requestedLimit > 0) {
        crews = crews.slice(0, requestedLimit);
      }
      
      return res.status(200).json({
        crews,
        total: crews.length,
        cached: true,
        lastUpdated: new Date(memoryCache.timestamp).toISOString(),
        bounds: requestedBounds
      });
    }

    // Try to load from static file cache
    let mapData: MapCrewData[] = [];
    let fromStaticFile = false;
    
    try {
      if (fs.existsSync(STATIC_DATA_PATH)) {
        console.log('📁 Loading from static crew data file');
        const staticData = JSON.parse(fs.readFileSync(STATIC_DATA_PATH, 'utf8'));
        
        if (staticData.crews && Array.isArray(staticData.crews)) {
          mapData = staticData.crews
            .filter((crew: any) => crew.coordinates && crew.coordinates.lat && crew.coordinates.lng)
            .map((crew: any) => ({
              id: crew.id,
              name: crew.name || crew.CrewName || 'Unnamed Crew',
              city: crew.city || crew.City || '',
              country: crew.country || crew.Country || '',
              lat: crew.coordinates.lat,
              lng: crew.coordinates.lng,
              memberCount: crew.memberCount || crew.ApproxMemberCount || 0,
              status: crew.status || crew.CrewStatus || 'Unknown',
              pageStatus: crew.Status || 'Unknown'
            }));
          fromStaticFile = true;
          console.log(`✅ Loaded ${mapData.length} crews from static file`);
        }
      }
    } catch (error) {
      console.warn('⚠️ Failed to load from static file:', error);
    }

    // If no static data, fetch from Airtable
    if (mapData.length === 0) {
      console.log('🔄 Fetching fresh data from Airtable');
      const crews = await airtableService.getAllCrews();
      
      mapData = crews
        .filter(crew => crew.HeadquarterLatitude && crew.HeadquarterLongitude)
        .map(crew => ({
          id: crew.id,
          name: crew.CrewName || 'Unnamed Crew',
          city: crew.City || '',
          country: crew.Country || '',
          lat: crew.HeadquarterLatitude!,
          lng: crew.HeadquarterLongitude!,
          memberCount: crew.ApproxMemberCount || 0,
          status: crew.CrewStatus || 'Unknown',
          pageStatus: crew.Status || 'Unknown'
        }));
      
      console.log(`✅ Loaded ${mapData.length} crews from Airtable`);
      
      // Cache the data to file for next time
      try {
        const cacheData = {
          crews: mapData,
          lastUpdated: new Date().toISOString(),
          source: 'airtable'
        };
        
        // Ensure directory exists
        const cacheDir = path.dirname(MAP_CACHE_PATH);
        if (!fs.existsSync(cacheDir)) {
          fs.mkdirSync(cacheDir, { recursive: true });
        }
        
        fs.writeFileSync(MAP_CACHE_PATH, JSON.stringify(cacheData, null, 2));
        console.log('💾 Cached map data to file');
      } catch (error) {
        console.warn('⚠️ Failed to cache data to file:', error);
      }
    }

    // Update memory cache
    memoryCache = {
      data: mapData,
      timestamp: now,
      bounds: requestedBounds
    };

    // Filter by bounds if requested
    let filteredCrews = mapData;
    if (requestedBounds) {
      filteredCrews = mapData.filter(crew => 
        crew.lat >= requestedBounds!.south &&
        crew.lat <= requestedBounds!.north &&
        crew.lng >= requestedBounds!.west &&
        crew.lng <= requestedBounds!.east
      );
      console.log(`🗺️ Filtered to ${filteredCrews.length} crews within bounds`);
    }
    
    // Apply limit if requested
    if (requestedLimit && requestedLimit > 0) {
      filteredCrews = filteredCrews.slice(0, requestedLimit);
      console.log(`🔢 Limited to ${filteredCrews.length} crews`);
    }

    res.status(200).json({
      crews: filteredCrews,
      total: filteredCrews.length,
      cached: fromStaticFile,
      lastUpdated: new Date().toISOString(),
      bounds: requestedBounds
    });

  } catch (error) {
    console.error('Error in map-data API:', error);
    res.status(500).json({ 
      error: 'Failed to fetch map data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}