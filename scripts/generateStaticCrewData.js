const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config();

// Airtable configuration
const AIRTABLE_TOKEN = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN || process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_CREWS_TABLE = 'Crews';

if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
  console.error('❌ Missing required environment variables:');
  console.error('- AIRTABLE_PERSONAL_ACCESS_TOKEN:', process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN ? '✓' : '✗');
  console.error('- AIRTABLE_BASE_ID:', AIRTABLE_BASE_ID ? '✓' : '✗');
  process.exit(1);
}

/**
 * Fetch all crews from Airtable directly
 */
async function getAllCrews() {
  const crews = [];
  let offset = null;
  
  do {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_CREWS_TABLE}${
      offset ? `?offset=${offset}` : ''
    }`;
    
    const response = await makeAirtableRequest(url);
    
    if (response.records) {
      crews.push(...response.records.map(transformCrewRecord));
    }
    
    offset = response.offset;
  } while (offset);
  
  return crews;
}

/**
 * Make HTTP request to Airtable API
 */
function makeAirtableRequest(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
        'User-Agent': 'RunningCrews-StaticGenerator/1.0'
      }
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(result);
          } else {
            reject(new Error(`Airtable API error: ${res.statusCode} - ${result.error?.message || 'Unknown error'}`));
          }
        } catch (error) {
          reject(new Error(`Failed to parse Airtable response: ${error.message}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(new Error(`Network error: ${error.message}`));
    });
    
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

/**
 * Transform Airtable crew record to our format
 */
function transformCrewRecord(record) {
  const fields = record.fields;
  
  return {
    id: record.id,
    name: fields.Name || '',
    city: fields.City || '',
    country: fields.Country || '',
    status: fields.Status || 'unknown',
    website: fields.Website || '',
    description: fields.Description || '',
    headquarterCoordinates: fields['Headquarter Coordinates'] ? {
      lat: parseFloat(fields['Headquarter Coordinates'].split(',')[0]),
      lng: parseFloat(fields['Headquarter Coordinates'].split(',')[1])
    } : null,
    // Add other fields as needed
    memberCount: fields['Member Count'] || 0,
    foundedYear: fields['Founded Year'] || null,
    socialMedia: {
      instagram: fields.Instagram || '',
      facebook: fields.Facebook || '',
      twitter: fields.Twitter || ''
    }
  };
}

// Rate limiting configuration
const GEOCODING_DELAY = 1000; // 1 second between requests
const MAX_RETRIES = 3;

