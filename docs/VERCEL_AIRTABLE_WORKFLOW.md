# Vercel + Airtable Workflow: Complete Setup Guide

## Overview

This guide explains how to set up a complete workflow where:
1. **Airtable** stores all crew data AND image files
2. **Vercel** hosts the Next.js application
3. **Automated sync** keeps everything in sync

## 🏗️ Architecture Options

### Option 1: Airtable as Single Source of Truth (Recommended)
```
Airtable (Data + Images) → Vercel (Next.js App) → Users
```

### Option 2: Hybrid Approach (Current Implementation)
```
Airtable (Data) + Vercel (Images) → Next.js App → Users
```

## 🚀 Option 1: Complete Airtable Integration

### Step 1: Airtable Setup

#### A. Update Airtable Base Structure
```
Crews Table:
├── CrewName (Single line text)
├── City (Single line text)
├── Country (Single line text)
├── Logo (Attachment) ← NEW: Upload logo files here
├── CrewPhotos (Attachment) ← NEW: Upload crew photos here
├── ... (other existing fields)
```

#### B. Upload Images to Airtable
1. **Bulk Upload Process**:
   - Open your Airtable base
   - For each crew record:
     - Click the "Logo" attachment field
     - Upload the corresponding logo file
     - Repeat for crew photos

2. **Airtable Attachment URLs**:
   - Airtable generates secure, CDN-backed URLs
   - URLs are automatically optimized
   - No storage limits for Pro/Enterprise plans

### Step 2: Update Code for Airtable Attachments

#### A. Update Airtable Interface
```typescript
// lib/airtable.ts
interface AirtableCrewFields {
  CrewName: string;
  City: string;
  Country: string;
  Logo: Array<{
    id: string;
    url: string;
    filename: string;
    size: number;
    type: string;
  }>; // Airtable attachment field
  CrewPhotos: Array<{
    id: string;
    url: string;
    filename: string;
    size: number;
    type: string;
  }>; // Airtable attachment field
  // ... other fields
}
```

#### B. Update Transform Function
```typescript
// lib/airtable.ts
function transformCrewRecord(record: AirtableRecord<AirtableCrewFields>): Crew {
  const fields = record.fields;
  
  return {
    CrewID: parseInt(record.id.replace('rec', ''), 36),
    CrewName: fields.CrewName,
    City: fields.City,
    Country: fields.Country,
    // Use Airtable attachment URL directly
    PrimaryImageUrl: fields.Logo?.[0]?.url || '/images/default-crew-logo.jpg',
    CrewPhotos: fields.CrewPhotos?.map(photo => photo.url) || [],
    // ... other fields
  };
}
```

### Step 3: Vercel Deployment Setup

#### A. Install Vercel CLI
```bash
npm install -g vercel
```

#### B. Project Configuration
```bash
# In your project root
vercel login
vercel init
```

#### C. Environment Variables Setup
```bash
# Set environment variables in Vercel
vercel env add NEXT_PUBLIC_AIRTABLE_PERSONAL_ACCESS_TOKEN
vercel env add NEXT_PUBLIC_AIRTABLE_BASE_ID
```

#### D. Vercel Configuration File
```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "pages/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/images/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Step 4: Automated Deployment

#### A. GitHub Integration
1. **Connect Repository**:
   ```bash
   # Push to GitHub
   git add .
   git commit -m "Setup Vercel deployment"
   git push origin main
   ```

2. **Vercel GitHub Integration**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel automatically deploys on every push

#### B. Automatic Deployments
```yaml
# .github/workflows/deploy.yml (optional)
name: Deploy to Vercel
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🔄 Option 2: Hybrid Workflow (Current + Vercel)

### Step 1: Keep Current Local Images
- Images stay in `public/images/crew/logos/`
- Vercel serves them as static assets
- No code changes needed

