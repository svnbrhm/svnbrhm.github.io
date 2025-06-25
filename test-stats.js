// Simple test to check Airtable API directly
const https = require('https');

const AIRTABLE_PERSONAL_ACCESS_TOKEN = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN || 'patwpEkvioNoGvdsF.2bbb560e8664cf5387e24c1b7071a0c43ab452139856f749f0d8fbb465fa218c';
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || 'appmeNztbDlnHVW76';

async function testAirtableAPI() {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Crews`;
  
  console.log('Testing Airtable API...');
  console.log('URL:', url);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_PERSONAL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error('Response not OK:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('Total records found:', data.records?.length || 0);
    
    if (data.records && data.records.length > 0) {
      console.log('First record:', JSON.stringify(data.records[0], null, 2));
      
      // Count published crews
      const publishedCrews = data.records.filter(record => 
        record.fields.Status === 'Published'
      );
      console.log('Published crews:', publishedCrews.length);
      
      // Count total runners
      const totalRunners = publishedCrews.reduce((sum, crew) => {
        const memberCount = crew.fields.ApproxMemberCount || 0;
        return sum + memberCount;
      }, 0);
      console.log('Total runners:', totalRunners);
      
      // Count unique cities and countries
      const cities = new Set();
      const countries = new Set();
      
      data.records.forEach(record => {
        if (record.fields.City) cities.add(record.fields.City);
        if (record.fields.Country) countries.add(record.fields.Country);
      });
      
      console.log('Unique cities:', cities.size);
      console.log('Unique countries:', countries.size);
    }
    
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

testAirtableAPI();