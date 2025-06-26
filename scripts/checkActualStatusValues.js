require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');

async function checkStatusValues() {
  try {
    console.log('Checking actual status values in Airtable...');
    console.log('Base ID:', process.env.AIRTABLE_BASE_ID);
    console.log('Token exists:', Boolean(process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN));
    
    // Make a direct request to get all crews without filtering
    const response = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/tblCjQYcLlC3cNB1E`, {
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.records) {
      console.log(`Found ${data.records.length} total records`);
      
      // Extract all unique status values
      const statusValues = new Set();
      data.records.forEach(record => {
        if (record.fields.Status) {
          statusValues.add(record.fields.Status);
        }
      });
      
      console.log('Unique Status values found:');
      statusValues.forEach(status => {
        console.log(`  - "${status}"`);
      });
      
      // Count records by status
      const statusCounts = {};
      data.records.forEach(record => {
        const status = record.fields.Status || 'null';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
      
      console.log('\nRecord counts by status:');
      Object.entries(statusCounts).forEach(([status, count]) => {
        console.log(`  - "${status}": ${count} records`);
      });
      
    } else {
      console.error('No records found or error:', data);
    }
    
  } catch (error) {
    console.error('Error checking status values:', error);
  }
}

checkStatusValues();