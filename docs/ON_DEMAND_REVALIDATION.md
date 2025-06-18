# On-Demand Revalidation Guide

This guide explains how to use the on-demand revalidation feature to manually trigger ISR (Incremental Static Regeneration) updates when crew data changes in Airtable.

## Overview

The RunningCrews.com website uses Next.js ISR to provide fast, static pages that automatically update on a schedule:
- **Homepage**: Revalidates every 24 hours
- **Crew Listing**: Revalidates every 1 hour  
- **Crew Detail Pages**: Revalidate every 24 hours

However, when you make important updates to crew data in Airtable, you might want to trigger immediate updates without waiting for the automatic revalidation schedule.

## Setup

### 1. Environment Variables

Add the following to your `.env.local` file:

```bash
# Required: Server-side revalidation secret
REVALIDATION_SECRET=your_secure_random_secret_here

# Optional: Client-side access (use with caution in production)
NEXT_PUBLIC_REVALIDATION_SECRET=your_secure_random_secret_here
```

**Security Note**: Use a strong, random secret. Consider using different secrets for different environments (development, staging, production).

### 2. Generate a Secure Secret

You can generate a secure secret using:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32

# Using Python
python3 -c "import secrets; print(secrets.token_hex(32))"
```

## Usage

### 1. Admin Panel (Recommended)

Visit `/admin/revalidation` in your browser (only available in development mode by default).

The admin panel provides a user-friendly interface to:
- Revalidate the homepage
- Revalidate all crew-related pages
- Revalidate specific crew pages
- Revalidate custom paths

### 2. API Endpoint

Make a POST request to `/api/revalidate`:

```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "your_revalidation_secret",
    "type": "crews"
  }'
```

#### API Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `secret` | string | **Required.** Your revalidation secret token |
| `type` | string | **Required.** Type of revalidation: `crews`, `crew`, `custom`, or `all` |
| `paths` | string[] | **Optional.** Array of specific paths to revalidate (required for `crew` and `custom` types) |

#### Revalidation Types

**`crews`** - Revalidates crew-related pages:
```json
{
  "secret": "your_secret",
  "type": "crews"
}
```
Revalidates: `/`, `/crews`

**`crew`** - Revalidates specific crew page:
```json
{
  "secret": "your_secret",
  "type": "crew",
  "paths": ["/crews/rec123abc"]
}
```
Revalidates: specified crew page + `/crews` + `/`

**`custom`** - Revalidates custom paths:
```json
{
  "secret": "your_secret",
  "type": "custom",
  "paths": ["/", "/crews", "/crews/rec123abc"]
}
```
Revalidates: only the specified paths

**`all`** - Revalidates all main pages:
```json
{
  "secret": "your_secret",
  "type": "all"
}
```
Revalidates: `/`, `/crews`

### 3. Programmatic Usage

Use the provided utility functions in your code:

```typescript
import { 
  revalidateAllCrews, 
  revalidateCrew, 
  revalidateCustomPaths,
  useRevalidation 
} from '../lib/revalidation';

// Revalidate all crew pages
await revalidateAllCrews('your_secret');

// Revalidate specific crew
await revalidateCrew('rec123abc', 'your_secret');

// Revalidate custom paths
await revalidateCustomPaths(['/crews', '/crews/rec123abc'], 'your_secret');

// React hook for components
function MyComponent() {
  const { revalidate, isRevalidating, error } = useRevalidation();
  
  const handleRevalidate = async () => {
    await revalidate({
      type: 'crews',
      secret: 'your_secret'
    });
  };
  
  return (
    <button onClick={handleRevalidate} disabled={isRevalidating}>
      {isRevalidating ? 'Revalidating...' : 'Revalidate Crews'}
    </button>
  );
}
```

## Common Use Cases

### 1. New Crew Added
When you add a new crew to Airtable:
```bash
curl -X POST /api/revalidate -d '{
  "secret": "your_secret",
  "type": "crews"
}'
```

### 2. Crew Information Updated
When you update a specific crew's information:
```bash
curl -X POST /api/revalidate -d '{
  "secret": "your_secret",
  "type": "crew",
  "paths": ["/crews/rec123abc"]
}'
```

### 3. Homepage Content Changed
When you want to update just the homepage:
```bash
curl -X POST /api/revalidate -d '{
  "secret": "your_secret",
  "type": "custom",
  "paths": ["/"]
}'
```

### 4. Bulk Updates
After making multiple changes to crew data:
```bash
curl -X POST /api/revalidate -d '{
  "secret": "your_secret",
  "type": "all"
}'
```

## Automation

### Airtable Webhooks (Future Enhancement)

You can set up Airtable webhooks to automatically trigger revalidation when data changes:

1. Create a webhook in Airtable that calls your revalidation endpoint
2. Configure it to trigger on record updates in your Crews table
3. Include the crew ID in the webhook payload to revalidate specific pages

### Zapier/Make Integration

Use Zapier or Make.com to create automation workflows:

1. **Trigger**: Airtable record updated
2. **Action**: HTTP POST to your revalidation endpoint
3. **Data**: Include crew ID and revalidation secret

## Security Considerations

1. **Keep secrets secure**: Never commit secrets to version control
2. **Use environment-specific secrets**: Different secrets for dev/staging/production
3. **Limit access**: The admin panel should be protected in production
4. **Monitor usage**: Log revalidation requests to detect abuse
5. **Rate limiting**: Consider adding rate limiting to prevent excessive revalidation

## Troubleshooting

### Common Issues

**401 Unauthorized**
- Check that your `REVALIDATION_SECRET` environment variable is set
- Verify you're using the correct secret in your request

**400 Bad Request**
- Ensure you're sending the correct `type` parameter
- For `crew` and `custom` types, include the `paths` array
- Check that paths start with `/`

**500 Internal Server Error**
- Check server logs for specific error details
- Verify that the paths you're trying to revalidate exist
- Ensure your Next.js app has the necessary permissions

### Debugging

Enable debug logging by checking the server console when making revalidation requests. The API will log:
- Successful revalidations
- Failed revalidations with error details
- Invalid requests

## Performance Notes

- Revalidation is not instantaneous - it may take a few seconds to complete
- Avoid excessive revalidation as it can impact server performance
- Consider batching multiple changes before triggering revalidation
- The first request after revalidation may be slower as the page regenerates

## Files Created

- `/pages/api/revalidate.ts` - Main revalidation API endpoint
- `/lib/revalidation.ts` - Client-side utility functions and React hook
- `/components/Admin/RevalidationPanel.tsx` - Admin UI component
- `/pages/admin/revalidation.tsx` - Admin page for manual revalidation
- `/docs/ON_DEMAND_REVALIDATION.md` - This documentation file

## Next Steps

1. Set up your `REVALIDATION_SECRET` environment variable
2. Test the revalidation functionality using the admin panel
3. Consider setting up automated workflows with Airtable webhooks
4. Add authentication to the admin panel for production use
5. Monitor revalidation usage and performance