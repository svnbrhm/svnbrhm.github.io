import type { NextApiRequest, NextApiResponse } from 'next';
import { airtableService } from '../../lib/airtable';

type Data = {
  success: boolean;
  message: string;
  config?: {
    hasApiKey: boolean;
    hasBaseId: boolean;
  };
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'GET') {
    res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
    return;
  }

  try {
    // Check configuration
    const hasApiKey = !!process.env.NEXT_PUBLIC_AIRTABLE_PERSONAL_ACCESS_TOKEN;
    const hasBaseId = !!process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;

    if (!hasApiKey || !hasBaseId) {
      res.status(500).json({
        success: false,
        message: 'Missing Airtable configuration',
        config: { hasApiKey, hasBaseId }
      });
      return;
    }

    // Test connection
    const connectionTest = await airtableService.testConnection();

    if (connectionTest) {
      res.status(200).json({
        success: true,
        message: 'Airtable connection successful',
        config: { hasApiKey, hasBaseId }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Airtable connection failed',
        config: { hasApiKey, hasBaseId }
      });
    }
  } catch (error) {
    console.error('Airtable test error:', error);
    res.status(500).json({
      success: false,
      message: 'Airtable test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}