### Step 2: Vercel Static Asset Optimization
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['dl.airtable.com'], // Allow Airtable CDN
    formats: ['image/webp', 'image/avif'],
  },
  // Optimize static assets
  compress: true,
  poweredByHeader: false,
};
```

### Step 3: Image Component Optimization
```tsx
// components/Crew/CrewCard.tsx
import Image from 'next/image';

function CrewCard({ crew }: { crew: Crew }) {
  return (
    <div className="crew-card">
      <Image
        src={crew.PrimaryImageUrl}
        alt={`${crew.CrewName} logo`}
        width={200}
        height={200}
        priority={false}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      />
      <h3>{crew.CrewName}</h3>
      <p>{crew.City}, {crew.Country}</p>
    </div>
  );
}
```

## 📦 Complete Vercel Setup Commands

### 1. Initial Setup
```bash
# Install dependencies
npm install

# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Initialize project
vercel
```

### 2. Environment Variables
```bash
# Add environment variables
vercel env add NEXT_PUBLIC_AIRTABLE_PERSONAL_ACCESS_TOKEN production
vercel env add NEXT_PUBLIC_AIRTABLE_BASE_ID production

# For development
vercel env add NEXT_PUBLIC_AIRTABLE_PERSONAL_ACCESS_TOKEN development
vercel env add NEXT_PUBLIC_AIRTABLE_BASE_ID development
```

### 3. Deploy
```bash
# Deploy to production
vercel --prod

# Or push to GitHub (auto-deploy)
git push origin main
```

## 🔧 Required Code Implementation

### 1. Update Package.json
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "deploy": "vercel --prod",
    "deploy-preview": "vercel"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "sharp": "^0.32.0"
  }
}
```

### 2. Vercel-Optimized API Routes
```typescript
// pages/api/crews/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllCrews } from '../../../lib/airtable';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Enable CORS for Vercel
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  // Cache for 5 minutes
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
  
  try {
    const crews = await getAllCrews();
    res.status(200).json(crews);
  } catch (error) {
    console.error('Error fetching crews:', error);
    res.status(500).json({ error: 'Failed to fetch crews' });
  }
}
```

### 3. Image Optimization Hook
```typescript
// lib/hooks/useOptimizedImage.ts
import { useState, useEffect } from 'react';

export function useOptimizedImage(src: string, fallback: string) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setIsLoading(false);
      setHasError(false);
    };
    img.onerror = () => {
      setImageSrc(fallback);
      setIsLoading(false);
      setHasError(true);
    };
    img.src = src;
  }, [src, fallback]);

  return { imageSrc, isLoading, hasError };
}
```

## 🎯 Recommended Workflow

### Phase 1: Quick Vercel Deployment (Current State)
1. Keep current local images
2. Deploy to Vercel with existing code
3. Set up environment variables
4. Test production deployment

### Phase 2: Airtable Image Integration
1. Upload images to Airtable attachments
2. Update code to use Airtable URLs
3. Remove local image files
4. Deploy updated version

### Phase 3: Optimization
1. Implement Next.js Image component
2. Add image caching strategies
3. Set up automatic deployments
4. Monitor performance

## 🚀 Benefits of Vercel + Airtable

1. **Automatic Scaling**: Vercel handles traffic spikes
2. **Global CDN**: Fast image delivery worldwide
3. **Zero Configuration**: No server management
4. **Automatic HTTPS**: SSL certificates included
5. **Preview Deployments**: Test changes before production
6. **Analytics**: Built-in performance monitoring
7. **Edge Functions**: Fast API responses

## 📋 Next Steps Checklist

- [ ] Choose workflow (Option 1 or 2)
- [ ] Set up Vercel account
- [ ] Configure environment variables
- [ ] Deploy initial version
- [ ] Test production deployment
- [ ] Set up automatic deployments
- [ ] Optimize images (if needed)
- [ ] Monitor performance

This setup gives you a production-ready, scalable platform for your running crews directory!