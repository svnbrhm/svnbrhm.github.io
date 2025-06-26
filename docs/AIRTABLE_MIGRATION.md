# Airtable API Migration Guide

## Important: API Keys Deprecated

As of **February 1st, 2024**, Airtable API keys are deprecated and no longer work. You must migrate to **Personal Access Tokens** for continued API access.

## Migration Steps

### 1. Create a Personal Access Token

1. Go to [Airtable Developer Hub](https://airtable.com/developers/web/api/introduction)
2. Navigate to **Personal Access Tokens**
3. Click **Create new token**
4. Configure your token:
   - **Name**: Give it a descriptive name (e.g., "Running Crews Website")
   - **Scopes**: Select the permissions you need:
     - `data.records:read` - Read records
     - `data.records:write` - Write records (if needed)
     - `schema.bases:read` - Read base schema
   - **Access**: Select the specific base(s) you want to access
5. Click **Create token**
6. **Important**: Copy the token immediately - you won't be able to see it again!

### 2. Update Environment Variables

#### Old Configuration (Deprecated)
```bash
NEXT_PUBLIC_AIRTABLE_API_KEY=keyXXXXXXXXXXXXXX
NEXT_PUBLIC_AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
```

#### New Configuration (Required)
```bash
NEXT_PUBLIC_AIRTABLE_PERSONAL_ACCESS_TOKEN=patXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
```

### 3. Update Your .env File

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your credentials:
   ```bash
   NEXT_PUBLIC_AIRTABLE_PERSONAL_ACCESS_TOKEN=your_actual_token_here
   NEXT_PUBLIC_AIRTABLE_BASE_ID=your_actual_base_id_here
   ```

### 4. Test the Connection

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Visit the test page:
   ```
   http://localhost:3001/test-airtable
   ```

3. Click "Test Airtable Connection" to verify everything works

## Troubleshooting

### 403 Forbidden Error
- **Cause**: Using deprecated API key or insufficient token permissions
- **Solution**: Create a new Personal Access Token with proper scopes

### Token Not Working
- Verify the token has access to your specific base
- Check that required scopes are enabled
- Ensure the token hasn't expired

### Environment Variables Not Loading
- Restart your development server after changing `.env.local`
- Verify variable names match exactly (case-sensitive)
- Check that `.env.local` is in your project root

## Security Best Practices

1. **Never commit tokens to version control**
2. **Use environment variables** for all sensitive data
3. **Rotate tokens regularly** for enhanced security
4. **Use minimal scopes** - only grant permissions you actually need
5. **Monitor token usage** in Airtable's developer dashboard

## Additional Resources

- [Airtable Personal Access Tokens Documentation](https://airtable.com/developers/web/guides/personal-access-tokens)
- [Airtable API Reference](https://airtable.com/developers/web/api/introduction)
- [Migration Guide from Airtable](https://support.airtable.com/docs/airtable-api-key-deprecation)