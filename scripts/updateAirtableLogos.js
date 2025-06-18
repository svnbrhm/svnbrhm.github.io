/**
 * Script to help update Airtable records to use local logo filenames
 * This script generates the mapping between crew names and their local logo files
 */

const fs = require('fs');
const path = require('path');

// Path to the logos directory
const logosDir = path.join(__dirname, '../public/images/crew/logos');

// Function to normalize crew name for filename matching
function normalizeCrewName(crewName) {
  return crewName
    .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special chars except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Function to get logo filename from crew name
function getLogoFilename(crewName) {
  const cleanName = normalizeCrewName(crewName);
  return `${cleanName}-Logo`;
}

// Read all logo files
function getAvailableLogos() {
  try {
    const files = fs.readdirSync(logosDir);
    return files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
    });
  } catch (error) {
    console.error('Error reading logos directory:', error);
    return [];
  }
}

// Generate mapping between crew names and logo files
function generateLogoMapping() {
  const availableLogos = getAvailableLogos();
  const mapping = {};
  
  console.log('Available logo files:');
  availableLogos.forEach(file => {
    console.log(`  - ${file}`);
    
    // Extract crew name from filename
    const nameWithoutExt = path.parse(file).name;
    const crewNamePart = nameWithoutExt.replace(/-Logo$/, '');
    
    // Convert back to readable crew name
    const readableCrewName = crewNamePart
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    mapping[readableCrewName] = file;
  });
  
  return mapping;
}

// Generate Airtable update instructions
function generateAirtableInstructions() {
  const mapping = generateLogoMapping();
  
  console.log('\n=== AIRTABLE UPDATE INSTRUCTIONS ===\n');
  console.log('For each crew in your Airtable, update the logo field as follows:\n');
  
  Object.entries(mapping).forEach(([crewName, filename]) => {
    const filenameOnly = path.parse(filename).name + path.parse(filename).ext;
    console.log(`Crew: "${crewName}"`);
    console.log(`  Logo filename: ${filenameOnly}`);
    console.log(`  Full path: /images/crew/logos/${filenameOnly}`);
    console.log('');
  });
  
  console.log('\n=== NEXT STEPS ===\n');
  console.log('1. In your Airtable base, add a new field called "LocalLogoFilename" (Single line text)');
  console.log('2. For each crew, enter the corresponding filename from the list above');
  console.log('3. Update your code to use this field instead of external URLs');
  console.log('4. Test the integration to ensure logos display correctly');
  
  return mapping;
}

// Main execution
if (require.main === module) {
  console.log('🔍 Scanning for crew logos...\n');
  const mapping = generateAirtableInstructions();
  
  // Save mapping to JSON file for reference
  const outputFile = path.join(__dirname, 'crew-logo-mapping.json');
  fs.writeFileSync(outputFile, JSON.stringify(mapping, null, 2));
  console.log(`\n📄 Logo mapping saved to: ${outputFile}`);
}

module.exports = {
  normalizeCrewName,
  getLogoFilename,
  getAvailableLogos,
  generateLogoMapping
};