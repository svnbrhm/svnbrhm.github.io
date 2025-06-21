import { Crew, TeamMember, CrewMedia, RunSchedule, RunningRoute } from '../types/crew';
import { getDefaultCrewLogo, getDefaultCrewPicture } from './imageUtils';

// Airtable Personal Access Token (replaces deprecated API keys as of Feb 1, 2024)
// SECURITY FIX: Removed NEXT_PUBLIC_ prefix to keep tokens server-side only
const AIRTABLE_PERSONAL_ACCESS_TOKEN = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;

// Airtable Table IDs - verified against actual base structure
const TABLE_IDS = {
  CREWS: 'tbl76VCXwPoucGZxf',
  TEAM_MEMBERS: 'tbl3bxAbqpwiY3PQm',
  RUN_SCHEDULES: 'tblWVRZImWj8Wx5L1',
  CREW_MEDIA: 'tblZsfIBlCssAzwyZ',
  RUNNING_EVENTS: 'tblGpZHOcRt6RFfUK',
  RUNNING_ROUTES: 'tbl605OnaGj8t0gCd',
  BLOG: 'tblCjQYcLlC3cNB1E'
} as const;

if (!AIRTABLE_PERSONAL_ACCESS_TOKEN || !AIRTABLE_BASE_ID) {
  throw new Error('Missing Airtable configuration. Please set AIRTABLE_PERSONAL_ACCESS_TOKEN and AIRTABLE_BASE_ID environment variables.');
}

const headers = {
  'Authorization': `Bearer ${AIRTABLE_PERSONAL_ACCESS_TOKEN}`,
  'Content-Type': 'application/json',
};

// Airtable response interfaces
interface AirtableRecord<T = any> {
  id: string;
  fields: T;
  createdTime: string;
}

interface AirtableResponse<T = any> {
  records: AirtableRecord<T>[];
  offset?: string;
}

// Airtable field mappings for Crews table
interface AirtableCrewFields {
  CrewName: string;
  FoundingDate?: string;
  CrewStoryLongFinal?: string;
  CrewStoryExcerpt?: string;
  City: string;
  Country: string;
  Continent?: string;
  ContactEmailCrew?: string;
  FacebookFanpageURL?: string;
  FacebookGroupURL?: string;
  InstagramURL?: string;
  XURL?: string;
  StravaClubURL?: string;
  HomepageURL?: string;
  HeadquarterName?: string;
  HeadquarterAddress?: string;
  HeadquarterGoogleMapsLink?: string;
  HeadquarterLatitude?: number;
  HeadquarterLongitude?: number;
  ApproxMemberCount?: number;
  MembershipType?: string;
  MembershipFeeInfo?: string;
  LocalEventsText?: string;
  OwnEventText?: string;
  SEODescription?: string;
  SEO_Slug?: string;
  LocalLogoFilename?: string;
}

// Airtable field mappings for TeamMembers table
interface AirtableTeamMemberFields {
  MemberName: string;
  Role?: string[];
  InstagramURL?: string;
  StravaURL?: string;
  CrewMemberEmail?: string;
  ProfileImage?: string[];
  Bio?: string;
  MemberStatus?: 'Active' | 'Inactive' | 'Former';
  LastUpdated?: string;
  AdminNotes?: string;
  LinkToCrew?: string[];
  Status?: 'Draft' | 'Published' | 'Archived' | 'Featured' | 'Pending Review';
}

// Airtable field mappings for RunSchedules table
interface AirtableRunScheduleFields {
  RunName?: string;
  DayOfWeek?: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  Time_backup?: string;
  MeetingPointName?: string;
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
  LinkToCrew?: string[];
  Status?: 'Draft' | 'Published' | 'Archived' | 'Featured' | 'Pending Review';
}

// Airtable attachment object interface
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

// Airtable field mappings for CrewMedia table
interface AirtableCrewMediaFields {
  MediaTitle?: string;
  MediaType?: 'Logo' | 'Running Picture' | 'Crew Picture' | 'Event Picture' | 'Video' | 'Other' | 'Route Picture';
  MediaFile?: AirtableAttachment[];
  FileURL?: string;
  Description?: string;
  IsFeatured?: boolean;
  AltText?: string;
  Caption?: string;
  Tags?: string[];
  Featured?: boolean;
  UploadDate?: string;
  LastUpdated?: string;
  LinkToCrew?: string[];
  Status?: 'Draft' | 'Published' | 'Archived' | 'Featured' | 'Pending Review';
}

