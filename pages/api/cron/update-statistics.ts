import { NextApiRequest, NextApiResponse } from 'next';
import { airtableService } from '../../../lib/airtable';
import fs from 'fs';
import path from 'path';

const STATS_FILE_PATH = path.join(process.cwd(), 'public/data/statistics.json');

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
 * Vercel Cron Job API endpoint for updating statistics cache
 * This endpoint is called automatically by Vercel's cron job feature
 * 
 * Schedule: Daily at 3:00 AM UTC (after crew data update at 2:00 AM)
 * 
 * To enable, add this to vercel.json:
 * {
 *   "crons": [
 *     {
 *       "path": "/api/cron/update-statistics",
 *       "schedule": "0 3 * * *"
 *     }
 *   ]
 * }
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Verify this is a cron request (Vercel sets this header)
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;
  
  // Security check: verify cron secret if set
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    console.error('Unauthorized cron request for statistics update');
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Invalid cron secret'
    });
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests are allowed'
    });
  }
  
  const startTime = Date.now();
  
  try {
    console.log('🔄 Starting scheduled statistics update...');
    
    // Fetch fresh statistics from Airtable
    const freshStats = await airtableService.getGlobalStatistics();
    
    const now = new Date();
    const nextUpdate = new Date(now.getTime() + (24 * 60 * 60 * 1000)); // Next day
    
    const cachedStats: CachedStatistics = {
      data: freshStats,
      lastUpdated: now.toISOString(),
      nextUpdate: nextUpdate.toISOString()
    };
    
    // Ensure directory exists
    const dataDir = path.dirname(STATS_FILE_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Write statistics to cache file
    fs.writeFileSync(STATS_FILE_PATH, JSON.stringify(cachedStats, null, 2));
    
    const duration = Date.now() - startTime;
    
    console.log('✅ Statistics cache updated successfully');
    console.log('📊 Updated statistics:', freshStats);
    console.log(`⏱️  Update completed in ${duration}ms`);
    
    return res.status(200).json({
      success: true,
      message: 'Statistics cache updated successfully',
      statistics: freshStats,
      duration: `${duration}ms`,
      lastUpdated: now.toISOString(),
      nextUpdate: nextUpdate.toISOString()
    });
    
  } catch (error) {
    const duration = Date.now() - startTime;
    
    console.error('❌ Error updating statistics cache:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to update statistics cache',
      message: error instanceof Error ? error.message : 'Unknown error',
      duration: `${duration}ms`
    });
  }
}