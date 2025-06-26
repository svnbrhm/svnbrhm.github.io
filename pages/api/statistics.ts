import { NextApiRequest, NextApiResponse } from 'next';
import { NextApiRequest, NextApiResponse } from 'next';
import { airtableService } from '../../lib/airtable';
import fs from 'fs';
import path from 'path';

const STATS_FILE_PATH = path.join(process.cwd(), 'public/data/statistics.json');

// Cache duration in milliseconds (1 hour)
const CACHE_DURATION = 60 * 60 * 1000;

interface CachedStatistics {
  data: {
    activeCrews: number;
    totalRunners: number;
    cities: number;
    countries: number;
    routes: number;
    events: number;
  };
  lastUpdated: string;
  nextUpdate: string;
}

/**
 * Statistics API endpoint with intelligent caching
 * 
 * This endpoint:
 * 1. First tries to serve cached statistics from /public/data/statistics.json
 * 2. If cache is stale or missing, fetches fresh data from Airtable
 * 3. Updates the cache file for future requests
 * 4. Returns statistics with cache metadata
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CachedStatistics | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Try to read cached statistics
    let cachedStats: CachedStatistics | null = null;
    let shouldRefresh = false;

    try {
      if (fs.existsSync(STATS_FILE_PATH)) {
        const fileContent = fs.readFileSync(STATS_FILE_PATH, 'utf8');
        cachedStats = JSON.parse(fileContent);
        
        // Check if cache is stale (older than CACHE_DURATION)
        const lastUpdated = new Date(cachedStats!.lastUpdated);
        const now = new Date();
        const timeDiff = now.getTime() - lastUpdated.getTime();
        
        shouldRefresh = timeDiff > CACHE_DURATION;
        
        console.log(`Statistics cache: ${shouldRefresh ? 'STALE' : 'FRESH'} (${Math.round(timeDiff / 1000 / 60)} minutes old)`);
      } else {
        console.log('Statistics cache: NOT FOUND');
        shouldRefresh = true;
      }
    } catch (cacheError) {
      console.warn('Error reading statistics cache:', cacheError);
      shouldRefresh = true;
    }

    // If we have fresh cached data, return it immediately
    if (cachedStats && !shouldRefresh) {
      console.log('Serving cached statistics');
      return res.status(200).json(cachedStats);
    }

    // Fetch fresh data from Airtable
    console.log('Fetching fresh statistics from Airtable...');
    const freshStats = await airtableService.getGlobalStatistics();
    
    const now = new Date();
    const nextUpdate = new Date(now.getTime() + CACHE_DURATION);
    
    const newCachedStats: CachedStatistics = {
      data: freshStats,
      lastUpdated: now.toISOString(),
      nextUpdate: nextUpdate.toISOString()
    };

    // Update cache file
    try {
      // Ensure directory exists
      const dataDir = path.dirname(STATS_FILE_PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      fs.writeFileSync(STATS_FILE_PATH, JSON.stringify(newCachedStats, null, 2));
      console.log('Statistics cache updated successfully');
    } catch (writeError) {
      console.error('Error updating statistics cache:', writeError);
      // Continue anyway - we can still serve the fresh data
    }

    return res.status(200).json(newCachedStats);

  } catch (error) {
    console.error('Error in statistics API:', error);
    
    // If we have any cached data (even if stale), serve it as fallback
    if (cachedStats) {
      console.log('Serving stale cached statistics as fallback');
      return res.status(200).json(cachedStats);
    }
    
    return res.status(500).json({ 
      error: 'Failed to fetch statistics' 
    });
  }
}