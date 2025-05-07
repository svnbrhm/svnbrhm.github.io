#!/bin/bash

# Create a backup directory
echo "Creating backups directory..."
mkdir -p ./days/backups
cp ./days/day*.md ./days/backups/

# Process each day file
for file in ./days/day*.md; do
  echo "Processing $file..."
  
  # Create a temporary file for processing
  temp_file="${file}.temp"
  
  # Initialize the new content
  > "$temp_file"
  
  # Process the file line by line
  section_open=false
  while IFS= read -r line || [[ -n "$line" ]]; do
    # Check if this is a section header (starts with ###)
    if [[ "$line" =~ ^###[[:space:]]+(.*) ]]; then
      # If we already have an open section, close it
      if [ "$section_open" = true ]; then
        echo "  </div>" >> "$temp_file"
        echo "</details>" >> "$temp_file"
        echo "" >> "$temp_file"
      fi
      
      # Extract the section title
      section_title="${BASH_REMATCH[1]}"
      
      # Open a new section
      echo "<details class=\"section-details\">" >> "$temp_file"
      echo "  <summary class=\"section-summary\">$section_title</summary>" >> "$temp_file"
      echo "  <div class=\"section-content-wrapper\">" >> "$temp_file"
      
      section_open=true
    else
      # Just copy the line as is
      echo "$line" >> "$temp_file"
    fi
  done < "$file"
  
  # Close the last section if open
  if [ "$section_open" = true ]; then
    echo "  </div>" >> "$temp_file"
    echo "</details>" >> "$temp_file"
  fi
  
  # Replace the original file with the processed one
  mv "$temp_file" "$file"
  
  echo "Completed processing $file"
done

echo "All files processed! Backups are in ./days/backups/"
