// API endpoint to test statistics
import { airtableService } from '../../lib/airtable';

export default async function handler(req, res) {
  console.log('API: Testing getGlobalStatistics function...');
  
  try {
    const stats = await airtableService.getGlobalStatistics();
    console.log('API: Statistics result:', stats);
    res.status(200).json({ success: true, stats });
  } catch (error) {
    console.error('API: Error testing statistics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}