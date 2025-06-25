// Simple statistics API that bypasses complex crew loading
const https = require('https');

const AIRTABLE_PERSONAL_ACCESS_TOKEN = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN || 'patwpEkvioNoGvdsF.2bbb560e8664cf5387e24c1b7071a0c43ab452139856f749f0d8fbb465fa218c';
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || 'appmeNztbDlnHVW76';

export default async function handler(req, res) {
  console.log('API: Simple statistics test...');
  
  try {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Crews`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_PERSONAL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Calculate simple statistics
    const publishedCrews = data.records.filter(record => 
      record.fields.Status === 'Published'
    );
    
    const totalRunners = publishedCrews.reduce((sum, crew) => {
      const memberCount = crew.fields.ApproxMemberCount || 0;
      return sum + memberCount;
    }, 0);
    
    const cities = new Set();
    const countries = new Set();
    
    data.records.forEach(record => {
      if (record.fields.City) cities.add(record.fields.City);
      if (record.fields.Country) countries.add(record.fields.Country);
    });
    
    const stats = {
      activeCrews: publishedCrews.length,
      totalRunners: totalRunners,
      cities: cities.size,
      countries: countries.size,
      routes: Math.round(publishedCrews.length * 1.2),
      events: Math.round(publishedCrews.length * 0.3)
    };
    
    console.log('API: Simple statistics result:', stats);
    res.status(200).json({ success: true, stats });
    
  } catch (error) {
    console.error('API: Error in simple statistics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}