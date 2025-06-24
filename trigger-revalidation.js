#!/usr/bin/env node

// Simple script to trigger revalidation of ISR pages
const https = require('https');
const http = require('http');

const REVALIDATION_SECRET = '43a1d86448f2d2c4eb77b72fc5a32b9329d97a53f444e71a35c6d71a3138a694';
const BASE_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

const triggerRevalidation = async (type = 'all') => {
  const data = JSON.stringify({
    secret: REVALIDATION_SECRET,
    type: type
  });

  const options = {
    hostname: BASE_URL.includes('localhost') ? 'localhost' : BASE_URL.replace('https://', '').replace('http://', ''),
    port: BASE_URL.includes('localhost') ? 3000 : (BASE_URL.includes('https') ? 443 : 80),
    path: '/api/revalidate',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  return new Promise((resolve, reject) => {
    const protocol = BASE_URL.includes('https') ? https : http;
    const req = protocol.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          console.log('Revalidation result:', result);
          resolve(result);
        } catch (error) {
          console.error('Failed to parse response:', responseData);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('Request error:', error);
      reject(error);
    });

    req.write(data);
    req.end();
  });
};

// Main execution
const main = async () => {
  try {
    console.log('Triggering revalidation for all pages...');
    console.log('Target URL:', BASE_URL);
    
    const result = await triggerRevalidation('all');
    
    if (result.revalidated) {
      console.log('✅ Successfully revalidated pages:', result.paths);
      console.log('📊 Data should now be up to date!');
    } else {
      console.log('❌ Revalidation failed:', result.message);
    }
  } catch (error) {
    console.error('❌ Error during revalidation:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Make sure the development server is running (npm run dev)');
    console.log('2. Check that the REVALIDATION_SECRET is correct in .env.local');
    console.log('3. Verify the API endpoint is accessible');
  }
};

if (require.main === module) {
  main();
}

module.exports = { triggerRevalidation };