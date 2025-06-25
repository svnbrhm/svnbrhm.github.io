const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables manually
function loadEnvFile() {
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, '');
          process.env[key] = value;
        }
      }
    });
  } catch (error) {
    console.log('Could not load .env.local file:', error.message);
  }
}

loadEnvFile();

/**
 * Script to analyze and count unique cities and countries from Airtable data
 * This will help debug the discrepancy between manual count (188 cities) and automated count
 */

// Airtable configuration from development server logs
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || 'appmeNztbDlnHVW76';
const AIRTABLE_TOKEN = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN || 'patwpEkvioNoGvdsF.2bbb560e8664cf5387e24c1b7071a0c43ab452139856f749f0d8fbb465fa218c';
const CREWS_TABLE_ID = 'tbl76VCXwPoucGZxf'; // Correct table ID from AI_CONTEXT.md

console.log('🔍 Using Airtable configuration:');
console.log(`Base ID: ${AIRTABLE_BASE_ID}`);
console.log(`Token: ${AIRTABLE_TOKEN.substring(0, 10)}...`);
console.log(`Crews Table ID: ${CREWS_TABLE_ID}`);

// Function to make Airtable API requests
function makeAirtableRequest(url) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.airtable.com',
      path: url,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    console.log(`🔗 Making request to: ${options.hostname}${options.path}`);
    console.log(`🔑 Authorization header: ${options.headers.Authorization.substring(0, 20)}...`);
    
    const req = https.request(options, (res) => {
      let data = '';
      
      console.log(`📡 Response status: ${res.statusCode}`);
      console.log('📡 Response headers:', res.headers);
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📡 Response data length: ${data.length}`);
        if (data.length < 1000) {
          console.log(`📡 Response data: ${data}`);
        } else {
          console.log(`📡 Response data (first 500 chars): ${data.substring(0, 500)}...`);
        }
        
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          console.error(`❌ JSON parse error: ${error.message}`);
          console.error(`❌ Raw data: ${data}`);
          reject(new Error(`Failed to parse JSON: ${error.message}`));
        }
      });
    });
    
    req.on('error', (error) => {
      console.error(`❌ Request error: ${error.message}`);
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
      let url = `/v0/${AIRTABLE_BASE_ID}/${tableId}?pageSize=100`;
      if (offset) {
        url += `&offset=${offset}`;
      }
      
      console.log(`📡 Fetching records from: ${url}`);
      const response = await makeAirtableRequest(url);
      
      if (response.records) {
        allRecords = allRecords.concat(response.records);
        offset = response.offset;
        console.log(`   Retrieved ${response.records.length} records (total: ${allRecords.length})`);
      } else {
        console.error('❌ Unexpected response format:', response);
        break;
      }
    } catch (error) {
      console.error('❌ Error fetching records:', error.message);
      break;
    }
  } while (offset);
  
  return allRecords;
}

async function analyzeCitiesAndCountries() {
  try {
    console.log('🔍 Analyzing cities and countries from Airtable data...');
    console.log(`🔗 Base ID: ${AIRTABLE_BASE_ID}`);
    console.log(`📋 Table ID: ${CREWS_TABLE_ID}`);
    
    // Get all crew records
    const allCrews = await fetchAllRecords(CREWS_TABLE_ID);
    console.log(`\n📊 Total crew records found: ${allCrews.length}`);
    
    // Filter for published crews only
    const publishedCrews = allCrews.filter(crew => crew.fields.Status === 'Published');
    console.log(`✅ Published crews: ${publishedCrews.length}`);
    
    // Analyze cities
    const cityData = [];
    const countryData = [];
    
    publishedCrews.forEach((crew, index) => {
      const city = crew.fields.City;
      const country = crew.fields.Country;
      
      if (city && typeof city === 'string') {
        cityData.push({
          index: index + 1,
          crewName: crew.fields.Name || 'Unknown',
          city: city.trim(),
          cityLower: city.trim().toLowerCase()
        });
      }
      
      if (country && typeof country === 'string') {
        countryData.push({
          index: index + 1,
          crewName: crew.fields.Name || 'Unknown',
          country: country.trim(),
          countryLower: country.trim().toLowerCase()
        });
      }
    });
    
    // Count unique cities (case-insensitive)
    const uniqueCitiesSet = new Set(cityData.map(item => item.cityLower));
    const uniqueCities = Array.from(uniqueCitiesSet).sort();
    
    // Count unique countries (case-insensitive)
    const uniqueCountriesSet = new Set(countryData.map(item => item.countryLower));
    const uniqueCountries = Array.from(uniqueCountriesSet).sort();
    
    console.log('\n🏙️  CITIES ANALYSIS:');
    console.log(`Total unique cities (case-insensitive): ${uniqueCities.length}`);
    console.log('\nAll unique cities:');
    uniqueCities.forEach((city, index) => {
      const count = cityData.filter(item => item.cityLower === city).length;
      console.log(`${index + 1}. ${city} (${count} crew${count > 1 ? 's' : ''})`);
    });
    
    console.log('\n🌍 COUNTRIES ANALYSIS:');
    console.log(`Total unique countries (case-insensitive): ${uniqueCountries.length}`);
    console.log('\nAll unique countries:');
    uniqueCountries.forEach((country, index) => {
      const count = countryData.filter(item => item.countryLower === country).length;
      console.log(`${index + 1}. ${country} (${count} crew${count > 1 ? 's' : ''})`);
    });
    
    // Check for potential data quality issues
    console.log('\n🔍 DATA QUALITY CHECK:');
    
    // Find crews without city data
    const crewsWithoutCity = publishedCrews.filter(crew => !crew.fields.City || typeof crew.fields.City !== 'string');
    if (crewsWithoutCity.length > 0) {
      console.log(`⚠️  Crews without city data: ${crewsWithoutCity.length}`);
      crewsWithoutCity.slice(0, 10).forEach(crew => {
        console.log(`   - ${crew.fields.Name || 'Unknown crew'} (City: ${crew.fields.City})`);
      });
      if (crewsWithoutCity.length > 10) {
        console.log(`   ... and ${crewsWithoutCity.length - 10} more`);
      }
    }
    
    // Find crews without country data
    const crewsWithoutCountry = publishedCrews.filter(crew => !crew.fields.Country || typeof crew.fields.Country !== 'string');
    if (crewsWithoutCountry.length > 0) {
      console.log(`⚠️  Crews without country data: ${crewsWithoutCountry.length}`);
      crewsWithoutCountry.slice(0, 10).forEach(crew => {
        console.log(`   - ${crew.fields.Name || 'Unknown crew'} (Country: ${crew.fields.Country})`);
      });
      if (crewsWithoutCountry.length > 10) {
        console.log(`   ... and ${crewsWithoutCountry.length - 10} more`);
      }
    }
    
    // Look for potential duplicates with different casing
    console.log('\n🔄 POTENTIAL CASE VARIATIONS:');
    const cityVariations = {};
    cityData.forEach(item => {
      const lower = item.cityLower;
      if (!cityVariations[lower]) {
        cityVariations[lower] = new Set();
      }
      cityVariations[lower].add(item.city);
    });
    
    Object.entries(cityVariations).forEach(([lowerCity, variations]) => {
      if (variations.size > 1) {
        console.log(`📍 "${lowerCity}" has variations: ${Array.from(variations).join(', ')}`);
      }
    });
    
    // Summary
    console.log('\n📋 SUMMARY:');
    console.log(`✅ Published crews: ${publishedCrews.length}`);
    console.log(`🏙️  Unique cities: ${uniqueCities.length}`);
    console.log(`🌍 Unique countries: ${uniqueCountries.length}`);
    console.log(`❌ Crews missing city: ${crewsWithoutCity.length}`);
    console.log(`❌ Crews missing country: ${crewsWithoutCountry.length}`);
    
    // Compare with your manual count
    console.log('\n🔍 COMPARISON WITH MANUAL COUNT:');
    console.log('Manual count: 188 cities');
    console.log(`Automated count: ${uniqueCities.length} cities`);
    console.log(`Difference: ${188 - uniqueCities.length} cities`);
    
    if (uniqueCities.length !== 188) {
      console.log('\n💡 POSSIBLE REASONS FOR DISCREPANCY:');
      console.log('1. Different filtering criteria (published vs all crews)');
      console.log('2. Data entry variations or typos');
      console.log('3. Empty/null city fields');
      console.log('4. Case sensitivity differences');
      console.log('5. Whitespace or special character differences');
      console.log('6. Records that were added/removed since manual count');
    }
    
    // Save detailed results to file
    const results = {
      timestamp: new Date().toISOString(),
      summary: {
        totalCrews: allCrews.length,
        publishedCrews: publishedCrews.length,
        uniqueCities: uniqueCities.length,
        uniqueCountries: uniqueCountries.length,
        crewsWithoutCity: crewsWithoutCity.length,
        crewsWithoutCountry: crewsWithoutCountry.length
      },
      cities: uniqueCities,
      countries: uniqueCountries,
      cityVariations: Object.fromEntries(
        Object.entries(cityVariations).filter(([, variations]) => variations.size > 1)
      )
    };
    
    const outputFile = path.join(__dirname, 'city-country-analysis.json');
    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
    console.log(`\n💾 Detailed results saved to: ${outputFile}`);
    
  } catch (error) {
    console.error('❌ Error analyzing cities and countries:', error);
  }
}

// Run the analysis
analyzeCitiesAndCountries();