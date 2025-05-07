const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all day markdown files
const dayFiles = glob.sync('./days/day*.md');

dayFiles.forEach(filePath => {
  console.log(`Processing ${filePath}...`);
  
  // Read the file content
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Create backup
  fs.writeFileSync(`${filePath}.bak`, content, 'utf8');
  
  // Find all section headers (h3) like "Breakfast/Morning Coffee (Approx. 9:00 AM)"
  // This regex looks for lines that start with ### followed by text
  const sectionHeaderRegex = /^### (.*?)$/gm;
  
  // Keep track of replaced sections to avoid duplicates
  const replacedSections = new Set();
  
  // Replace each section header with a collapsible section
  content = content.replace(sectionHeaderRegex, (match, sectionTitle) => {
    // Skip if we've already processed this section (avoid duplicates)
    if (replacedSections.has(sectionTitle)) {
      return match;
    }
    
    replacedSections.add(sectionTitle);
    
    // Create the opening of the collapsible section
    return `<details class="section-details">
  <summary class="section-summary">${sectionTitle}</summary>
  <div class="section-content-wrapper">`;
  });
  
  // Now we need to close each section before the next one starts
  // First, find all the section starts
  const sectionStarts = [];
  let match;
  const detailsRegex = /<details class="section-details">/g;
  while ((match = detailsRegex.exec(content)) !== null) {
    sectionStarts.push(match.index);
  }
  
  // For each section start, find where to insert the closing tags
  let modifiedContent = content;
  let offset = 0;
  
  for (let i = 0; i < sectionStarts.length; i++) {
    const currentStart = sectionStarts[i] + offset;
    const nextStart = i < sectionStarts.length - 1 ? sectionStarts[i + 1] + offset : modifiedContent.length;
    
    // Insert closing tags before the next section or at the end of file
    const closingTags = "\n  </div>\n</details>\n";
    modifiedContent = modifiedContent.slice(0, nextStart) + closingTags + modifiedContent.slice(nextStart);
    
    // Update offset for inserted text
    offset += closingTags.length;
  }
  
  // Write the modified content back to the file
  fs.writeFileSync(filePath, modifiedContent, 'utf8');
  
  console.log(`Converted sections in ${filePath}`);
});

console.log('All files processed!');
