require('dotenv').config();
const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
  // Passthrough Copy: Copy assets folder to output
  eleventyConfig.addPassthroughCopy("assets");
  
  // Watch CSS/JS files for changes during local development
  eleventyConfig.addWatchTarget("./assets/css/");
  eleventyConfig.addWatchTarget("./assets/js/");
  
  // --- MAP EMBED SHORTCODE WITH ENVIRONMENT VARIABLE ---
  eleventyConfig.addShortcode("mapEmbed", function(locationQuery) {
    if (!locationQuery) {
      return ''; // Don't output anything if no query is provided
    }
    
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.warn("Warning: GOOGLE_MAPS_API_KEY environment variable not set");
      return `<div class="map-embed-warning">Map embed unavailable - API key not configured</div>`;
    }
    
    const encodedQuery = encodeURIComponent(locationQuery);
    return `<div class="map-embed-wrapper">
      <iframe
        width="100%"
        height="350"
        style="border:0;"
        loading="lazy"
        allowfullscreen
        referrerpolicy="no-referrer-when-downgrade"
        src="https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedQuery}">
      </iframe>
    </div>`;
  });
  // --- END MAP EMBED SHORTCODE ---
  
  // Add a filter to format dates (e.g., May 1, 2025)
  eleventyConfig.addFilter("postDate", (dateObj) => {
    // Ensure input is a date object
    if (dateObj instanceof Date) {
       return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
    }
    
    // Try different parsing methods
    let dt;
    try {
      dt = DateTime.fromISO(dateObj);
      if (dt.isValid) return dt.toLocaleString(DateTime.DATE_MED);
      
      dt = DateTime.fromRFC2822(dateObj);
      if (dt.isValid) return dt.toLocaleString(DateTime.DATE_MED);
      
      dt = DateTime.fromSQL(dateObj);
      if (dt.isValid) return dt.toLocaleString(DateTime.DATE_MED);
    } catch (e) { /* Ignore parsing errors */ }
    
    return dateObj; // Return original if parsing fails
  });
  
  // Add a filter for Yen to Euro conversion
  eleventyConfig.addFilter("toEuro", (yenValue, rate) => {
    const numYen = Number(yenValue);
    // Get rate from metadata if possible, fallback to 169 (based on earlier user example)
    const effectiveRate = Number(rate) || eleventyConfig.globalData?.metadata?.yenToEuroRate || 169;
    
    if (isNaN(numYen)) {
      console.warn(`Invalid yen value: ${yenValue}`);
      return "N/A";
    }
    if (isNaN(effectiveRate) || effectiveRate === 0) {
      console.warn(`Invalid exchange rate: ${rate}`);
      return "N/A";
    }
    
    return `€${(numYen / effectiveRate).toFixed(2)}`;
  });
  
  // Get the current year for the footer
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
  
  // Collection for sorted days (reads 'day' field from front matter)
  eleventyConfig.addCollection("days", function(collectionApi) {
    return collectionApi.getFilteredByGlob("days/*.md").sort((a, b) => {
        let dayA = a.data.day;
        let dayB = b.data.day;
        dayA = (typeof dayA === 'number') ? dayA : Infinity;
        dayB = (typeof dayB === 'number') ? dayB : Infinity;
        return dayA - dayB; // Sort numerically
    });
  });
  
  // Set custom directories for input, output, includes, and data
  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["html", "md", "njk"]
  };
};
