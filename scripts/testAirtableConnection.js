const https = require('https');

// Airtable configuration from development server logs
const AIRTABLE_BASE_ID = 'appmeNztbDlnHVW76';
const AIRTABLE_TOKEN = 'patwpEkvioNoGvdsF.2bbb560e8664cf5387e24c1b7071a0c43ab452139856f749f0d8fbb465fa218c';
const CREWS_TABLE_ID = 'tbl76VCXwPoucGZxf'; // Correct table ID from AI_CONTEXT.md

console.log('🔍 Testing Airtable connection...');
console.log(`Base ID: ${AIRTABLE_BASE_ID}`);
console.log(`Token: ${AIRTABLE_TOKEN.substring(0, 10)}...`);
console.log(`Table ID: ${CREWS_TABLE_ID}`);

// Simple API test
function testAirtableAPI() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.airtable.com',
      port: 443,
      path: `/v0/${AIRTABLE_BASE_ID}/${CREWS_TABLE_ID}?maxRecords=5`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    console.log(`🔗 Making request to: https://${options.hostname}${options.path}`);
    console.log(`🔑 Authorization: Bearer ${AIRTABLE_TOKEN.substring(0, 20)}...`);

    const req = https.request(options, (res) => {
      let data = '';
      
      console.log(`📡 Response status: ${res.statusCode}`);
      console.log('📡 Response headers:', res.headers);
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📡 Response data length: ${data.length}`);
        console.log('📡 Response data:', data);
        
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

// Run the test
async function main() {
  try {
    console.log('\n🚀 Starting API test...');
    const result = await testAirtableAPI();
    console.log('\n✅ API test successful!');
    console.log(`Records found: ${result.records ? result.records.length : 0}`);
    
    if (result.records && result.records.length > 0) {
      console.log('\n📋 Sample record fields:');
      const firstRecord = result.records[0];
      console.log('Available fields:', Object.keys(firstRecord.fields));
      
      if (firstRecord.fields.City) {
        console.log(`Sample city: ${firstRecord.fields.City}`);
      }
      if (firstRecord.fields.Country) {
        console.log(`Sample country: ${firstRecord.fields.Country}`);
      }
    }
  } catch (error) {
    console.error('\n❌ API test failed:', error.message);
  }
}

main();