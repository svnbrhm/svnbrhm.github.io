# Airtable Setup Guide for Real Data

This guide explains how to configure Airtable to fetch real statistics instead of mock data.

**Last Updated:** June 26, 2025

## Important: Environment Variable Standardization

As of June 26, 2025, all project files use `AIRTABLE_PERSONAL_ACCESS_TOKEN` consistently. The deprecated `AIRTABLE_API_KEY` references have been removed from all configuration files and documentation.

## Prerequisites

1. An Airtable account with access to your running crews database
2. A base containing crew and runner data

## Required Airtable Tables

Your Airtable base should contain these tables:

### 1. Crews Table
- **CrewName** (Single line text)
- **City** (Single line text) 
- **Country** (Single line text)
- **ApproxMemberCount** (Number)
- **Status** (Single select: publish/draft/pending)

### 2. Runners Table
- Any structure containing runner data
- Used for counting total runners

## Configuration Steps

### Step 1: Get Your Airtable Personal Access Token

1. Go to [Airtable Developer Hub](https://airtable.com/developers/web/api/introduction)
2. Click "Create token" 
3. Give your token a name (e.g., "RunningCrews Website")
4. Select the required scopes:
   - `data.records:read`
   - `schema.bases:read`
5. Select your base
6. Copy the generated token

### Step 2: Get Your Base ID

1. Go to your Airtable base
2. Click "Help" in the top right
3. Click "API documentation"
4. Your Base ID will be shown (starts with `app`)

### Step 3: Update Environment Variables

1. Open `.env.local` in your project root
2. Replace the placeholder values:

```env
# Airtable Configuration (Standardized as of June 26, 2025)
AIRTABLE_PERSONAL_ACCESS_TOKEN=your_actual_token_here
AIRTABLE_BASE_ID=your_actual_base_id_here

# Note: AIRTABLE_API_KEY is deprecated and no longer used
# All project files now use AIRTABLE_PERSONAL_ACCESS_TOKEN consistently
```

### Step 4: Update Table IDs (if needed)

If your table names differ from the defaults, update `lib/airtable.ts`:

```typescript
const TABLE_IDS = {
  CREWS: 'your_crews_table_name',
  RUNNERS: 'your_runners_table_name',
  // Routes and Events are calculated, not fetched
};
```

## Data Mapping

The system fetches:

- **Published Crews**: Count of crews with Status = "Published"
- **Total Runners**: Total count from Runners table
- **Unique Cities**: Distinct cities from Crews table
- **Unique Countries**: Distinct countries from Crews table
- **Routes**: Calculated as `publishedCrews * 1.2` (fallback)
- **Events**: Calculated as `publishedCrews * 0.3` (fallback)

## Testing

1. Restart your development server: `npm run dev`
2. Check the browser console for:
   - "Airtable configured, fetching real data"
   - Actual statistics being logged
3. Visit `/admin/mock-data-monitor` to verify data fetching

## Troubleshooting

### Common Issues

1. **"Airtable not configured" message**
   - Check that both token and base ID are set in `.env.local`
   - Restart the development server

2. **API errors in console**
   - Verify your token has correct permissions
   - Check that table names match your Airtable base
   - Ensure base ID is correct

3. **Zero statistics**
   - Verify your crews have the correct Status field values
   - Check that city and country fields are populated
   - Ensure your base structure matches the expected schema

4. **Environment variable confusion**
   - Use `AIRTABLE_PERSONAL_ACCESS_TOKEN` (not `AIRTABLE_API_KEY`)
   - All project files have been standardized to use this naming
   - Legacy references exist only in migration documentation
   - Check that your Crews table has records with Status = "Published"
   - Verify field names match the expected structure

### Debug Mode

The system logs detailed information to the console when fetching data. Check the browser console for:
- Airtable configuration status
- API request details
- Calculated statistics
- Any error messages

## Security Notes

- Never commit your actual tokens to version control
- Keep `.env.local` in your `.gitignore`
- Use environment-specific tokens for production
- Regularly rotate your access tokens

## Production Deployment

For production, set the environment variables in your hosting platform:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Environment Variables
- Other platforms: Follow their environment variable documentation