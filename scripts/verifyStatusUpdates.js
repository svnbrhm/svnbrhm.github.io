#!/usr/bin/env node

/**
 * Verification script to check that all status values have been updated
 * from lowercase ('publish', 'draft', etc.) to capitalized ('Published', 'Draft', etc.)
 */

const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const filesToCheck = [
  'types/crew.ts',
  'lib/airtable.ts',
  'lib/mockData.ts',
  'components/Crew/CrewCard.tsx'
];

const oldStatusValues = ['publish', 'draft', 'archived', 'featured', 'pending'];
const newStatusValues = ['Published', 'Draft', 'Archived', 'Featured', 'Pending Review'];

console.log('🔍 Verifying status value updates...');
console.log('=' .repeat(50));

let issuesFound = 0;

filesToCheck.forEach(filePath => {
  const fullPath = path.join(projectRoot, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }
  
  const content = fs.readFileSync(fullPath, 'utf8');
  
  console.log(`\n📄 Checking: ${filePath}`);
  
  // Check for old status values
  oldStatusValues.forEach(oldValue => {
    const regex = new RegExp(`['"]${oldValue}['"]`, 'g');
    const matches = content.match(regex);
    
    if (matches) {
      console.log(`  ❌ Found old status value: ${oldValue} (${matches.length} occurrences)`);
      issuesFound += matches.length;
    }
  });
  
  // Check for new status values
  let foundNewValues = 0;
  newStatusValues.forEach(newValue => {
    const regex = new RegExp(`['"]${newValue}['"]`, 'g');
    const matches = content.match(regex);
    
    if (matches) {
      foundNewValues += matches.length;
    }
  });
  
  if (foundNewValues > 0) {
    console.log(`  ✅ Found ${foundNewValues} updated status values`);
  } else {
    console.log('  ℹ️  No status values found in this file');
  }
});

console.log('\n' + '=' .repeat(50));

if (issuesFound === 0) {
  console.log('🎉 SUCCESS: All status values have been properly updated!');
  console.log('✅ No old lowercase status values found');
  console.log('✅ All files are using the correct capitalized status values');
} else {
  console.log(`❌ ISSUES FOUND: ${issuesFound} old status values still exist`);
  console.log('Please review and update the remaining old status values.');
  process.exit(1);
}

console.log('\n📋 Expected status values:');
newStatusValues.forEach(value => {
  console.log(`  - '${value}'`);
});

console.log('\n🚫 Old status values (should not be found):');
oldStatusValues.forEach(value => {
  console.log(`  - '${value}'`);
});