// Airtable field mappings for Routes table
interface AirtableRouteFields {
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

// Helper function to make API requests with pagination support
async function makeAirtableRequest<T>(endpoint: string, options?: { maxRecords?: number; offset?: string }): Promise<AirtableResponse<T>> {
  try {
    // Build URL with query parameters
    const url = new URL(`${AIRTABLE_API_URL}${endpoint}`);
    
    if (options?.maxRecords) {
      url.searchParams.append('maxRecords', options.maxRecords.toString());
    }
    
    if (options?.offset) {
      url.searchParams.append('offset', options.offset);
    }

    const response = await fetch(url.toString(), {
      headers,
    });

    if (!response.ok) {
      // Include the status code in the error message for easier detection in catch blocks
      throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    // Only log non-422 errors as errors, since 422 errors are expected for missing tables
    if (error instanceof Error && error.message.includes('422')) {
      console.warn('Airtable table not found (422):', error.message);
    } else {
      console.error('Airtable request failed:', error);
    }
    throw error;
  }
}

// Helper function to fetch all records with pagination
async function makeAirtableRequestWithPagination<T>(endpoint: string): Promise<AirtableRecord<T>[]> {
  const allRecords: AirtableRecord<T>[] = [];
  let offset: string | undefined;
  
  do {
    try {
      const response = await makeAirtableRequest<T>(endpoint, { offset });
      
      if (response.records) {
        allRecords.push(...response.records);
        console.log(`Fetched ${response.records.length} records, total so far: ${allRecords.length}`);
      }
      
      // Update offset for next iteration
      offset = response.offset;
      
    } catch (error) {
      console.error('Error during paginated request:', error);
      throw error;
    }
  } while (offset); // Continue while there's an offset (more pages)
  
  console.log(`Pagination complete. Total records fetched: ${allRecords.length}`);
  return allRecords;
}

// Transform Airtable crew record to our Crew type
function transformCrewRecord(record: AirtableRecord<AirtableCrewFields>): Crew {
  try {
    if (!record || !record.fields) {
      throw new Error('Invalid record structure');
    }
    
    const fields = record.fields;
    
    // Log the record structure for debugging
    console.log('Transforming crew record:', {
      id: record.id,
      fieldsKeys: Object.keys(fields),
      crewName: fields.CrewName
    });
    
    // Validate required fields
    if (!fields.CrewName) {
      console.warn('CrewName is missing for record:', record.id);
    }
    
    const crewName = fields.CrewName || 'Unknown Crew';
    
    // Initialize image URLs with defaults - will be populated from Airtable media (NEW IMAGE HANDLING)
    let primaryImageUrl = getDefaultCrewLogo();
    let logoUrl = getDefaultCrewLogo();
    let heroImageUrl = getDefaultCrewPicture();
    
    return {
      id: record.id,
      CrewName: crewName,
      City: fields.City || '',
      Country: fields.Country || '',
      Continent: fields.Continent || '',
      FoundingDate: fields.FoundingDate || '',
      CrewStoryLongFinal: fields.CrewStoryLongFinal || '',
      CrewStoryExcerpt: fields.CrewStoryExcerpt || '',
      ContactEmailCrew: fields.ContactEmailCrew || '',
      FacebookFanpageURL: fields.FacebookFanpageURL || '',
      FacebookGroupURL: fields.FacebookGroupURL || '',
      InstagramURL: fields.InstagramURL || '',
      XURL: fields.XURL || '',
      StravaClubURL: fields.StravaClubURL || '',
      HomepageURL: fields.HomepageURL || '',
      HeadquarterName: fields.HeadquarterName || '',
      HeadquarterAddress: fields.HeadquarterAddress || '',
      HeadquarterGoogleMapsLink: fields.HeadquarterGoogleMapsLink || '',
      HeadquarterLatitude: fields.HeadquarterLatitude || 0,
      HeadquarterLongitude: fields.HeadquarterLongitude || 0,
      ApproxMemberCount: fields.ApproxMemberCount || 0,
      MembershipType: fields.MembershipType || '',
      MembershipFeeInfo: fields.MembershipFeeInfo || '',
      LocalEventsText: fields.LocalEventsText || '',
      OwnEventText: fields.OwnEventText || '',
      SEODescription: fields.SEODescription || '',
      SEO_Slug: fields.SEO_Slug || '',
      Featured: false, // Default featured status
      PrimaryImageUrl: primaryImageUrl,
      // Image URLs from Airtable Media (will be populated when media is fetched)
      logoUrl: logoUrl,
      heroImageUrl: heroImageUrl,
      // These will be populated by separate API calls
      teamMembers: [],
      media: [],
      schedules: [],
    };
  } catch (error) {
    console.error('Error transforming crew record:', error, 'Record:', record);
    throw new Error(`Failed to transform crew record: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Transform Airtable team member record to our TeamMember type
function transformTeamMemberRecord(record: AirtableRecord<AirtableTeamMemberFields>): TeamMember {
  try {
    if (!record || !record.fields) {
      throw new Error('Invalid team member record structure');
    }
    
    const fields = record.fields;
    
    // Log the record structure for debugging
    console.log('Transforming team member record:', {
      id: record.id,
      fieldsKeys: Object.keys(fields),
      memberName: fields.MemberName
    });
    
    return {
      MemberName: fields.MemberName || 'Unknown Member',
      Role: (fields.Role || []) as ('Founder' | 'Captain' | 'Coach' | 'Teamlead')[],
      InstagramURL: fields.InstagramURL || '',
      StravaURL: fields.StravaURL || '',
      CrewMemberEmail: fields.CrewMemberEmail || '',
      Bio: fields.Bio || '',
      MemberStatus: fields.MemberStatus || 'Active',
      Status: fields.Status || 'Published',
    };
  } catch (error) {
    console.error('Error transforming team member record:', error, 'Record:', record);
    throw new Error(`Failed to transform team member record: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Transform Airtable run schedule record to our RunSchedule type
function transformRunScheduleRecord(record: AirtableRecord<AirtableRunScheduleFields>): RunSchedule {
  try {
    if (!record || !record.fields) {
      throw new Error('Invalid run schedule record structure');
    }
    
    const fields = record.fields;
    
    // Log the record structure for debugging
    console.log('Transforming run schedule record:', {
      id: record.id,
      fieldsKeys: Object.keys(fields),
      runName: fields.RunName
    });
    
    return {
      RunName: fields.RunName || `${fields.DayOfWeek} ${fields.RunningType}`,
      DayOfWeek: fields.DayOfWeek,
      Time: fields.Time_backup,
      RunningType: fields.RunningType,
      MeetingPointAddress: fields.MeetingPointName,
      MeetingPointLatitude: fields.MeetingPointLatitude,
      MeetingPointLongitude: fields.MeetingPointLongitude,
      MeetingPointGoogleMapsLink: fields.MeetingPointGoogleMapsLink,
      DistanceDescription: fields.DistanceDescription,
      PaceDescription: fields.PaceDescription,
      AdditionalInfo: fields.AdditionalInfo,
      RunSchedulesStatus: fields.RunSchedulesStatus,
      SeasonalPeriod: fields.SeasonalPeriod,
      Status: fields.Status || 'Published',
    };
  } catch (error) {
    console.error('Error transforming run schedule record:', error, 'Record:', record);
    throw new Error(`Failed to transform run schedule record: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Transform Airtable crew media record to our CrewMedia type
function transformCrewMediaRecord(record: AirtableRecord<AirtableCrewMediaFields>): CrewMedia {
  try {
    if (!record || !record.fields) {
      throw new Error('Invalid crew media record structure');
    }
    
    const fields = record.fields;
    
    // Log the record structure for debugging
    console.log('Transforming crew media record:', {
      id: record.id,
      fieldsKeys: Object.keys(fields),
      mediaTitle: fields.MediaTitle,
      mediaType: fields.MediaType
    });
    
    // Extract FileURL from MediaFile attachments if available
    let fileURL = fields.FileURL || '';
    if (!fileURL && fields.MediaFile && fields.MediaFile.length > 0) {
      // Get the URL from the first attachment
      fileURL = fields.MediaFile[0].url;
    }

    return {
      MediaTitle: fields.MediaTitle || '',
      MediaType: fields.MediaType || 'Other',
      MediaFile: fields.MediaFile,
      FileURL: fileURL,
      Description: fields.Description,
      IsFeatured: fields.IsFeatured || false,
      AltText: fields.AltText,
      Caption: fields.Caption,
      Tags: fields.Tags,
      Featured: fields.Featured || false,
      Status: fields.Status || 'Published',
    };
  } catch (error) {
    console.error('Error transforming crew media record:', error, 'Record:', record);
    throw new Error(`Failed to transform crew media record: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Transform Airtable route record to our RunningRoute type
function transformRouteRecord(record: AirtableRecord<AirtableRouteFields>): RunningRoute {
  try {
    if (!record || !record.fields) {
      throw new Error('Invalid route record structure');
    }
    
    const fields = record.fields;
    
    return {
      RouteID: parseInt(record.id.replace('rec', ''), 36), // Convert Airtable ID to number
      RouteName: fields.RouteName || 'Unnamed Route',
      City: fields.City || '',
      Country: fields.Country || '',
      ApproximateDistance: fields.ApproximateDistance,
      DistanceUnit: fields.DistanceUnit || 'km',
      BriefDescription: fields.BriefDescription,
      KeyLandmarks: fields.KeyLandmarks,
      StartPoint: fields.StartPoint,
      EndPoint: fields.EndPoint,
      StartLatitude: fields.StartLatitude,
      StartLongitude: fields.StartLongitude,
      EndLatitude: fields.EndLatitude,
      EndLongitude: fields.EndLongitude,
      Featured: fields.Featured || false,
      Status: fields.Status || 'Published',
    };
  } catch (error) {
    console.error('Error transforming route record:', error, 'Record:', record);
    throw new Error(`Failed to transform route record: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// API functions
export const airtableService = {
  // Get team members for a crew
  async getTeamMembers(crewName: string): Promise<TeamMember[]> {
    try {
      // First get the crew record to find its ID


      const crewResponse = await makeAirtableRequest<AirtableCrewFields>(
        `/${TABLE_IDS.CREWS}?filterByFormula={CrewName}='${crewName}'`
      );
      
      if (crewResponse.records.length === 0) {
        console.warn(`[getTeamMembers] Crew '${crewName}' not found`);
        return [];
      }
      
      const crewId = crewResponse.records[0].id;
      
      // Now get team members linked to this crew
      const response = await makeAirtableRequest<AirtableTeamMemberFields>(
        `/${TABLE_IDS.TEAM_MEMBERS}?filterByFormula=FIND('${crewId}',ARRAYJOIN({LinkToCrew}))`
      );
      console.log(`[getTeamMembers] Found ${response.records.length} team members for crew '${crewName}'`);
      return response.records.map(transformTeamMemberRecord);
    } catch (error) {
      // Handle case where TeamMembers table doesn't exist (422 error)
      if (error instanceof Error && error.message.includes('422')) {
        console.warn(`[getTeamMembers] TeamMembers table not found in Airtable base - this is expected if no team member data is available. Returning empty array for crew '${crewName}'`);
        return [];
      }
      console.error(`[getTeamMembers] Failed to fetch team members for ${crewName}:`, error);
      return [];
    }
  },

  // Get run schedules for a crew
  async getRunSchedules(crewName: string): Promise<RunSchedule[]> {
    try {
      // First get the crew record to find its ID
      const crewResponse = await makeAirtableRequest<AirtableCrewFields>(
        `/${TABLE_IDS.CREWS}?filterByFormula={CrewName}='${crewName}'`
      );
      
      if (crewResponse.records.length === 0) {
        console.warn(`[getRunSchedules] Crew '${crewName}' not found`);
        return [];
      }
      
      const crewId = crewResponse.records[0].id;
      
      // Now get run schedules linked to this crew
      const response = await makeAirtableRequest<AirtableRunScheduleFields>(
        `/${TABLE_IDS.RUN_SCHEDULES}?filterByFormula=FIND('${crewId}',ARRAYJOIN({LinkToCrew}))`
      );
      console.log(`[getRunSchedules] Found ${response.records.length} schedules for crew '${crewName}'`);
      return response.records.map(transformRunScheduleRecord);
    } catch (error) {
      // Handle case where RunSchedules table doesn't exist (422 error)
      if (error instanceof Error && error.message.includes('422')) {
        console.warn(`[getRunSchedules] RunSchedules table not found in Airtable base - this is expected if no schedule data is available. Returning empty array for crew '${crewName}'`);
        return [];
      }
      console.error(`[getRunSchedules] Failed to fetch run schedules for ${crewName}:`, error);
      return [];
    }
  },

  // Get crew media for a crew
  async getCrewMedia(crewName: string): Promise<CrewMedia[]> {
    try {
      // First get the crew record to find its ID
      // CONSISTENCY FIX: Use table ID instead of table name for reliability
      const crewResponse = await makeAirtableRequest<AirtableCrewFields>(
        `/${TABLE_IDS.CREWS}?filterByFormula={CrewName}='${crewName}'`
      );
      
      if (crewResponse.records.length === 0) {
        console.warn(`[getCrewMedia] Crew '${crewName}' not found in Crews table`);
        return [];
      }
      
      const crewId = crewResponse.records[0].id;
      
      // Now get crew media linked to this crew
      const response = await makeAirtableRequest<AirtableCrewMediaFields>(
        `/${TABLE_IDS.CREW_MEDIA}?filterByFormula=FIND('${crewId}',ARRAYJOIN({LinkToCrew}))`
      );
      
      // Only log when media entries are found (success case)
      if (response.records.length > 0) {
        console.log(`[getCrewMedia] Found ${response.records.length} media entries for crew '${crewName}'`);
      }
      
      return response.records.map(transformCrewMediaRecord);
    } catch (error) {
      // Handle case where CrewMedia table doesn't exist (422 error)
      if (error instanceof Error && error.message.includes('422')) {
        console.warn(`[getCrewMedia] CrewMedia table not found in Airtable base - this is expected if no media data is available. Returning empty array for crew '${crewName}'`);
        return [];
      }
      console.error(`[getCrewMedia] Failed to fetch crew media for ${crewName}:`, error);
      return [];
    }
  },

  // Get crew media by crew ID (more efficient when we already have the crew ID)
  async getCrewMediaById(crewId: string): Promise<CrewMedia[]> {
    try {
      const response = await makeAirtableRequest<AirtableCrewMediaFields>(
        `/${TABLE_IDS.CREW_MEDIA}?filterByFormula=FIND('${crewId}',ARRAYJOIN({LinkToCrew}))`
      );
      
      return response.records.map(transformCrewMediaRecord);
    } catch (error) {
      // Handle case where CrewMedia table doesn't exist (422 error)
      if (error instanceof Error && error.message.includes('422')) {
        console.warn(`[getCrewMediaById] CrewMedia table not found in Airtable base - returning empty array for crew ID '${crewId}'`);
        return [];
      }
      console.error(`[getCrewMediaById] Failed to fetch crew media for crew ID ${crewId}:`, error);
      return [];
    }
  },

  // NEW FUNCTION: Extract image URLs from crew media based on MediaType
  extractImageUrls(media: CrewMedia[]): { logoUrl: string; heroImageUrl: string } {
    let logoUrl = getDefaultCrewLogo();
    let heroImageUrl = getDefaultCrewPicture();

    // Find logo
    const logoMedia = media.find(m => 
      m.MediaType === 'Logo' && 
      m.Status === 'Published' && 
      m.FileURL
    );
    if (logoMedia && logoMedia.FileURL) {
      logoUrl = logoMedia.FileURL;
    }

    // Find hero image (crew picture)
    const heroMedia = media.find(m => 
      m.MediaType === 'Crew Picture' && 
      m.Status === 'Published' && 
      m.FileURL
    );
    if (heroMedia && heroMedia.FileURL) {
      heroImageUrl = heroMedia.FileURL;
    }

    return { logoUrl, heroImageUrl };
  },

  // Get all crews with basic data only (PERFORMANCE FIX: Avoid N+1 queries)
  // Use this for overview pages where detailed data isn't needed
  async getAllCrews(): Promise<Crew[]> {
    try {
      console.log('=== FETCHING ALL CREWS FROM AIRTABLE WITH PAGINATION (BASIC DATA ONLY) ===');
      const records = await makeAirtableRequestWithPagination<AirtableCrewFields>(`/${TABLE_IDS.CREWS}`);
      const crews = records.map(transformCrewRecord);
      
      console.log(`Total crews fetched: ${crews.length}`);
      console.log('Note: Related data (team members, schedules, media) will be loaded on-demand for individual crew pages');
      
      // PERFORMANCE OPTIMIZATION: Don't fetch related data here
      // This reduces API calls from ~1352 to ~5 for 449 crews
      // Related data will be fetched only when viewing individual crew details
      
      return crews;
    } catch (error) {
      console.error('Failed to fetch crews:', error);
      throw new Error('Unable to fetch crews from Airtable');
    }
  },

  // Get all crews with media data only (for crew cards that need images)
  async getAllCrewsWithMedia(): Promise<Crew[]> {
    try {
      console.log('=== FETCHING ALL CREWS WITH MEDIA DATA ===');
      console.log('getAllCrewsWithMedia function called!');
      const records = await makeAirtableRequestWithPagination<AirtableCrewFields>(`/${TABLE_IDS.CREWS}`);
      const crews = records.map(transformCrewRecord);
      
      console.log(`Total crews fetched: ${crews.length}`);
      console.log('Fetching media data for crew images...');
      
      // Fetch media data for each crew (more efficient than full data)
      for (const crew of crews) {
        try {
          const media = await this.getCrewMediaById(crew.id);
          crew.media = media;
          
          // Extract and populate image URLs from media
          if (crew.media && crew.media.length > 0) {
            const imageUrls = this.extractImageUrls(crew.media);
            crew.logoUrl = imageUrls.logoUrl;
            crew.heroImageUrl = imageUrls.heroImageUrl;
            crew.PrimaryImageUrl = imageUrls.logoUrl;
          }
        } catch (mediaError) {
          console.warn(`Failed to fetch media for crew ${crew.CrewName}:`, mediaError);
          // Set default empty arrays if media fetch fails
          crew.media = [];
        }
      }
      
      return crews;
    } catch (error) {
      console.error('Failed to fetch crews with media:', error);
      throw new Error('Unable to fetch crews from Airtable');
    }
  },

  // Get all crews with full related data (use sparingly, only when all data is needed)
  async getAllCrewsWithFullData(): Promise<Crew[]> {
    try {
      console.log('=== FETCHING ALL CREWS WITH FULL RELATED DATA ===');
      const records = await makeAirtableRequestWithPagination<AirtableCrewFields>(`/${TABLE_IDS.CREWS}`);
      const crews = records.map(transformCrewRecord);
      
      console.log(`Total crews fetched: ${crews.length}`);
      console.log('WARNING: Fetching related data for all crews - this may take a while and hit rate limits');
      
      // Fetch related data for each crew with individual error handling
      for (const crew of crews) {
        try {
          // Use Promise.allSettled to prevent one failed request from breaking everything
          const [teamMembersResult, schedulesResult, mediaResult] = await Promise.allSettled([
            this.getTeamMembers(crew.CrewName),
            this.getRunSchedules(crew.CrewName),
            this.getCrewMediaById(crew.id)
          ]);
          
          crew.teamMembers = teamMembersResult.status === 'fulfilled' ? teamMembersResult.value : [];
          crew.schedules = schedulesResult.status === 'fulfilled' ? schedulesResult.value : [];
          crew.media = mediaResult.status === 'fulfilled' ? mediaResult.value : [];
          
          // Extract and populate image URLs from media
          if (crew.media && crew.media.length > 0) {
            const imageUrls = this.extractImageUrls(crew.media);
            crew.logoUrl = imageUrls.logoUrl;
            crew.heroImageUrl = imageUrls.heroImageUrl;
            // Update PrimaryImageUrl to use the logo from Airtable
            crew.PrimaryImageUrl = imageUrls.logoUrl;
          }
          
          // Log any rejected promises for debugging
          if (teamMembersResult.status === 'rejected') {
            console.warn(`Failed to fetch team members for ${crew.CrewName}:`, teamMembersResult.reason);
          }
          if (schedulesResult.status === 'rejected') {
            console.warn(`Failed to fetch schedules for ${crew.CrewName}:`, schedulesResult.reason);
          }
          if (mediaResult.status === 'rejected') {
            console.warn(`Failed to fetch media for ${crew.CrewName}:`, mediaResult.reason);
          }
        } catch (relatedDataError) {
          console.warn(`Failed to fetch related data for crew ${crew.CrewName}:`, relatedDataError);
          // Set default empty arrays if related data fetch fails
          crew.teamMembers = [];
          crew.schedules = [];
          crew.media = [];
        }
      }
      
      return crews;
    } catch (error) {
      console.error('Failed to fetch crews:', error);
      throw new Error('Unable to fetch crews from Airtable');
    }
  },

  // Get crew by ID with related data
  async getCrewById(crewId: string): Promise<Crew | null> {
    try {
      const response = await makeAirtableRequest<AirtableCrewFields>(
        `/${TABLE_IDS.CREWS}?filterByFormula=RECORD_ID()='${crewId}'`
      );
      
      if (response.records.length === 0) {
        return null;
      }
      
      const crew = transformCrewRecord(response.records[0]);
      
      // Fetch related data
      try {
        const [teamMembersResult, schedulesResult, mediaResult] = await Promise.allSettled([
          this.getTeamMembers(crew.CrewName),
          this.getRunSchedules(crew.CrewName),
          this.getCrewMediaById(crew.id)
        ]);
        
        crew.teamMembers = teamMembersResult.status === 'fulfilled' ? teamMembersResult.value : [];
        crew.schedules = schedulesResult.status === 'fulfilled' ? schedulesResult.value : [];
        crew.media = mediaResult.status === 'fulfilled' ? mediaResult.value : [];
        
        // Extract and populate image URLs from media
        if (crew.media && crew.media.length > 0) {
          const imageUrls = this.extractImageUrls(crew.media);
          crew.logoUrl = imageUrls.logoUrl;
          crew.heroImageUrl = imageUrls.heroImageUrl;
          // Update PrimaryImageUrl to use the logo from Airtable
          crew.PrimaryImageUrl = imageUrls.logoUrl;
        }
      } catch (relatedDataError) {
        console.warn(`Failed to fetch related data for crew ${crew.CrewName}:`, relatedDataError);
        // Set default empty arrays if related data fetch fails
        crew.teamMembers = [];
        crew.schedules = [];
        crew.media = [];
      }
      
      return crew;
    } catch (error) {
      console.error(`Failed to fetch crew ${crewId}:`, error);
      throw new Error(`Unable to fetch crew ${crewId} from Airtable`);
    }
  },

  // Get crews by city with basic data only (PERFORMANCE FIX: Avoid N+1 queries)
  // Use this for "other crews in city" sections where detailed data isn't needed
  async getCrewsByCity(city: string): Promise<Crew[]> {
    try {
      const response = await makeAirtableRequest<AirtableCrewFields>(
        `/${TABLE_IDS.CREWS}?filterByFormula={City}='${city}'`
      );
      const crews = response.records.map(transformCrewRecord);
      
      // PERFORMANCE OPTIMIZATION: Don't fetch related data here
      // This is used for "other crews in city" sections where basic info is sufficient
      
      return crews;
    } catch (error) {
      console.error(`Failed to fetch crews in ${city}:`, error);
      throw new Error(`Unable to fetch crews in ${city} from Airtable`);
    }
  },

  // Get crews by city with full related data (use sparingly)
  async getCrewsByCityWithFullData(city: string): Promise<Crew[]> {
    try {
      const response = await makeAirtableRequest<AirtableCrewFields>(
        `/${TABLE_IDS.CREWS}?filterByFormula={City}='${city}'`
      );
      const crews = response.records.map(transformCrewRecord);
      
      // Fetch related data for each crew
      for (const crew of crews) {
        try {
          const [teamMembersResult, schedulesResult, mediaResult] = await Promise.allSettled([
            this.getTeamMembers(crew.CrewName),
            this.getRunSchedules(crew.CrewName),
            this.getCrewMediaById(crew.id)
          ]);
          
          crew.teamMembers = teamMembersResult.status === 'fulfilled' ? teamMembersResult.value : [];
          crew.schedules = schedulesResult.status === 'fulfilled' ? schedulesResult.value : [];
          crew.media = mediaResult.status === 'fulfilled' ? mediaResult.value : [];
          
          // Extract and populate image URLs from media
          if (crew.media && crew.media.length > 0) {
            const imageUrls = this.extractImageUrls(crew.media);
            crew.logoUrl = imageUrls.logoUrl;
            crew.heroImageUrl = imageUrls.heroImageUrl;
            // Update PrimaryImageUrl to use the logo from Airtable
            crew.PrimaryImageUrl = imageUrls.logoUrl;
          }
        } catch (relatedDataError) {
          console.warn(`Failed to fetch related data for crew ${crew.CrewName}:`, relatedDataError);
          // Set default empty arrays if related data fetch fails
          crew.teamMembers = [];
          crew.schedules = [];
          crew.media = [];
        }
      }
      
      return crews;
    } catch (error) {
      console.error(`Failed to fetch crews in ${city}:`, error);
      throw new Error(`Unable to fetch crews in ${city} from Airtable`);
    }
  },

  // Search crews by name with basic data only (PERFORMANCE FIX: Avoid N+1 queries)
  // Use this for search results where detailed data isn't needed
  async searchCrews(searchTerm: string): Promise<Crew[]> {
    try {
      const response = await makeAirtableRequest<AirtableCrewFields>(
        `/${TABLE_IDS.CREWS}?filterByFormula=SEARCH('${searchTerm}',{CrewName})`
      );
      const crews = response.records.map(transformCrewRecord);
      
      // PERFORMANCE OPTIMIZATION: Don't fetch related data here
      // This is used for search results where basic info is sufficient
      
      return crews;
    } catch (error) {
      console.error(`Failed to search crews with term ${searchTerm}:`, error);
      throw new Error(`Unable to search crews with term ${searchTerm} from Airtable`);
    }
  },

  // Search crews by name with full related data (use sparingly)
  async searchCrewsWithFullData(searchTerm: string): Promise<Crew[]> {
    try {
      const response = await makeAirtableRequest<AirtableCrewFields>(
        `/${TABLE_IDS.CREWS}?filterByFormula=SEARCH('${searchTerm}',{CrewName})`
      );
      const crews = response.records.map(transformCrewRecord);
      
      // Fetch related data for each crew
      for (const crew of crews) {
        try {
          const [teamMembersResult, schedulesResult, mediaResult] = await Promise.allSettled([
            this.getTeamMembers(crew.CrewName),
            this.getRunSchedules(crew.CrewName),
            this.getCrewMediaById(crew.id)
          ]);
          
          crew.teamMembers = teamMembersResult.status === 'fulfilled' ? teamMembersResult.value : [];
          crew.schedules = schedulesResult.status === 'fulfilled' ? schedulesResult.value : [];
          crew.media = mediaResult.status === 'fulfilled' ? mediaResult.value : [];
          
          // Extract and populate image URLs from media
          if (crew.media && crew.media.length > 0) {
            const imageUrls = this.extractImageUrls(crew.media);
            crew.logoUrl = imageUrls.logoUrl;
            crew.heroImageUrl = imageUrls.heroImageUrl;
            // Update PrimaryImageUrl to use the logo from Airtable
            crew.PrimaryImageUrl = imageUrls.logoUrl;
          }
        } catch (relatedDataError) {
          console.warn(`Failed to fetch related data for crew ${crew.CrewName}:`, relatedDataError);
          // Set default empty arrays if related data fetch fails
          crew.teamMembers = [];
          crew.schedules = [];
          crew.media = [];
        }
      }
      
      return crews;
    } catch (error) {
      console.error(`Failed to search crews with term ${searchTerm}:`, error);
      throw new Error(`Unable to search crews with term ${searchTerm}`);
    }
  },

  // Get crews by SEO slug
  async getCrewBySlug(slug: string): Promise<Crew | null> {
    try {
      const response = await makeAirtableRequest<AirtableCrewFields>(
        `/${TABLE_IDS.CREWS}?filterByFormula={SEO_Slug}='${slug}'`
      );
      
      if (response.records.length === 0) {
        return null;
      }
      
      const crew = transformCrewRecord(response.records[0]);
      
      // Fetch related data
      try {
        const [teamMembersResult, schedulesResult, mediaResult] = await Promise.allSettled([
          this.getTeamMembers(crew.CrewName),
          this.getRunSchedules(crew.CrewName),
          this.getCrewMediaById(crew.id)
        ]);
        
        crew.teamMembers = teamMembersResult.status === 'fulfilled' ? teamMembersResult.value : [];
        crew.schedules = schedulesResult.status === 'fulfilled' ? schedulesResult.value : [];
        crew.media = mediaResult.status === 'fulfilled' ? mediaResult.value : [];
        
        // Extract and populate image URLs from media
        if (crew.media && crew.media.length > 0) {
          const imageUrls = this.extractImageUrls(crew.media);
          crew.logoUrl = imageUrls.logoUrl;
          crew.heroImageUrl = imageUrls.heroImageUrl;
          // Update PrimaryImageUrl to use the logo from Airtable
          crew.PrimaryImageUrl = imageUrls.logoUrl;
        }
      } catch (relatedDataError) {
        console.warn(`Failed to fetch related data for crew ${crew.CrewName}:`, relatedDataError);
        // Set default empty arrays if related data fetch fails
        crew.teamMembers = [];
        crew.schedules = [];
        crew.media = [];
      }
      
      return crew;
    } catch (error) {
      console.error(`Failed to fetch crew with slug ${slug}:`, error);
      throw new Error(`Unable to fetch crew with slug ${slug} from Airtable`);
    }
  },

  // Get random routes
  async getRandomRoutes(limit: number = 3): Promise<RunningRoute[]> {
    try {
      // Fetch all published routes
      // CONSISTENCY FIX: Use table ID instead of table name for reliability
      const response = await makeAirtableRequest<any>(
        `/${TABLE_IDS.RUNNING_ROUTES}?filterByFormula=Status='Published'`
      );
      
      if (response.records.length === 0) {
        console.log('[getRandomRoutes] No published routes found');
        return [];
      }
      
      // Transform records to RunningRoute objects
      const routes = response.records.map(transformRouteRecord);
      
      // Shuffle and return limited number of routes
      const shuffled = routes.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, limit);
    } catch (error) {
      console.error('Failed to fetch random routes:', error);
      return [];
    }
  },

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      await makeAirtableRequest(`/${TABLE_IDS.CREWS}`, { maxRecords: 1 });
      return true;
    } catch (error) {
      console.error('Airtable connection test failed:', error);
      return false;
    }
  },
};

export default airtableService;