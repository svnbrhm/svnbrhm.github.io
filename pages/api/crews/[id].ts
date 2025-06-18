import type { NextApiRequest, NextApiResponse } from 'next';
import { airtableService } from '../../../lib/airtable';
import { Crew } from '../../../types/crew';

type Data = {
  crew?: Crew;
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

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    res.status(400).json({ error: 'Crew ID is required' });
    return;
  }

  try {
    const crew = await airtableService.getCrewById(id);

    if (!crew) {
      res.status(404).json({ error: 'Crew not found' });
      return;
    }

    res.status(200).json({ crew });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch crew',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}