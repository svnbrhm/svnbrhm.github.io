const https = require('https');

// Airtable configuration from development server logs
const AIRTABLE_BASE_ID = 'appmeNztbDlnHVW76';
const AIRTABLE_TOKEN = 'patwpEkvioNoGvdsF.2bbb560e8664cf5387e24c1b7071a0c43ab452139856f749f0d8fbb465fa218c';
const CREWS_TABLE_ID = 'tbl76VCXwPoucGZxf'; // Correct table ID from AI_CONTEXT.md

console.log('🔍 Analyzing ALL crews (including non-published):');
console.log(`Base ID: ${AIRTABLE_BASE_ID}`);
console.log(`Token: ${AIRTABLE_TOKEN.substring(0, 10)}...`);
console.log(`Table ID: ${CREWS_TABLE_ID}`);

// Function to make Airtable API requests
function makeAirtableRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.airtable.com',
      port: 443,
      path: `/v0/${AIRTABLE_BASE_ID}${path}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          if (res.statusCode !== 200) {
            reject(new Error(`API Error ${res.statusCode}: ${jsonData.error?.message || data}`));
          } else {
            resolve(jsonData);
          }
        } catch (error) {
          reject(new Error(`Failed to parse JSON: ${error.message}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

// Function to fetch all records with pagination
async function fetchAllRecords(tableId) {
  let allRecords = [];
  let offset = null;
  
  do {
    try {
      const path = `/${tableId}${offset ? `?offset=${offset}` : ''}`;
      console.log(`📡 Fetching records from: ${path}`);
      
      const response = await makeAirtableRequest(path);
      
      if (response.records) {
        allRecords = allRecords.concat(response.records);
        console.log(`📊 Fetched ${response.records.length} records (total: ${allRecords.length})`);
      }
      
      offset = response.offset;
    } catch (error) {
      console.error(`❌ Error fetching records: ${error.message}`);
      break;
    }
  } while (offset);
  
  return allRecords;
}

// Main analysis function
async function analyzeAllCrews() {
  try {
    console.log('\n🚀 Starting analysis of ALL crews...');
    
    // Fetch all crew records
    const allCrews = await fetchAllRecords(CREWS_TABLE_ID);
    console.log(`\n📊 Total crew records found: ${allCrews.length}`);
    
    // Analyze by status
    const statusCounts = {};
    allCrews.forEach(crew => {
      const status = crew.fields.Status || 'undefined';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    console.log('\n📈 Crews by Status:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   ${status}: ${count} crews`);
    });
    
    // Analyze cities for ALL crews
    const allCities = new Set();
    const allCountries = new Set();
    
    allCrews.forEach(crew => {
      const city = crew.fields.City;
      const country = crew.fields.Country;
      
      if (city && typeof city === 'string' && city.trim()) {
        allCities.add(city.toLowerCase().trim());
      }
      
      if (country && typeof country === 'string' && country.trim()) {
        allCountries.add(country.toLowerCase().trim());
      }
    });
    
    // Analyze cities for PUBLISHED crews only
    const publishedCities = new Set();
    const publishedCountries = new Set();
    
    const publishedCrews = allCrews.filter(crew => crew.fields.Status === 'publish');
    
    publishedCrews.forEach(crew => {
      const city = crew.fields.City;
      const country = crew.fields.Country;
      
      if (city && typeof city === 'string' && city.trim()) {
        publishedCities.add(city.toLowerCase().trim());
      }
      
      if (country && typeof country === 'string' && country.trim()) {
        publishedCountries.add(country.toLowerCase().trim());
      }
    });
    
    console.log('\n🏙️  CITIES ANALYSIS:');
    console.log(`All crews - Unique cities: ${allCities.size}`);
    console.log(`Published crews - Unique cities: ${publishedCities.size}`);
    console.log(`Difference: ${allCities.size - publishedCities.size} cities`);
    
    console.log('\n🌍 COUNTRIES ANALYSIS:');
    console.log(`All crews - Unique countries: ${allCountries.size}`);
    console.log(`Published crews - Unique countries: ${publishedCountries.size}`);
    console.log(`Difference: ${allCountries.size - publishedCountries.size} countries`);
    
    // Find cities that are in all crews but not in published crews
    const unpublishedCities = [...allCities].filter(city => !publishedCities.has(city));
    
    if (unpublishedCities.length > 0) {
      console.log('\n🔍 Cities from non-published crews:');
      unpublishedCities.forEach(city => {
        console.log(`   - ${city}`);
      });
    }
    
    console.log('\n📋 COMPARISON WITH MANUAL COUNT:');
    console.log(`Manual count: 188 cities`);
    console.log(`All crews count: ${allCities.size} cities`);
    console.log(`Published crews count: ${publishedCities.size} cities`);
    console.log(`Difference (Manual vs All): ${188 - allCities.size} cities`);
    console.log(`Difference (Manual vs Published): ${188 - publishedCities.size} cities`);
    
    // Save detailed results
    const results = {
      timestamp: new Date().toISOString(),
      summary: {
        totalCrews: allCrews.length,
        publishedCrews: publishedCrews.length,
        allCrewsCities: allCities.size,
        publishedCrewsCities: publishedCities.size,
        allCrewsCountries: allCountries.size,
        publishedCrewsCountries: publishedCountries.size,
        unpublishedCitiesCount: unpublishedCities.length
      },
      statusBreakdown: statusCounts,
      allCities: [...allCities].sort(),
      publishedCities: [...publishedCities].sort(),
      unpublishedCities: unpublishedCities.sort(),
      allCountries: [...allCountries].sort(),
      publishedCountries: [...publishedCountries].sort()
    };
    
    const fs = require('fs');
    const outputPath = '/Users/svenabraham/Documents/Eigene Projekte/GitHub/codellm_runningcrews.github.io/scripts/all-crews-analysis.json';
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`\n💾 Detailed results saved to: ${outputPath}`);
    
  } catch (error) {
    console.error('\n❌ Analysis failed:', error.message);
  }
}

// Run the analysis
analyzeAllCrews();