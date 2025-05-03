const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
  // Passthrough Copy: Copy assets folder to output
  eleventyConfig.addPassthroughCopy("assets");

  // Watch CSS/JS files for changes during local development
  eleventyConfig.addWatchTarget("./assets/css/");
  eleventyConfig.addWatchTarget("./assets/js/");

  // Add a filter to format dates (e.g., May 1, 2025)
  eleventyConfig.addFilter("postDate", (dateObj) => {
    // Ensure input is a date object
    if (dateObj instanceof Date) {
       return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
    }
    // If it's already a string or other type, return it as is or handle appropriately
    // For example, try parsing it if needed, or return default text
     try {
        // Attempt to parse common date string formats if necessary
        const dt = DateTime.fromISO(dateObj) || DateTime.fromRFC2822(dateObj) || DateTime.fromSQL(dateObj);
        if (dt.isValid) {
             return dt.toLocaleString(DateTime.DATE_MED);
        }
     } catch (e) {
         // Ignore parsing errors, return original input or placeholder
     }
     return dateObj; // Return original input if not a Date object or unparseable
  });


  // Add a filter for Yen to Euro conversion
  eleventyConfig.addFilter("toEuro", (yenValue, rate) => {
    const numYen = Number(yenValue);
    const numRate = Number(rate);
    if (isNaN(numYen) || isNaN(numRate) || numRate === 0) {
      return ""; // Return empty if input is invalid number or rate is zero
    }
    const euroValue = numYen / numRate;
    // Format to 2 decimal places
    return `€${euroValue.toFixed(2)}`;
  });

  // Get the current year for the footer
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Collection for sorted days (reads 'day' field from front matter)
   eleventyConfig.addCollection("days", function(collectionApi) {
    return collectionApi.getFilteredByGlob("days/*.md").sort((a, b) => {
        let dayA = a.data.day;
        let dayB = b.data.day;
        // Handle cases where day might not be defined or not a number
        dayA = (typeof dayA === 'number') ? dayA : Infinity;
        dayB = (typeof dayB === 'number') ? dayB : Infinity;
        return dayA - dayB; // Sort numerically
    });
  });

  // Set custom directories for input, output, includes, and data
  return {
    dir: {
      input: ".",         // Root directory contains index.njk, days/ etc.
      includes: "_includes", // Relative to input directory
      data: "_data",       // Relative to input directory
      output: "_site"       // IMPORTANT: Output directory, GH Pages might need 'docs' or '/' depending on setup. Let's start with _site.
    },
    markdownTemplateEngine: "njk", // Use Nunjucks for Markdown files
    htmlTemplateEngine: "njk",     // Use Nunjucks for HTML files
    templateFormats: ["html", "md", "njk"] // Files Eleventy processes
  };
};
