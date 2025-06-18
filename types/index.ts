// Export all types from crew.ts
export * from './crew';

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
