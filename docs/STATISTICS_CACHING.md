# Statistics Caching System

*Last Updated: May 26, 2025*

This document describes the statistics caching system implemented to improve homepage loading performance and eliminate the "Loading statistics..." delay.

## Overview

The statistics displayed on the homepage (Active Crews, Total Runners, Cities, Countries, Routes, Events) have been completely redesigned to use a server-side caching architecture. **Instead of fetching data directly from Airtable in the React component**, the system now:

1. **Serves pre-cached data** from a server-side API endpoint
2. **Updates the cache daily** via automated Vercel cron jobs
3. **Provides instant loading** with smart fallback mechanisms
4. **Eliminates client-side Airtable calls** for better performance and security

## Architecture

### Files Created/Modified

#### New Files
- **`/pages/api/statistics.ts`** - Main API endpoint serving cached statistics
- **`/pages/api/cron/update-statistics.ts`** - Automated cron job for cache updates
- **`/public/data/statistics.json`** - JSON cache file with statistics data
- **`/scripts/updateStatistics.js`** - Manual cache update script for testing
- **`/docs/STATISTICS_CACHING.md`** - This documentation file

#### Modified Files
- **`/components/Statistics.tsx`** - **MAJOR CHANGE**: Removed direct `airtableService` import, now fetches from `/api/statistics`
- **`/vercel.json`** - Added daily cron job configuration
- **`/package.json`** - Added `update:statistics` script

### API Endpoints

#### GET `/api/statistics`

Returns cached statistics with metadata:

```json
{
  "data": {
    "activeCrews": 150,
    "totalRunners": 4500,
    "cities": 188,
    "countries": 60,
    "routes": 180,
    "events": 45
  },
  "lastUpdated": "2024-01-01T00:00:00.000Z",
  "nextUpdate": "2024-01-01T01:00:00.000Z",
  "cacheAge": 3600000,
  "source": "cache"
}
```

#### POST `/api/cron/update-statistics`

Cron job endpoint that:
- Fetches fresh data from Airtable
- Updates the cache file
- Runs daily at 3:00 AM UTC

## Cron Schedule

- **Crew Data Update**: 2:00 AM UTC (`/api/cron/update-crew-data`)
- **Statistics Update**: 3:00 AM UTC (`/api/cron/update-statistics`)

## Cache Behavior

### Cache Freshness
- **Fresh**: Cache age < 24 hours → Serve immediately
- **Stale**: Cache age ≥ 24 hours → Refresh in background, serve stale data
- **Missing**: No cache file → Fetch live data from Airtable

### Error Handling
- If Airtable is unavailable, serves last known cached data
- If cache is corrupted, falls back to live Airtable fetch
- Comprehensive error logging for debugging

## Manual Operations

### Update Statistics Cache
```bash
npm run update:statistics
```

### Test API Endpoint
```bash
curl http://localhost:3000/api/statistics
```

### Trigger Cron Job (Production)
```bash
curl -X POST https://your-domain.vercel.app/api/cron/update-statistics \
  -H "Authorization: Bearer cron-secret-token"
```

## Performance Benefits

### Before (Direct Airtable Fetch)
- **Architecture**: React component directly imported `airtableService`
- **Loading Time**: 2-5 seconds
- **User Experience**: "Loading statistics..." spinner on every visit
- **API Calls**: Every page load (client-side)
- **Rate Limits**: Potential Airtable API limits
- **Security**: Airtable credentials exposed to client-side

### After (Server-Side Cached System)
- **Architecture**: React component fetches from `/api/statistics` endpoint
- **Loading Time**: ~100-300ms (instant from cache)
- **User Experience**: Statistics appear immediately
- **API Calls**: Once per day (server-side only)
- **Rate Limits**: No concerns
- **Security**: Airtable credentials secured on server-side

## Monitoring

### Logs to Monitor
- Cache hit/miss rates in `/api/statistics`
- Cron job execution in `/api/cron/update-statistics`
- Airtable fetch errors
- Cache file write/read errors

### Health Checks
- Verify cache file exists: `/public/data/statistics.json`
- Check last update timestamp
- Monitor API response times

## Troubleshooting

### Cache Not Updating
1. Check Vercel cron job logs
2. Verify Airtable API credentials
3. Manually run: `npm run update:statistics`

### Stale Data Displayed
1. Check cache file timestamp
2. Verify cron job is running
3. Force cache refresh via manual script

### API Errors
1. Check Airtable service status
2. Verify environment variables
3. Review error logs in Vercel dashboard

## Implementation Details

### Key Architecture Changes

1. **Component Refactoring**: `Statistics.tsx` now uses `fetch('/api/statistics')` instead of direct Airtable imports
2. **Server-Side Processing**: All Airtable interactions moved to API routes
3. **Cache-First Strategy**: Always serve cached data first, refresh in background if stale
4. **Graceful Degradation**: Multiple fallback layers ensure statistics always display

### Node.js Compatibility Fix

During implementation, we encountered a module resolution error when running the update script. This was resolved by:
- Replacing direct TypeScript imports in Node.js scripts
- Using the existing `/api/simple-stats` endpoint as a data source
- Implementing proper fallback mechanisms

## Future Enhancements

- **Real-time Updates**: WebSocket integration for live statistics
- **Multiple Cache Layers**: Redis for faster access in production
- **Analytics**: Track cache performance and hit/miss rates
- **Smart Refresh**: Update cache when significant changes detected
- **CDN Integration**: Serve statistics from edge locations