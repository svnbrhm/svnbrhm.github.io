import { NextApiRequest, NextApiResponse } from 'next';
import { airtableService } from '../../lib/airtable';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const isConnected = await airtableService.testConnection();
    
    const envCheck = {
      hasPersonalAccessToken: Boolean(process.env.NEXT_PUBLIC_AIRTABLE_PERSONAL_ACCESS_TOKEN),
      hasBaseId: Boolean(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID),
      personalAccessTokenLength: process.env.NEXT_PUBLIC_AIRTABLE_PERSONAL_ACCESS_TOKEN?.length || 0,
      baseIdLength: process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID?.length || 0,
      // Legacy API key check (deprecated)
      hasLegacyApiKey: Boolean(process.env.NEXT_PUBLIC_AIRTABLE_API_KEY),
    };

    res.status(200).json({
      connected: isConnected,
      environment: envCheck,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test connection error:', error);
    res.status(500).json({ 
      error: 'Failed to test connection',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}