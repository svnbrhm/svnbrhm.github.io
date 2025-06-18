// Enhanced Crew Types based on Airtable schemas
export interface Crew {
  // Basic Info
  id: string;
  CrewName: string;
  FoundingDate?: string;
  CrewStory?: string;
  CrewStoryLongFinal?: string;
  CrewStoryExcerpt?: string;
  
  // Location
  City: string;
  Country: string;
  Continent?: string;
  HeadquarterName?: string;
  HeadquarterAddress?: string;
  HeadquarterLatitude?: number;
  HeadquarterLongitude?: number;
  HeadquarterGoogleMapsLink?: string;
  
  // Contact & Social
  ContactEmailCrew?: string;
  FacebookFanpageURL?: string;
  FacebookGroupURL?: string;
  InstagramURL?: string;
  XURL?: string;
  StravaClubURL?: string;
  HomepageURL?: string;
  OtherSocialMediaURLs?: string;
  
  // Membership
  ApproxMemberCount?: number;
  MembershipType?: string;
  MembershipFeeInfo?: string;
  
  // Running Info
  LocalEventsText?: string;
  OwnEventText?: string;
  BrandSupportInfo?: string;
  
  // SEO & Status
  Featured: boolean;
  SEODescription?: string;
  SEOKeywords?: string;
  SEO_FocusKeyPhrase?: string;
  SEO_Slug?: string;
  SEO_MetaDescription?: string;
  ShortURL?: string;
  PrimaryImageUrl?: string;
  
  // Image URLs from Airtable Media
  logoUrl?: string;
  heroImageUrl?: string;
  
  // Linked Data
  teamMembers?: TeamMember[];
  media?: CrewMedia[];
  schedules?: RunSchedule[];
  events?: RunningEvent[];
  routes?: RunningRoute[];
}

export interface TeamMember {
  MemberName: string;
  Role: ('Founder' | 'Captain' | 'Coach' | 'Teamlead')[];
  InstagramURL?: string;
  StravaURL?: string;
  CrewMemberEmail?: string;
  ProfileImage?: string[];
  Bio?: string;
  MemberStatus: 'Active' | 'Inactive' | 'Former';
  Status: 'Draft' | 'Published' | 'Archived' | 'Featured' | 'Pending Review';
}

// Airtable attachment object interface (for type consistency)
interface AirtableAttachment {
  id: string;
  url: string;
  filename: string;
  size: number;
  type: string;
  thumbnails?: {
    small?: { url: string; width: number; height: number; };
    large?: { url: string; width: number; height: number; };
    full?: { url: string; width: number; height: number; };
  };
}

export interface CrewMedia {
  MediaTitle: string;
  MediaType: 'Logo' | 'Running Picture' | 'Crew Picture' | 'Event Picture' | 'Video' | 'Other' | 'Route Picture';
  MediaFile?: AirtableAttachment[];
  FileURL: string;
  Description?: string;
  IsFeatured: boolean;
  AltText?: string;
  Caption?: string;
  Tags?: string[];
  Featured: boolean;
  UploadDate?: string;
  LastUpdated?: string;
  Status: 'Draft' | 'Published' | 'Archived' | 'Featured' | 'Pending Review';
}

export interface RunSchedule {
  RunName?: string;
  DayOfWeek?: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  Time?: string;
  MeetingPointAddress?: string;
  MeetingPointLatitude?: number;
  MeetingPointLongitude?: number;
  DistanceDescription?: string;
  PaceDescription?: string;
  AdditionalInfo?: string;
  RunningType?: 'Parkrun' | 'Trailrun' | 'Race Track' | 'Street Run' | 'Workout' | 'Yoga';
  RunSchedulesStatus?: 'Active' | 'Seasonal' | 'Paused' | 'Cancelled';
  SeasonalPeriod?: string;
  LastUpdated?: string;
  MeetingPointGoogleMapsLink?: string;
  Status: 'Draft' | 'Published' | 'Archived' | 'Featured' | 'Pending Review';
}

export interface RunningEvent {
  EventID: number;
  EventName: string;
  City: string;
  Country: string;
  EventStartDate?: string;
  EventEndDate?: string;
  Location?: string;
  Latitude?: number;
  Longitude?: number;
  EventType?: ('Marathon' | 'Halfmarathon' | '10k' | '5k' | 'Trail' | 'Ultra' | 'Relay')[];
  BriefDescription?: string;
  EventURL?: string;
  RegistrationURL?: string;
  EventImage?: string[];
  Status: 'Draft' | 'Published' | 'Archived' | 'Featured' | 'Pending Review';
}

export interface RunningRoute {
  RouteID: number;
  RouteName: string;
  City: string;
  Country: string;
  ApproximateDistance?: number;
  DistanceUnit?: string;
  BriefDescription?: string;
  KeyLandmarks?: string;
  StartPoint?: string;
  EndPoint?: string;
  StartLatitude?: number;
  StartLongitude?: number;
  EndLatitude?: number;
  EndLongitude?: number;
  Featured: boolean;
  Status: 'Draft' | 'Published' | 'Archived' | 'Featured' | 'Pending Review';
}

export interface CrewFilters {
  searchText: string;
  continent: string[];
  country: string[];
  membershipType: string[];
  runningTypes: string[];
  memberCountRange: [number, number];
  hasActiveSchedules: boolean;
  featured: boolean;
  sortBy: 'newest' | 'oldest' | 'memberCount' | 'alphabetical';
}