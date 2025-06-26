/**
 * Optimized utility functions for crew image resolution.
 * Simplified approach that works reliably in both client and server environments.
 */

// Check if we're running on server side
const isServer = typeof window === 'undefined';

// Function to get default logo if crew logo doesn't exist
export function getDefaultCrewLogo(): string {
  return '/images/crew/logos/default-crew-logo.svg';
}

// Function to get default crew picture if crew picture doesn't exist
export function getDefaultCrewPicture(): string {
  return '/images/crew/photos/default-crew-picture.svg';
}

// Check if local image exists
function checkLocalImageExists(imagePath: string): boolean {
  console.log(`Checking if image exists: ${imagePath}`);
  
  // Server-side: use fs to check file existence
  if (typeof window === 'undefined') {
    try {
      // Use dynamic import for Node.js modules in a way that works with Next.js
      const Module = eval('module');
      const fs = Module.require('fs');
      const path = Module.require('path');
      
      const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
      const fullPath = path.join(process.cwd(), 'public', cleanPath);
      const exists = fs.existsSync(fullPath);
      console.log(`Server-side check for ${imagePath}: ${exists}`);
      return exists;
    } catch (error) {
      console.log(`Server-side file check failed: ${error}`);
      return false;
    }
  }
  
  // Client-side: return false for now, we'll implement async checking separately
  console.log(`Client-side check for ${imagePath}: returning false (will be handled by async check)`);
  return false;
}

// Base normalization function for common patterns
function normalizeCrewNameBase(crewName: string): string {
  return crewName
    // Handle specific patterns first
    .replace(/AM:PM\.RC/g, 'AM-PM-RC') // AM:PM.RC -> AM-PM-RC
    .replace(/FatBetty\.Run/g, 'Fat-Betty-Run') // FatBetty.Run -> Fat-Betty-Run
    .replace(/No Reason Co\./g, 'No-Reason-Co') // No Reason Co. -> No-Reason-Co
    .replace(/R\.I\.O\.T\./g, 'RIOT') // R.I.O.T. -> RIOT
    .replace(/Run3\+/g, 'Run3') // Run3+ -> Run3
    .replace(/T&C/g, 'TC') // T&C -> TC
    .replace(/M'Attraper/g, 'MAttraper') // M'Attraper -> MAttraper
    .replace(/24x7/g, '24x7') // Keep 24x7 as is
    .replace(/\./g, '') // Remove remaining dots
    .replace(/:/g, '') // Remove colons
    .replace(/\+/g, '') // Remove plus signs
    .replace(/'/g, '') // Remove apostrophes
    .trim();
}

// Normalize crew name for logos (& becomes 'and')
function normalizeCrewNameForLogo(crewName: string): string {
  let normalized = normalizeCrewNameBase(crewName)
    .replace(/&/g, 'and') // Replace & with 'and' for logos
    .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove other special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  
  console.log(`Normalized for logo "${crewName}" to "${normalized}"`);
  return normalized;
}

// Normalize crew name for photos (& becomes '-')
function normalizeCrewNameForPhoto(crewName: string): string {
  let normalized = normalizeCrewNameBase(crewName)
    .replace(/&/g, '-') // Replace & with '-' for photos
    .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove other special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  
  console.log(`Normalized for photo "${crewName}" to "${normalized}"`);
  return normalized;
}

// Legacy function for backward compatibility
function normalizeCrewName(crewName: string): string {
  return normalizeCrewNameForLogo(crewName);
}

// Additional normalization for lowercase matching
function normalizeLowercase(crewName: string): string {
  const normalized = normalizeCrewName(crewName).toLowerCase();
  return normalized;
}

// Get crew logo with local priority
export function getCrewLogoWithLocalPriority(crewName: string, airtableUrl?: string): string {
  if (!crewName) {
    return airtableUrl || getDefaultCrewLogo();
  }
  
  const titleCaseName = normalizeCrewNameForLogo(crewName);
  const lowerCaseName = normalizeCrewNameForLogo(crewName).toLowerCase();
  const possibleExtensions = ['.png', '.jpg', '.jpeg', '.svg'];
  const nameVariants = [titleCaseName, lowerCaseName];
  
  // Try exact match first with both name variants
  for (const name of nameVariants) {
    for (const ext of possibleExtensions) {
      const localPath = `/images/crew/logos/${name}${ext}`;
      if (checkLocalImageExists(localPath)) {
        return localPath;
      }
    }
  }
  
  // Try with "-Logo" suffix (common pattern in existing files)
  for (const name of nameVariants) {
    for (const ext of possibleExtensions) {
      const localPath = `/images/crew/logos/${name}-Logo${ext}`;
      if (checkLocalImageExists(localPath)) {
        return localPath;
      }
    }
  }
  
  // Fallback to Airtable URL or default
  return airtableUrl || getDefaultCrewLogo();
}

// Get crew photo with local priority
export function getCrewPhotoWithLocalPriority(crewName: string, airtableUrl?: string): string {
  if (!crewName) {
    return airtableUrl || getDefaultCrewPicture();
  }
  
  const titleCaseName = normalizeCrewNameForPhoto(crewName);
  const lowerCaseName = normalizeCrewNameForPhoto(crewName).toLowerCase();
  const possibleExtensions = ['.jpg', '.jpeg', '.png', '.svg'];
  const nameVariants = [titleCaseName, lowerCaseName];
  
  // Try exact match first with both name variants
  for (const name of nameVariants) {
    for (const ext of possibleExtensions) {
      const localPath = `/images/crew/photos/${name}${ext}`;
      if (checkLocalImageExists(localPath)) {
        return localPath;
      }
    }
  }
  
  // Try with "-Photo" suffix
  for (const name of nameVariants) {
    for (const ext of possibleExtensions) {
      const localPath = `/images/crew/photos/${name}-Photo${ext}`;
      if (checkLocalImageExists(localPath)) {
        return localPath;
      }
    }
  }
  
  // Fallback to Airtable URL or default
  return airtableUrl || getDefaultCrewPicture();
}

// Clear image cache (useful for development)
export function clearImageCache(): void {
  // Cache functionality removed for simplicity
  console.log('Image cache cleared');
}

// Get image with hybrid approach (local first, then Airtable)
export function getOptimizedCrewImage(crewName: string, type: 'logo' | 'photo', airtableUrl?: string): string {
  console.log(`getOptimizedCrewImage called with: crewName="${crewName}", type="${type}", airtableUrl="${airtableUrl}"`);
  
  if (type === 'logo') {
    const result = getCrewLogoWithLocalPriority(crewName, airtableUrl);
    console.log(`Logo result for "${crewName}": ${result}`);
    return result;
  } else {
    const result = getCrewPhotoWithLocalPriority(crewName, airtableUrl);
    console.log(`Photo result for "${crewName}": ${result}`);
    return result;
  }
}