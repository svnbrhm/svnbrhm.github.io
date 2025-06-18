# Image Migration Guide: From External URLs to Local Storage

## Overview

This guide documents the migration of crew logos from external WordPress URLs to local storage in the Next.js application. This improves performance, reliability, and gives you full control over image assets.

## ✅ Completed Steps

### 1. Downloaded Crew Logos
- **Location**: `public/images/crew/logos/`
- **Naming Convention**: `{crew-name}-Logo.{ext}` (e.g., `Amsterdam-Running-Club-Logo.jpeg`)
- **Total Files**: ~400 crew logos
- **Formats**: JPEG, PNG

### 2. Created Image Utility Functions
- **File**: `lib/imageUtils.ts`
- **Functions**:
  - `getLogoFilename()`: Converts crew name to filename format
  - `getCrewLogoPath()`: Returns full path to crew logo
  - `getCrewLogoWithFallback()`: Returns logo path with fallback support
  - `getDefaultCrewLogo()`: Returns default logo path

### 3. Updated Airtable Integration
- **File**: `lib/airtable.ts`
- **Changes**:
  - Added `LocalLogoFilename` field to `AirtableCrewFields` interface
  - Updated `transformCrewRecord()` to use local logos
  - Implemented fallback logic: Airtable field → generated filename → default logo

### 4. Generated Logo Mapping
- **Script**: `scripts/updateAirtableLogos.js`
- **Output**: `scripts/crew-logo-mapping.json`
- **Purpose**: Maps crew names to their corresponding logo files

## 🔄 Next Steps

### Step 1: Update Airtable Base

1. **Add New Field**:
   - Field Name: `LocalLogoFilename`
   - Field Type: Single line text
   - Description: "Filename of the crew's logo stored locally (e.g., Amsterdam-Running-Club-Logo.jpeg)"

2. **Populate Logo Filenames**:
   - Use the generated mapping in `scripts/crew-logo-mapping.json`
   - For each crew, enter the corresponding filename
   - Example: For "Amsterdam Running Club" → enter "Amsterdam-Running-Club-Logo.jpeg"

### Step 2: Test the Integration

1. **Start Development Server**:
   ```bash
   npm run dev
   ```

2. **Test Pages**:
   - Visit `/test-airtable` to verify connection
   - Check crew pages to ensure logos display correctly
   - Verify fallback logic works for crews without `LocalLogoFilename`

### Step 3: Optimize Images (Recommended)

1. **Install Sharp** (for Next.js Image Optimization):
   ```bash
   npm install sharp
   ```

2. **Update Components** to use Next.js Image component:
   ```jsx
   import Image from 'next/image';
   
   // Replace:
   <div style={{ backgroundImage: `url(${crew.PrimaryImageUrl})` }} />
   
   // With:
   <Image 
     src={crew.PrimaryImageUrl} 
     alt={`${crew.CrewName} logo`}
     width={200}
     height={200}
   />
   ```

### Step 4: Handle Missing Logos

1. **Create Default Logo**:
   - Design a generic running crew logo
   - Save as `public/images/crew/logos/default-crew-logo.jpg`

2. **Update Fallback Logic** (already implemented):
   - If `LocalLogoFilename` exists → use it
   - If not → try generated filename
   - If file doesn't exist → use default logo

## 📁 File Structure

```
public/
├── images/
│   ├── crew/
│   │   ├── logos/           # Crew logos (✅ completed)
│   │   │   ├── Amsterdam-Running-Club-Logo.jpeg
│   │   │   ├── Berlin-Track-Club-Logo.png
│   │   │   └── ...
│   │   └── photos/          # Future: crew photos
│   └── default-crew-logo.jpg # Default fallback logo
```

## 🔧 Technical Implementation

### Image Path Resolution Logic

```typescript
// Priority order:
1. fields.LocalLogoFilename (from Airtable)
2. getCrewLogoWithFallback(fields.CrewName) (generated)
3. getDefaultCrewLogo() (fallback)
```

### Filename Generation

```typescript
// "Amsterdam Running Club" becomes:
// "Amsterdam-Running-Club-Logo.jpeg"
function getLogoFilename(crewName: string): string {
  return crewName
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim() + '-Logo';
}
```

## 🚀 Benefits of This Migration

1. **Performance**: Local images load faster than external URLs
2. **Reliability**: No dependency on external WordPress site
3. **Control**: Full control over image optimization and formats
4. **SEO**: Better Core Web Vitals scores
5. **Cost**: No external bandwidth costs
6. **Caching**: Better browser and CDN caching

## 🔍 Troubleshooting

### Logo Not Displaying
1. Check if file exists in `public/images/crew/logos/`
2. Verify filename matches exactly (case-sensitive)
3. Check browser console for 404 errors
4. Ensure `LocalLogoFilename` field is populated in Airtable

### Performance Issues
1. Consider converting large PNG files to JPEG
2. Implement Next.js Image component for automatic optimization
3. Add `loading="lazy"` for images below the fold

## 📋 Checklist

- [x] Download crew logos to local storage
- [x] Create image utility functions
- [x] Update Airtable integration
- [x] Generate crew-logo mapping
- [ ] Add `LocalLogoFilename` field to Airtable
- [ ] Populate logo filenames in Airtable
- [ ] Test integration
- [ ] Create default logo
- [ ] Optimize with Next.js Image component
- [ ] Deploy to production

## 🎯 Future Enhancements

1. **Crew Photos**: Migrate crew running photos using similar approach
2. **Image Optimization**: Implement WebP format with fallbacks
3. **Lazy Loading**: Add intersection observer for better performance
4. **Image Variants**: Create multiple sizes (thumbnail, medium, large)
5. **Admin Interface**: Build UI for uploading/managing crew images

This migration sets the foundation for a robust, performant image management system for your running crews platform.