# Mock Data Tracking System

This document explains the comprehensive mock data tracking system implemented to monitor when and why the application falls back to mock data instead of using Airtable.

## Overview

The mock data tracking system provides real-time monitoring and historical analysis of mock data usage throughout the application. This helps ensure that all data comes from Airtable and quickly identifies when fallbacks occur.

## Key Components

### 1. MockDataTracker (`lib/mockDataTracker.ts`)

The core tracking system that:
- Records every instance of mock data usage
- Stores usage history in browser localStorage
- Provides metrics and analytics
- Sends data to external analytics if configured

### 2. Integration Points

Mock data tracking is integrated into:
- **Airtable Service** (`lib/airtable.ts`): Tracks when functions return mock data
- **Components** (`components/Crew/CrewList.tsx`): Tracks component-level fallbacks
- **Pages** (`pages/index.tsx`): Tracks page-level fallbacks

### 3. Monitoring Interface

- **Admin Panel**: `/admin/revalidation` - Quick status overview
- **Dedicated Monitor**: `/admin/mock-data-monitor` - Detailed monitoring interface
- **API Endpoint**: `/api/mock-data-metrics` - Programmatic access to metrics

## Usage Tracking

### Automatic Tracking

The system automatically tracks mock data usage in these scenarios:

1. **Airtable Not Configured**
   - Missing `AIRTABLE_PERSONAL_ACCESS_TOKEN`
   - Missing `AIRTABLE_BASE_ID`
   - Tracked as: `airtable_not_configured`

2. **Airtable Errors**
   - API request failures
   - Network connectivity issues
   - Tracked as: `airtable_error`

3. **Component Fallbacks**
   - When components receive no data
   - When data fetching fails
   - Tracked as: `airtable_error`

### Manual Tracking

You can manually track mock data usage:

```typescript
import { trackMockDataUsage } from '../lib/mockDataTracker';

// Track a fallback
trackMockDataUsage(
  'function_name', 
  'airtable_error', 
  'Additional context about the error'
);
```

## Monitoring Interfaces

### 1. Admin Panel Integration

The main admin panel at `/admin/revalidation` includes a compact mock data monitor showing:
- Current status (green/orange/red indicator)
- Recent usage count
- Quick access to detailed monitoring

### 2. Dedicated Monitor Page

The dedicated monitor at `/admin/mock-data-monitor` provides:
- Real-time status indicators
- Detailed metrics breakdown
- Function-by-function usage analysis
- Recent usage history
- Troubleshooting guidance

### 3. API Endpoint

The API endpoint `/api/mock-data-metrics` returns:
```json
{
  "status": "all_airtable|recent_fallbacks|using_mock",
  "isCurrentlyUsingMock": false,
  "metrics": {
    "totalUsages": 0,
    "usagesByFunction": {},
    "usagesByReason": {},
    "recentUsages": []
  },
  "summary24h": {
    "count": 0,
    "functions": [],
    "reasons": []
  },
  "timestamp": "2025-06-24T...",
  "environment": "development",
  "airtableConfigured": true
}
```

## Status Indicators

### 🟢 Green - All Good
- All data is coming from Airtable
- No recent mock data usage
- System is functioning normally

### 🟡 Orange - Recent Fallbacks
- Mock data was used within the last 24 hours
- System recovered but had temporary issues
- Review recent usage for patterns

### 🔴 Red - Currently Using Mock
- Mock data is currently being used
- Immediate attention required
- Check Airtable configuration and connectivity

## Tracked Functions

The following functions are monitored for mock data usage:

### Airtable Service Functions
- `airtable_initialization` - Initial configuration check
- `getCrewsWithImages` - Crew data with image loading
- `getAllCrews` - Basic crew data
- `getGlobalStatistics` - Homepage statistics

### Component Functions
- `CrewList_component` - Crew listing component
- `homepage_getStaticProps` - Homepage data fetching

## Troubleshooting

### Common Issues and Solutions

1. **"airtable_not_configured" Errors**
   - Check environment variables
   - Verify `AIRTABLE_PERSONAL_ACCESS_TOKEN` is set
   - Verify `AIRTABLE_BASE_ID` is set
   - Test connection at `/api/test-connection`

2. **"airtable_error" Errors**
   - Check network connectivity
   - Verify Airtable API status
   - Check API token permissions
   - Review error context in recent usages

3. **Persistent Mock Data Usage**
   - Clear tracking data and monitor fresh
   - Check for configuration issues
   - Review application logs
   - Test individual API endpoints

### Debugging Steps

1. **Check Current Status**
   ```bash
   curl https://your-domain.com/api/mock-data-metrics
   ```

2. **Review Browser Console**
   - Look for mock data tracking logs
   - Check for Airtable API errors
   - Monitor network requests

3. **Test Airtable Connection**
   - Visit `/api/test-connection`
   - Check response for errors
   - Verify data is being returned

## Analytics Integration

The system can send tracking data to external analytics:

### Google Analytics
If Google Analytics is configured, mock data usage events are sent with:
- Event Category: `data_fallback`
- Event Label: Function name
- Custom Parameters: Reason and context

### Custom Analytics
Set `NEXT_PUBLIC_ANALYTICS_ENDPOINT` to send data to a custom endpoint:
```json
{
  "type": "mock_data_usage",
  "data": {
    "timestamp": "2025-06-24T...",
    "function": "getCrewsWithImages",
    "reason": "airtable_error",
    "context": "Network timeout"
  }
}
```

## Data Storage

### Browser Storage
- Usage history stored in `localStorage`
- Limited to last 100 usages
- Persists across browser sessions
- Can be cleared via monitor interface

### Server-Side
- No persistent server-side storage
- Metrics calculated in real-time
- API endpoint provides current state

## Best Practices

### For Developers
1. **Always use the tracking system** when implementing new fallbacks
2. **Provide meaningful context** in tracking calls
3. **Monitor the admin panel** during development
4. **Test both success and failure scenarios**

### For Operations
1. **Check the monitor regularly** to ensure Airtable connectivity
2. **Set up alerts** using the API endpoint
3. **Review usage patterns** to identify systemic issues
4. **Keep Airtable credentials updated**

### For Content Managers
1. **Green status means all data is live** from Airtable
2. **Orange/Red status means some data may be outdated**
3. **Contact technical team** if status remains non-green
4. **Use the revalidation panel** to refresh data after Airtable changes

## Future Enhancements

Potential improvements to the tracking system:

1. **Server-side persistence** for long-term analytics
2. **Email/Slack alerts** for persistent mock data usage
3. **Performance impact tracking** of fallbacks
4. **Automated recovery attempts** for transient errors
5. **Integration with monitoring services** (DataDog, New Relic, etc.)

## Related Documentation

- [Airtable Migration Guide](./AIRTABLE_MIGRATION.md)
- [On-Demand Revalidation](./ON_DEMAND_REVALIDATION.md)
- [Vercel Airtable Workflow](./VERCEL_AIRTABLE_WORKFLOW.md)
- [Bug Report Template](../BUGREPORT.md)