/**
 * Optimized utility functions for crew image resolution.
 * Prioritizes local images over Airtable API calls for better performance.
 */

// Cache for local image availability to avoid repeated file system checks
const localImageCache = new Map<string, boolean>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const cacheTimestamps = new Map<string, number>();

// Check if we're running on server side
const isServer = typeof window === 'undefined';

// Dynamic imports for server-side only
let fs: any = null;
let path: any = null;

if (isServer) {
  try {
    // Use dynamic require to prevent webpack from bundling these modules
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    fs = require('fs');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    path = require('path');
  } catch (error) {
    console.warn('Failed to load Node.js modules:', error);
  }
}

// Function to get default logo if crew logo doesn't exist
export function getDefaultCrewLogo(): string {
  return '/images/crew/logos/default-crew-logo.svg';
}

// Function to get default crew picture if crew picture doesn't exist
export function getDefaultCrewPicture(): string {
  return '/images/crew/photos/default-crew-picture.svg';
}

// Check if local image exists with caching (server-side only)
function checkLocalImageExists(imagePath: string): boolean {
  // On client side, assume images exist (they'll be checked by browser)
  if (!isServer || !fs || !path) {
    return true; // Optimistically assume image exists on client side
  }
  
  const now = Date.now();
  const cacheKey = imagePath;
  
  // Check cache first
  if (localImageCache.has(cacheKey)) {
    const timestamp = cacheTimestamps.get(cacheKey) || 0;
    if (now - timestamp < CACHE_TTL) {
      return localImageCache.get(cacheKey) || false;
    }
  }
  
  // Check file system (server-side only)
  try {
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    const exists = fs.existsSync(fullPath);
    
    // Update cache
    localImageCache.set(cacheKey, exists);
    cacheTimestamps.set(cacheKey, now);
    
    return exists;
  } catch (error) {
    console.warn(`Error checking local image ${imagePath}:`, error);
    return false;
  }
}

// Normalize crew name for file matching
function normalizeCrewName(crewName: string): string {
  return crewName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

// Get crew logo with local priority
export function getCrewLogoWithLocalPriority(crewName: string, airtableUrl?: string): string {
  if (!crewName) {
    return airtableUrl || getDefaultCrewLogo();
  }
  
  // Try exact match first
  const normalizedName = normalizeCrewName(crewName);
  const possibleExtensions = ['.png', '.jpg', '.jpeg', '.svg'];
  
  for (const ext of possibleExtensions) {
    const localPath = `/images/crew/logos/${normalizedName}${ext}`;
    if (checkLocalImageExists(localPath)) {
      return localPath;
    }
  }
  
  // Try with "-Logo" suffix (common pattern in existing files)
  for (const ext of possibleExtensions) {
    const localPath = `/images/crew/logos/${normalizedName}-Logo${ext}`;
    if (checkLocalImageExists(localPath)) {
      return localPath;
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
  
  const normalizedName = normalizeCrewName(crewName);
  const possibleExtensions = ['.jpg', '.jpeg', '.png', '.svg'];
  
  for (const ext of possibleExtensions) {
    const localPath = `/images/crew/photos/${normalizedName}${ext}`;
    if (checkLocalImageExists(localPath)) {
      return localPath;
    }
  }
  
  // Try with "-Photo" suffix
  for (const ext of possibleExtensions) {
    const localPath = `/images/crew/photos/${normalizedName}-Photo${ext}`;
    if (checkLocalImageExists(localPath)) {
      return localPath;
    }
  }
  
  // Fallback to Airtable URL or default
  return airtableUrl || getDefaultCrewPicture();
}

// Clear image cache (useful for development)
export function clearImageCache(): void {
  localImageCache.clear();
  cacheTimestamps.clear();
}

// Get image with hybrid approach (local first, then Airtable)
export function getOptimizedCrewImage(crewName: string, type: 'logo' | 'photo', airtableUrl?: string): string {
  if (type === 'logo') {
    return getCrewLogoWithLocalPriority(crewName, airtableUrl);
  } else {
    return getCrewPhotoWithLocalPriority(crewName, airtableUrl);
  }
}