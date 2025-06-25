const fetch = require('node-fetch');

// Hardcoded Airtable configuration (from server logs)
const AIRTABLE_BASE_ID = 'appmeNztbDlnHVW76';
const AIRTABLE_PERSONAL_ACCESS_TOKEN = 'patwpEkvioNoGvdsF.2bbb560e8664cf5387e24c1b7071a0c43ab452139856f749f0d8fbb465fa218c';
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;
const CREWS_TABLE_ID = 'tbl76VCXwPoucGZxf'; // Correct table ID

const headers = {
  'Authorization': `Bearer ${AIRTABLE_PERSONAL_ACCESS_TOKEN}`,
  'Content-Type': 'application/json',
};

async function fetchAllCrews() {
  const allRecords = [];
  let offset;
  
  do {
    const url = new URL(`${AIRTABLE_API_URL}/${CREWS_TABLE_ID}`);
    if (offset) {
      url.searchParams.append('offset', offset);
    }
    
    const response = await fetch(url.toString(), { headers });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    allRecords.push(...data.records);
    offset = data.offset;
    
    console.log(`Fetched ${data.records.length} records, total: ${allRecords.length}`);
  } while (offset);
  
  return allRecords;
}

async function testUpdatedStatistics() {
  try {
    console.log('Testing updated statistics calculation...');
    console.log('='.repeat(50));
    
    // Fetch all crews
    const allCrews = await fetchAllCrews();
    console.log(`\nTotal crews fetched: ${allCrews.length}`);
    
    // Analyze by status
    const statusCounts = {};
    allCrews.forEach(crew => {
      const status = crew.fields.Status || 'undefined';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    console.log('\nCrew counts by status:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });
    
    // Filter published crews
    const publishedCrews = allCrews.filter(crew => crew.fields.Status === 'Published');
    console.log(`\nPublished crews: ${publishedCrews.length}`);
    
    // Calculate statistics for ALL crews (new approach)
    const allCrewsCities = new Set(
      allCrews
        .map(crew => crew.fields.City?.trim().toLowerCase())
        .filter(Boolean)
    );
    
    const allCrewsCountries = new Set(
      allCrews
        .map(crew => crew.fields.Country?.trim().toLowerCase())
        .filter(Boolean)
    );
    
    // Calculate statistics for PUBLISHED crews only (old approach)
    const publishedCrewsCities = new Set(
      publishedCrews
        .map(crew => crew.fields.City?.trim().toLowerCase())
        .filter(Boolean)
    );
    
    const publishedCrewsCountries = new Set(
      publishedCrews
        .map(crew => crew.fields.Country?.trim().toLowerCase())
        .filter(Boolean)
    );
    
    console.log('\n' + '='.repeat(50));
    console.log('STATISTICS COMPARISON:');
    console.log('='.repeat(50));
    
    console.log('\nOLD APPROACH (Published crews only):');
    console.log(`  Cities: ${publishedCrewsCities.size}`);
    console.log(`  Countries: ${publishedCrewsCountries.size}`);
    
    console.log('\nNEW APPROACH (All crews):');
    console.log(`  Cities: ${allCrewsCities.size}`);
    console.log(`  Countries: ${allCrewsCountries.size}`);
    
    console.log('\nDIFFERENCE:');
    console.log(`  Cities: +${allCrewsCities.size - publishedCrewsCities.size}`);
    console.log(`  Countries: +${allCrewsCountries.size - publishedCrewsCountries.size}`);
    
    console.log('\nEXPECTED RESULTS:');
    console.log('  Cities: 188 (from manual count)');
    console.log('  Countries: 60 (from analysis)');
    
    console.log('\nVERIFICATION:');
    console.log(`  Cities match expected: ${allCrewsCities.size === 188 ? '✅ YES' : '❌ NO'}`);
    console.log(`  Countries match expected: ${allCrewsCountries.size === 60 ? '✅ YES' : '❌ NO'}`);
    
  } catch (error) {
    console.error('Error testing statistics:', error);
  }
}

testUpdatedStatistics();