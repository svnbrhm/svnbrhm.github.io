# Statistics Discrepancy Resolution

## Issue Summary

There was a discrepancy between the manual count of cities (188) and the automated statistics calculation (170 cities). After thorough analysis, we discovered that the manual count included all crew statuses, while the automated calculation only counted published crews.

## Root Cause Analysis

### Manual Count vs Automated Count
- **Manual Count**: 188 cities (included all crew statuses: published, draft, pending, undefined)
- **Automated Count**: 170 cities (only published crews)
- **Discrepancy**: 18 cities difference

### Crew Status Distribution
- **Total Crews**: 449
- **Published**: 362 crews
- **Draft**: 64 crews
- **Pending**: 21 crews
- **Undefined**: 2 crews

### Analysis Results
- **Cities from Published Crews**: 170 unique cities
- **Cities from All Crews**: 188 unique cities
- **Countries from Published Crews**: 58 unique countries
- **Countries from All Crews**: 60 unique countries

## Solution Implemented

### Changes Made to `lib/airtable.ts`

Updated the `getGlobalStatistics()` function to:

1. **Active Crews Count**: Still uses published crews only (362)
2. **Total Runners**: Still uses published crews only (sum of member counts)
3. **Cities Count**: Now uses ALL crews including draft, pending, etc. (188)
4. **Countries Count**: Now uses ALL crews including draft, pending, etc. (60)

### Code Changes

```typescript
// OLD: Only published crews for all statistics
const publishedCrews = allCrews.filter(crew => crew.fields.Status === 'Published');
const transformedCrews = publishedCrews.map(transformCrewRecord);

// NEW: Separate handling for different statistics
const publishedCrews = allCrews.filter(crew => crew.fields.Status === 'Published');
const transformedPublishedCrews = publishedCrews.map(transformCrewRecord);
const transformedAllCrews = allCrews.map(transformCrewRecord);

// Active crews and runners: Published only
const activeCrews = transformedPublishedCrews.length;
const totalRunners = transformedPublishedCrews.reduce(...);

// Cities and countries: All crews
const uniqueCities = new Set(transformedAllCrews.map(...));
const uniqueCountries = new Set(transformedAllCrews.map(...));
```

### Mock Data Updates

Updated fallback mock data to reflect the new approach:
- Cities: 85 → 188
- Countries: 25 → 60

## Rationale

### Why Include All Crews for Cities/Countries?

1. **Geographic Representation**: Cities and countries represent the global reach of the running community, regardless of crew publication status
2. **Manual Count Alignment**: The manual count naturally included all crews, making this the expected behavior
3. **Future-Proofing**: Draft and pending crews will eventually be published, so including them provides a more complete picture

### Why Keep Published Only for Active Crews/Runners?

1. **Active Status**: Only published crews are considered "active" and publicly visible
2. **Member Counts**: Runner totals should only include crews that are actually operational
3. **User Expectations**: Visitors expect "active crews" to mean published/operational crews

## Verification

The solution was verified using a test script that confirmed:
- ✅ Cities count: 188 (matches manual count)
- ✅ Countries count: 60 (matches analysis)
- ✅ Published crews: 362 (unchanged)
- ✅ Difference: +18 cities, +2 countries from non-published crews

## Files Modified

1. `lib/airtable.ts` - Updated statistics calculation logic
2. `scripts/testUpdatedStatistics.js` - Created verification script
3. `STATISTICS_DISCREPANCY_RESOLUTION.md` - This documentation

## Impact

The website now displays:
- **Active Crews**: 362 (published crews only)
- **Cities**: 188 (all crews)
- **Countries**: 60 (all crews)
- **Total Runners**: Based on published crews only

This provides a more accurate representation of the global running community while maintaining the distinction between active/published crews and the total geographic reach.