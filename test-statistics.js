// Test script to debug statistics issue
const { airtableService } = require('./lib/airtable');

async function testStatistics() {
  console.log('Testing getGlobalStatistics function...');
  
  try {
    const stats = await airtableService.getGlobalStatistics();
    console.log('Statistics result:', stats);
  } catch (error) {
    console.error('Error testing statistics:', error);
  }
}

testStatistics();