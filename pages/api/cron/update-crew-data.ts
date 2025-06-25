import { NextApiRequest, NextApiResponse } from 'next';
// Dynamic import for CommonJS module
const { generateStaticCrewData } = require('../../../scripts/generateStaticCrewData');

/**
 * Vercel Cron Job API endpoint for updating crew data
 * This endpoint is called automatically by Vercel's cron job feature
 * 
 * To enable, add this to vercel.json:
 * {
 *   "crons": [
 *     {
 *       "path": "/api/cron/update-crew-data",
 *       "schedule": "0 2 * * *"
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
    console.error('Unauthorized cron request');
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
    console.log('🔄 Starting scheduled crew data update...');
    
    // Generate new static crew data
    await generateStaticCrewData();
    
    const duration = Date.now() - startTime;
    
    console.log(`✅ Crew data update completed in ${duration}ms`);
    
    // Trigger revalidation of pages that use crew data
    const revalidationPromises = [
      // Revalidate homepage
      fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/revalidate?path=/&secret=${process.env.REVALIDATION_SECRET}`),
      // Revalidate crews index page
      fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/revalidate?path=/crews&secret=${process.env.REVALIDATION_SECRET}`)
    ];
    
    // Wait for revalidation (but don't fail if it doesn't work)
    try {
      await Promise.all(revalidationPromises);
      console.log('✅ Page revalidation triggered');
    } catch (revalidationError) {
      console.warn('⚠️ Page revalidation failed:', revalidationError);
    }
    
    return res.status(200).json({
      success: true,
      message: 'Crew data updated successfully',
      duration,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    const duration = Date.now() - startTime;
    
    console.error('❌ Crew data update failed:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to update crew data',
      message: error instanceof Error ? error.message : 'Unknown error',
      duration,
      timestamp: new Date().toISOString()
    });
  }
}

// Export config for Vercel
export const config = {
  maxDuration: 60, // 1 minute timeout (max for hobby plan)
};