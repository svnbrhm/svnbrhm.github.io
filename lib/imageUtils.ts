/**
 * Utility functions for providing default fallback images.
 * Most complex image resolution logic has been moved to airtableService.ts
 * to fetch image URLs directly from Airtable CrewMedia table.
 */

// Function to get default logo if crew logo doesn't exist
export function getDefaultCrewLogo(): string {
  return '/images/crew/logos/default-crew-logo.svg';
}

// Function to get default crew picture if crew picture doesn't exist
export function getDefaultCrewPicture(): string {
  return '/images/crew/photos/default-crew-picture.svg';
}

// --- REMOVED SECTIONS ---
// The following sections have been removed because the logic is now handled by
// fetching direct URLs from the Airtable's CrewMedia table via airtableService.ts:
// - availableLogoFiles, availablePhotoFiles
// - exactLogoMapping, abbreviationMapping
// - normalizeString, extractKeywords, calculateSimilarity, calculateKeywordSimilarity
// - findBestLogoMatch, findByAbbreviation
// - getLogoFilename, getCrewLogoPath, getCrewLogoWithFallback, getCrewPhotoPath, findBestPhotoMatch, hasCustomLogo
// ------------------------