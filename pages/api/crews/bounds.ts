import { NextApiRequest, NextApiResponse } from 'next';
import { airtableService } from '../../../lib/airtable';
import { Crew } from '../../../types/crew';

type Data = {
  crews?: Crew[];
  error?: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { north, south, east, west, zoom } = req.query;

    // Validate required parameters
    if (!north || !south || !east || !west) {
      res.status(400).json({ 
        error: 'Missing required parameters: north, south, east, west' 
      });
      return;
    }

    // Parse coordinates
    const bounds = {
      north: parseFloat(north as string),
      south: parseFloat(south as string),
      east: parseFloat(east as string),
      west: parseFloat(west as string)
    };

    // Validate coordinates
    if (Object.values(bounds).some(isNaN)) {
      res.status(400).json({ 
        error: 'Invalid coordinates provided' 
      });
      return;
    }

    // Get crews within bounds
    const crews = await airtableService.getCrewsByBounds(bounds);

    res.status(200).json({ crews });
  } catch (error) {
    console.error('Error fetching crews by bounds:', error);
    res.status(500).json({ 
      error: 'Failed to fetch crews',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}