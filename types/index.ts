// Export all types from crew.ts
export * from './crew';

// Event type - fallback for missing events data
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: string;
  website?: string;
  image?: string;
  latitude?: number;
  longitude?: number;
  category?: string;
  difficulty?: string;
  distance?: string;
  registrationUrl?: string;
  price?: string;
  maxParticipants?: number;
  tags?: string[];
}

// Route type - fallback for missing routes data
export interface Route {
  id: string;
  name: string;
  description: string;
  city: string;
  country: string;
  distance: string;
  difficulty: string;
  surface?: string;
  startPoint?: string;
  endPoint?: string;
  highlights?: string[];
  gpxFile?: string;
  image?: string;
  latitude?: number;
  longitude?: number;
  elevation?: string;
  estimatedTime?: string;
  tags?: string[];
  createdBy?: string;
}

// Keep only the types you're actually using
export interface SearchFilters {
  searchTerm?: string;
  membershipFilter?: string;
  runningTypeFilter?: string;
  continentFilter?: string;
  countryFilter?: string;
  cityFilter?: string;
  crewSizeFilter?: string;
  activeSchedulesFilter?: boolean;
}

export interface MapPin {
  id: number;
  lat: number;
  lng: number;
  title: string;
  city: string;
  country: string;
}

export interface LocationFilters {
  continent?: string;
  country?: string;
  city?: string;
}
