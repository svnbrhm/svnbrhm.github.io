const https = require('https');

// Airtable configuration
const AIRTABLE_BASE_ID = 'appmeNztbDlnHVW76';
const AIRTABLE_TOKEN = 'patwpEkvioNoGvdsF.2bbb560e8664cf5387e24c1b7071a0c43ab452139856f749f0d8fbb465fa218c';

// Table IDs
const TABLE_IDS = {
  CREWS: 'tbl76VCXwPoucGZxf',
  TEAM_MEMBERS: 'tbl3bxAbqpwiY3PQm',
  RUN_SCHEDULES: 'tblWVRZImWj8Wx5L1',
  CREW_MEDIA: 'tblZsfIBlCssAzwyZ',
  RUNNING_EVENTS: 'tblGpZHOcRt6RFfUK',
  RUNNING_ROUTES: 'tbl605OnaGj8t0gCd'
};

function makeAirtableRequest(tableName, tableId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.airtable.com',
      port: 443,
      path: `/v0/${AIRTABLE_BASE_ID}/${tableId}?maxRecords=100`,
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
          if (jsonData.records) {
            resolve(jsonData.records);
          } else {
            console.error(`❌ No records found for ${tableName}:`, jsonData);
            resolve([]);
          }
        } catch (error) {
          console.error(`❌ JSON parse error for ${tableName}: ${error.message}`);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error(`❌ Request error for ${tableName}: ${error.message}`);
      reject(error);
    });

    req.end();
  });
}

async function checkStatusValues() {
  console.log('🔍 Checking Status values across all tables...\n');
  
  for (const [tableName, tableId] of Object.entries(TABLE_IDS)) {
    try {
      console.log(`📋 Checking ${tableName} table...`);
      const records = await makeAirtableRequest(tableName, tableId);
      
      if (records.length === 0) {
        console.log(`   ⚠️  No records found in ${tableName}`);
        continue;
      }
      
      // Extract unique Status values
      const statusValues = new Set();
      let hasStatusField = false;
      
      records.forEach(record => {
        if (record.fields.Status !== undefined) {
          hasStatusField = true;
          statusValues.add(record.fields.Status);
        }
      });
      
      if (!hasStatusField) {
        console.log(`   ℹ️  No Status field found in ${tableName}`);
      } else {
        console.log(`   ✅ Status values in ${tableName}:`, Array.from(statusValues));
        console.log(`   📊 Total records: ${records.length}, Records with Status: ${records.filter(r => r.fields.Status !== undefined).length}`);
      }
      
    } catch (error) {
      console.error(`❌ Error checking ${tableName}: ${error.message}`);
    }
    
    console.log(''); // Empty line for readability
  }
}

// Run the check
checkStatusValues().catch(console.error);