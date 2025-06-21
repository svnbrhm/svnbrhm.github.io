import { getDefaultCrewPicture } from './imageUtils';

/**
 * Get a random crew hero image from all available crews
 * Falls back to sync random images if Airtable is not configured
 */
export async function getRandomCrewHeroImage(): Promise<string> {
  try {
    // Check if Airtable is configured
    if (!process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN || !process.env.AIRTABLE_BASE_ID) {
      console.warn('Airtable not configured, using sync random images');
      return getRandomCrewHeroImageSync();
    }

    // Dynamically import airtable service to avoid initialization errors
    const { airtableService } = await import('./airtable');
    
    // Fetch all crews to get their hero images
    const crews = await airtableService.getAllCrews();
    
    // Filter crews that have custom hero images (not default)
    const crewsWithHeroImages = crews.filter(crew => 
      crew.heroImageUrl && 
      crew.heroImageUrl !== getDefaultCrewPicture() &&
      crew.heroImageUrl.startsWith('http') // Ensure it's a valid URL
    );
    
    // If we have crews with hero images, pick one randomly
    if (crewsWithHeroImages.length > 0) {
      const randomIndex = Math.floor(Math.random() * crewsWithHeroImages.length);
      return crewsWithHeroImages[randomIndex].heroImageUrl!;
    }
    
    // Fallback to sync random images if no custom images available
    return getRandomCrewHeroImageSync();
  } catch (error) {
    console.warn('Failed to fetch random crew hero image:', error);
    // Fallback to sync random images on error
    return getRandomCrewHeroImageSync();
  }
}

/**
 * Get a random crew hero image synchronously using a predefined list
 * This is useful for immediate rendering without async calls
 */
export function getRandomCrewHeroImageSync(): string {
  // Predefined list of actual crew hero images as fallback
  const fallbackHeroImages = [
    '/images/crew/photos/023RunClub-Photo.jpg',
    '/images/crew/photos/Amsterdam-Running-Club-Photo.jpeg',
    '/images/crew/photos/Berlin-Track-Club-Photo.jpg',
    '/images/crew/photos/Brooklyn-Track-Club-Photo.jpg',
    '/images/crew/photos/Golden-Gate-Running-Club-Photo.jpg',
    '/images/crew/photos/Harlem-Run-Photo.jpg',
    '/images/crew/photos/Paris-Running-Club-Photo.jpg',
    '/images/crew/photos/Tokyo-Night-Run-Club-Photo.jpg',
    '/images/crew/photos/Run-Dem-Crew-Photo.jpg',
    '/images/crew/photos/Munich-Running-Society-Photo.jpg'
  ];
  
  const randomIndex = Math.floor(Math.random() * fallbackHeroImages.length);
  return fallbackHeroImages[randomIndex];
}