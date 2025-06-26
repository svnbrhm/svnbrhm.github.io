# Crew Data Optimization Implementation

This document describes the implementation of the crew data optimization system that replaces real-time API calls with static data generation for improved map performance.

## Overview

The optimization system addresses three main performance issues:
1. **Dynamic API calls** on every map interaction
2. **Real-time geocoding overhead** for crew locations
3. **Airtable rate limits** affecting user experience

## Solution Components

### 1. Static Data Generator (`scripts/generateStaticCrewData.js`)

Generates pre-processed crew data with coordinates:
- Fetches all crews from Airtable
- Uses existing headquarters coordinates when available
- Geocodes missing coordinates using OpenStreetMap Nominatim API
- Implements rate limiting (1 second between requests)
- Includes retry logic for failed requests
- Outputs to `public/data/crews-with-coordinates.json`

**Usage:**
```bash
# Generate crew data manually
npm run generate:crew-data

# Update crew data (alias)
npm run update:crew-data
```

### 2. Optimized WorldMap Component (`components/Map/WorldMapOptimized.tsx`)

Replaces the original WorldMap with static data loading:
- Loads pre-generated JSON data instead of making API calls
- Falls back to SSG data if static data is unavailable
- Implements client-side bounds filtering for performance
- Maintains all original functionality (popups, markers, zoom levels)
- Shows data source and statistics in the UI

### 3. Build Integration

Updated `package.json` scripts:
- `build`: Generates crew data before building (production)
- `build:fast`: Builds without generating data (development)
- `generate:crew-data`: Manual data generation
- `update:crew-data`: Alias for data generation

### 4. Automated Updates

Two options for keeping data current:

#### Option A: Vercel Cron Jobs
- **Endpoint:** `/api/cron/update-crew-data`
- **Schedule:** Daily at 2 AM UTC
- **Configuration:** Added to `vercel.json`
- **Security:** Uses `CRON_SECRET` environment variable

#### Option B: GitHub Actions
- **Workflow:** `.github/workflows/update-crew-data.yml`
- **Schedule:** Daily at 2 AM UTC
- **Features:** 
  - Detects changes before committing
  - Triggers Vercel deployment
  - Provides detailed summaries
  - Manual trigger support

## Environment Variables

### Required
- `AIRTABLE_API_KEY`: Airtable API access
- `AIRTABLE_BASE_ID`: Airtable base identifier

### Optional (for automation)
- `CRON_SECRET`: Security token for Vercel cron jobs
- `REVALIDATION_SECRET`: For triggering page revalidation
- `VERCEL_DEPLOY_HOOK`: GitHub Actions deployment trigger

## File Structure

```
├── scripts/
│   └── generateStaticCrewData.js     # Data generator
├── components/Map/
│   ├── WorldMap.tsx                  # Original component
│   └── WorldMapOptimized.tsx         # Optimized component
├── pages/api/cron/
│   └── update-crew-data.ts           # Vercel cron endpoint
├── .github/workflows/
│   └── update-crew-data.yml          # GitHub Actions workflow
├── public/data/
│   └── crews-with-coordinates.json   # Generated static data
└── vercel.json                       # Vercel configuration
```

## Performance Benefits

### Before Optimization
- Real-time API calls to Airtable on every map interaction
- Geocoding requests for each crew without coordinates
- Network latency affecting map responsiveness
- Rate limiting issues during high traffic

### After Optimization
- **Instant loading**: Static JSON file loads immediately
- **No API limits**: Eliminates real-time Airtable calls
- **Pre-geocoded**: All coordinates resolved at build time
- **Efficient filtering**: Client-side bounds checking
- **Fallback support**: Graceful degradation to SSG data

## Data Flow

### Build Time
1. `npm run build` triggers data generation
2. Script fetches all crews from Airtable
3. Missing coordinates are geocoded with rate limiting
4. Static JSON file is created in `public/data/`
5. Next.js build proceeds with optimized data

### Runtime
1. WorldMapOptimized loads static JSON file
2. Client-side filtering based on map bounds
3. Markers rendered without API calls
4. Fallback to SSG data if static file unavailable

### Updates
1. Automated daily updates via cron job or GitHub Actions
2. New data generated and deployed automatically
3. Pages revalidated to reflect changes

## Monitoring and Debugging

### Console Logs
- Data generation progress and statistics
- Geocoding success/failure rates
- Data source information (static vs fallback)
- Performance metrics

### Error Handling
- Graceful fallback to SSG data
- Retry logic for failed geocoding
- Detailed error messages in logs
- Status indicators in UI

## Migration Guide

### From Original WorldMap
1. Replace `WorldMap` import with `WorldMapOptimized`
2. Generate initial static data: `npm run generate:crew-data`
3. Test with both static and fallback data
4. Deploy with automated updates enabled

### Rollback Plan
If issues occur, simply revert the import:
```tsx
// Rollback to original
const WorldMap = dynamic(() => import('../components/Map/WorldMap'), { ssr: false });
```

## Maintenance

### Regular Tasks
- Monitor automated update logs
- Check data freshness in production
- Verify geocoding success rates
- Update rate limiting if needed

### Troubleshooting
- **Static data not loading**: Check file exists in `public/data/`
- **Geocoding failures**: Verify OpenStreetMap API access
- **Cron job failures**: Check environment variables and logs
- **Build failures**: Run `npm run build:fast` to skip data generation

## Future Enhancements

1. **Incremental updates**: Only geocode new/changed crews
2. **Multiple geocoding providers**: Fallback options for reliability
3. **Data validation**: Verify coordinate accuracy
4. **Performance metrics**: Track loading times and success rates
5. **Cache optimization**: Browser caching strategies for static data

## Support

For issues or questions:
1. Check console logs for error details
2. Verify environment variables are set
3. Test data generation manually
4. Review automated update logs
5. Use fallback mode if needed