// Output configuration
const OUTPUT_DIR = path.join(__dirname, '../public/data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'crews-with-coordinates.json');

/**
 * Sleep function for rate limiting
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Geocode a location using OpenStreetMap Nominatim API
 */
async function geocodeLocation(city, country, retryCount = 0) {
  if (!city || !country) {
    console.warn(`Missing city or country data: ${city}, ${country}`);
    return null;
  }

  const query = encodeURIComponent(`${city}, ${country}`);
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`;

  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'RunningCrews-StaticGenerator/1.0'
      }
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const results = JSON.parse(data);
          if (results && results.length > 0) {
            const result = results[0];
            resolve({
              lat: parseFloat(result.lat),
              lng: parseFloat(result.lon)
            });
          } else {
            console.warn(`No geocoding results for: ${city}, ${country}`);
            resolve(null);
          }
        } catch (error) {
          console.error(`Error parsing geocoding response for ${city}, ${country}:`, error.message);
          if (retryCount < MAX_RETRIES) {
            console.log(`Retrying geocoding for ${city}, ${country} (attempt ${retryCount + 1})`);
            setTimeout(() => {
              geocodeLocation(city, country, retryCount + 1).then(resolve);
            }, GEOCODING_DELAY * (retryCount + 1));
          } else {
            resolve(null);
          }
        }
      });
    });
    
    req.on('error', (error) => {
      console.error(`Network error geocoding ${city}, ${country}:`, error.message);
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying geocoding for ${city}, ${country} (attempt ${retryCount + 1})`);
        setTimeout(() => {
          geocodeLocation(city, country, retryCount + 1).then(resolve);
        }, GEOCODING_DELAY * (retryCount + 1));
      } else {
        resolve(null);
      }
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      console.error(`Timeout geocoding ${city}, ${country}`);
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying geocoding for ${city}, ${country} (attempt ${retryCount + 1})`);
        setTimeout(() => {
          geocodeLocation(city, country, retryCount + 1).then(resolve);
        }, GEOCODING_DELAY * (retryCount + 1));
      } else {
        resolve(null);
      }
    });
  });
}

/**
 * Process a single crew to add coordinates
 */
async function processCrewCoordinates(crew, index, total) {
  console.log(`Processing crew ${index + 1}/${total}: ${crew.name}`);
  
  // If crew already has coordinates from headquarters, use them
  if (crew.headquarterCoordinates?.lat && 
      crew.headquarterCoordinates?.lng) {
    console.log(`  ✓ Using existing coordinates: ${crew.headquarterCoordinates.lat}, ${crew.headquarterCoordinates.lng}`);
    return {
      ...crew,
      coordinates: crew.headquarterCoordinates,
      coordinateSource: 'headquarters'
    };
  }
  
  // Otherwise, geocode based on city and country
  if (crew.city && crew.country) {
    console.log(`  → Geocoding: ${crew.city}, ${crew.country}`);
    
    // Rate limiting
    if (index > 0) {
      await sleep(GEOCODING_DELAY);
    }
    
    const coordinates = await geocodeLocation(crew.city, crew.country);
    
    if (coordinates) {
      console.log(`  ✓ Geocoded coordinates: ${coordinates.lat}, ${coordinates.lng}`);
      return {
        ...crew,
        coordinates,
        coordinateSource: 'geocoded'
      };
    } else {
      console.log(`  ✗ Failed to geocode`);
      return {
        ...crew,
        coordinates: null,
        coordinateSource: 'failed'
      };
    }
  } else {
    console.log(`  ✗ Missing city or country data`);
    return {
      ...crew,
      coordinates: null,
      coordinateSource: 'missing_data'
    };
  }
}

/**
 * Main function to generate static crew data
 */
async function generateStaticCrewData() {
  console.log('🚀 Starting static crew data generation...');
  
  try {
    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      console.log(`Created output directory: ${OUTPUT_DIR}`);
    }
    
    // Fetch all crews from Airtable
    console.log('📡 Fetching crews from Airtable...');
    const crews = await getAllCrews();
    console.log(`Found ${crews.length} crews`);
    
    if (crews.length === 0) {
      console.warn('No crews found. Exiting.');
      return;
    }
    
    // Process each crew to add coordinates
    console.log('🌍 Processing crew coordinates...');
    const processedCrews = [];
    
    for (let i = 0; i < crews.length; i++) {
      const processedCrew = await processCrewCoordinates(crews[i], i, crews.length);
      processedCrews.push(processedCrew);
    }
    
    // Generate statistics
    const stats = {
      total: processedCrews.length,
      withCoordinates: processedCrews.filter(c => c.coordinates).length,
      fromHeadquarters: processedCrews.filter(c => c.coordinateSource === 'headquarters').length,
      geocoded: processedCrews.filter(c => c.coordinateSource === 'geocoded').length,
      failed: processedCrews.filter(c => c.coordinateSource === 'failed').length,
      missingData: processedCrews.filter(c => c.coordinateSource === 'missing_data').length,
      generatedAt: new Date().toISOString()
    };
    
    // Prepare output data
    const outputData = {
      metadata: {
        generatedAt: new Date().toISOString(),
        version: '1.0.0',
        source: 'airtable-with-geocoding',
        statistics: stats
      },
      crews: processedCrews
    };
    
    // Write to file
    console.log('💾 Writing data to file...');
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2));
    
    // Log results
    console.log('\n✅ Static crew data generation completed!');
    console.log('📊 Statistics:');
    console.log(`  Total crews: ${stats.total}`);
    console.log(`  With coordinates: ${stats.withCoordinates} (${Math.round(stats.withCoordinates/stats.total*100)}%)`);
    console.log(`  From headquarters: ${stats.fromHeadquarters}`);
    console.log(`  Geocoded: ${stats.geocoded}`);
    console.log(`  Failed geocoding: ${stats.failed}`);
    console.log(`  Missing data: ${stats.missingData}`);
    console.log(`  Output file: ${OUTPUT_FILE}`);
    console.log(`  File size: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(2)} KB`);
    
  } catch (error) {
    console.error('❌ Error generating static crew data:', error);
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  generateStaticCrewData();
}

module.exports = { generateStaticCrewData };