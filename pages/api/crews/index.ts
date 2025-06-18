import type { NextApiRequest, NextApiResponse } from 'next';
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
    const { city, search, slug } = req.query;

    let crews: Crew[];

    if (slug && typeof slug === 'string') {
      // Get crew by SEO slug
      const crew = await airtableService.getCrewBySlug(slug);
      crews = crew ? [crew] : [];
    } else if (search && typeof search === 'string') {
      // Search crews by name
      crews = await airtableService.searchCrews(search);
    } else if (city && typeof city === 'string') {
      // Filter crews by city
      crews = await airtableService.getCrewsByCity(city);
    } else {
      // Get all crews
      crews = await airtableService.getAllCrews();
    }

    res.status(200).json({ crews });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch crews',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}