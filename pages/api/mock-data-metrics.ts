import { NextApiRequest, NextApiResponse } from 'next';
import { mockDataTracker } from '../../lib/mockDataTracker';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const metrics = mockDataTracker.getMetrics();
    const summary = mockDataTracker.getUsageSummary(24);
    const isCurrentlyUsingMock = mockDataTracker.isUsingMockData();

    const response = {
      status: isCurrentlyUsingMock ? 'using_mock' : (summary.count > 0 ? 'recent_fallbacks' : 'all_airtable'),
      isCurrentlyUsingMock,
      metrics,
      summary24h: summary,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      airtableConfigured: !!(process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN && process.env.AIRTABLE_BASE_ID)
    };

    // Set appropriate cache headers
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching mock data metrics:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}