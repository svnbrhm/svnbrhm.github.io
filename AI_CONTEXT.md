# AI Context Documentation

## Project Overview

**RunningCrews.com** is a Next.js-based website that connects running enthusiasts with local running crews worldwide. The project uses Airtable as a headless CMS and implements Incremental Static Regeneration (ISR) for optimal performance.

### Key Features
- **Running Crew Discovery:** Browse and search local running crews with detailed profiles
- **Event Management:** Comprehensive event listings (marathons, local runs, crew events)
- **Blog System:** Community-driven content with crew stories and running tips
- **Route Sharing:** Discover and share running routes with GPX data support
- **Community Submissions:** User-generated content with moderation system
- **Global Search:** Advanced search across crews, events, blog posts, and routes
- **Responsive Design:** Mobile-first approach with optimized user experience
- **Performance:** ISR implementation for fast loading and SEO optimization

### Project Phases
- **Phase 1 (In Progress):** Core functionality with airtable data (Homepage, Crew pages, standard pages)
- **Phase 2:** Community features (submissions, user accounts, advanced search)
- **Phase 3:** Advanced features (GPX integration, mobile app, analytics)

**Technology Stack:** Next.js, TypeScript, Tailwind CSS, Airtable  
**Last Updated:** June 24, 2025

## Technology Stack

### Frontend
- **Framework:** Next.js 13+ with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS with component-specific CSS files
- **Components:** Modular React components with dedicated CSS files
- **Image Optimization:** Next.js Image component with responsive loading
- **Performance:** ISR for optimal loading and SEO

### Backend & Data
- **CMS:** Airtable (headless) - **NO MOCK DATA USED**
- **Media Storage:** Public folder (to minimize Airtable API calls)
- **API:** Airtable REST API
- **Caching:** ISR (Incremental Static Regeneration)
- **Deployment:** Vercel (recommended)
- **Data Model:** 7 main tables (Crews, TeamMembers, RunSchedules, CrewMedia, RunningEvents, RunningRoutes, Blog)

### CSS Architecture
- **Modular Structure:** One CSS file per component to prevent global.css bloat
- **Global Styles:** Minimal globals.css with only essential base styles, variables, and Tailwind directives
- **Component-Specific:** Dedicated CSS files (header.css, footer.css, cards.css, etc.) imported into globals.css
- **Import Strategy:** All component CSS files imported into globals.css for centralized management
- **Methodology:** BEM naming convention
- **Responsive:** Mobile-first approach
- **Performance:** Prevents global.css from becoming unwieldy by separating concerns

## MCP (Model Context Protocol) Configuration

The project utilizes several MCP servers to enhance development capabilities:

### Installed MCP Servers
1. **GitHub MCP** - Repository management, file operations, issue tracking, pull requests
2. **Context7 MCP** - Library documentation and package resolution
3. **Airtable Server MCP** - Direct Airtable operations and data management
4. **Sequential Thinking MCP** - Enhanced problem-solving and analysis
5. **Multi Fetch MCP** - Multiple data source fetching capabilities
6. **Docker MCP** - Container management and deployment
7. **Memory MCP** - Persistent memory and context retention
8. **Google Maps MCP** - Location services and mapping functionality
9. **Puppeteer MCP** - Web scraping and automated testing

### Key MCP Capabilities
- **GitHub Integration:** Direct repository operations, issue management, pull request handling
- **Airtable Operations:** Enhanced database management beyond standard API calls
- **Documentation Access:** Real-time library documentation through Context7
- **Memory Persistence:** Context retention across sessions for better project continuity
- **Location Services:** Google Maps integration for crew location features
- **Testing Automation:** Puppeteer for end-to-end testing and web scraping

### Usage Guidelines
- MCPs provide enhanced capabilities beyond standard tools
- Memory MCP maintains project context across development sessions
- GitHub MCP enables direct repository management
- Airtable MCP offers advanced database operations

## Key Project Information

### Airtable Integration
- **Status:** Configured and operational
- **Configuration File:** `.env.local` (contains Airtable API credentials)
- **Main Integration File:** `/lib/airtable.ts`
- **Key Functions:**
  - `getCrewsWithImages()` - Fetches crews with three-tier image fallback system
  - `getFeaturedCrews()` - Retrieves featured crews for homepage
  - Image optimization with local/Airtable/default fallbacks

#### Access Details
- **Base ID:** [Stored in .env file]
- **API Key:** [Stored in .env file]
- **Tables:** Crews, TeamMembers, RunSchedules, CrewMedia, RunningEvents, RunningRoutes, Blog

#### Airtable Table Reference
| Table Name | Table ID | View ID | URL |
|------------|----------|---------|-----|
| Crews | `tbl76VCXwPoucGZxf` | `viwMNCRmxvy6N8YBD` | https://airtable.com/appmeNztbDlnHVW76/tbl76VCXwPoucGZxf/viwMNCRmxvy6N8YBD |
| TeamMembers | `tbl3bxAbqpwiY3PQm` | `viwVpmEiZgh1X3q14` | https://airtable.com/appmeNztbDlnHVW76/tbl3bxAbqpwiY3PQm/viwVpmEiZgh1X3q14 |
| RunSchedules | `tblWVRZImWj8Wx5L1` | `viwbpbf6dzNpXy6Ug` | https://airtable.com/appmeNztbDlnHVW76/tblWVRZImWj8Wx5L1/viwbpbf6dzNpXy6Ug |
| CrewMedia | `tblZsfIBlCssAzwyZ` | `viw2wWvpwHwdkt0W4` | https://airtable.com/appmeNztbDlnHVW76/tblZsfIBlCssAzwyZ/viw2wWvpwHwdkt0W4 |
| RunningEvents | `tblGpZHOcRt6RFfUK` | `viwGUnokY97jTmRPx` | https://airtable.com/appmeNztbDlnHVW76/tblGpZHOcRt6RFfUK/viwGUnokY97jTmRPx |
| RunningRoutes | `tbl605OnaGj8t0gCd` | `viwvXWpretmoj6g62` | https://airtable.com/appmeNztbDlnHVW76/tbl605OnaGj8t0gCd/viwvXWpretmoj6g62 |
| Blog | `tblCjQYcLlC3cNB1E` | `viw1dKlveplpZY5VJ` | https://airtable.com/appmeNztbDlnHVW76/tblCjQYcLlC3cNB1E/viw1dKlveplpZY5VJ |

#### Data Model (7 Airtable Tables)
**Base ID**: `appmeNztbDlnHVW76`

- **`Crews`** (Table ID: `tbl76VCXwPoucGZxf`): Main table for all running crews with master data, contact info, story
- **`TeamMembers`** (Table ID: `tbl3bxAbqpwiY3PQm`): Profiles of founders, captains, and coaches linked to crews
- **`RunSchedules`** (Table ID: `tblWVRZImWj8Wx5L1`): Recurring run schedules for crews (day, time, location)
- **`CrewMedia`** (Table ID: `tblZsfIBlCssAzwyZ`): Media library for logos, crew pictures, and videos
- **`RunningEvents`** (Table ID: `tblGpZHOcRt6RFfUK`): Database of events hosted or attended by crews
- **`RunningRoutes`** (Table ID: `tbl605OnaGj8t0gCd`): Collection of running routes with distance, GPX data, descriptions
- **`Blog`** (Table ID: `tblCjQYcLlC3cNB1E`): Blog articles with content, images, and links to crews/events/routes
- **`CrewSubmissions`:** Backend-only table for community submissions (Phase 2)

#### Data Flow
1. **Airtable serves as the primary data source (NO MOCK DATA)**
2. All crew, location, and submission data comes from Airtable
3. **Media files stored in public folder** to reduce API calls
4. Airtable API calls made during build time and via ISR
5. Data transformed into appropriate formats
6. Pages statically generated with the transformed data
7. ISR used for data updates without full rebuilds
8. **Exception:** Routes, Events, and Blog articles may use alternative data sources

### Page Structure & Logic

#### Landing Page (Homepage)
- **Structure:** Main navigation → Hero section → Content sections (Crews, Blog, Events, Routes) → Footer
- **Content Sections Logic:** Each section displays a single, horizontally scrollable row of cards
- **Card Loading:** Each row contains exactly 12 randomly selected cards from corresponding overview page
- **Call-to-Action Card:** 13th item is a CTA card linking to respective overview page
- **Layout Behavior:** Rows never wrap, always single line, scrollable left-to-right

#### Overview Pages (Crews, Events, Blog, Routes)
- **Structure:** Navigation → Hero with section-specific search → Card Grid → Load More Button → Footer
- **Card Grid Logic:** Initially displays responsive grid with 3 visible rows of randomly generated cards
- **Responsive Cards:** Number per row adapts to screen size (4 desktop, 2 tablet, 1 mobile)
- **Loading More:** "Load More" button + swipe up gesture on mobile

#### Detail Pages
- Individual item pages for crews, events, blog posts, and routes

#### Standard Pages
- **Legal Notice/Imprint (`/imprint`):** Static legal compliance page
- **Contact (`/contact`):** Contact form page
- **Crew Submission (`/submit-crew`):** Community submission form (Phase 2)

### Card Components (Reusable Elements)

#### Design Principles
- **Image with Gradient Overlay:** Header image with theme-specific color gradient
- **Text Position:** Title on image, additional info below
- **Badges:** Key metadata in small button-like badges with white text (#f8f9fa) and 3D effect
- **Interaction:** Entire card clickable, leads to detail page
- **Fixed Aspect Ratio:** Consistent sizing for desktop
- **Visual Consistency:** Uniform structure across all card types

### Image System
- **Local Images:** `/public/images/crew/`
- **Fallback System:** Local → Airtable → Default backup
- **Default Images:** `default-crew-hero.jpg`, `default-crew-hero.svg`
- **Optimization:** Handled by `imageUtils.ts` and `randomImageUtils.ts`

## Current Project Status

### Implemented Features
- ✅ **Homepage Structure:** Basic layout with hero section and content sections
- ✅ **Featured Running Crews Section:** Functional with proper imports and ISR
- ✅ **Image Optimization System:** Next.js Image component with fallback handling
- ✅ **Airtable Integration:** Basic connection and data fetching setup
- ✅ **TypeScript Configuration:** Proper typing for components and data
- ✅ **CSS Architecture:** Modular component-specific CSS files

### Recently Resolved Issues

#### Featured Running Crews Section Fix (June 24, 2025)
- **Problem:** Missing React imports causing compilation errors
- **Root Cause:** Missing `NextPage` and `GetStaticProps` imports in `/pages/index.tsx`
- **Solution:** Added proper imports and resolved duplicate Hero import
- **Files Modified:** `/pages/index.tsx`
- **Status:** ✅ Resolved

#### React Import Duplication (June 24, 2025)
- **Problem:** Duplicate import statement for Hero component
- **Solution:** Removed duplicate import line
- **Files Modified:** `/pages/index.tsx`
- **Status:** ✅ Resolved

## Current Open Issues

### 1. Crews Page Displaying Incomplete Crew Cards
**Status:** Open  
**Priority:** Medium  
**Description:** Some crew cards on `/crews` page show incomplete information

### 2. Global Impact Section Missing
**Status:** Open  
**Priority:** Low  
**Description:** Homepage missing global impact statistics section

## Development Workflow

### Data Management Guidelines
- **NO MOCK DATA:** All data comes from Airtable (except routes, events, blog articles)
- **Media Strategy:** Store all media files in public folder to minimize Airtable API calls
- **Airtable Integration:** Use table IDs instead of table names in API calls
  - Base ID: `appmeNztbDlnHVW76`
  - Use specific table IDs (e.g., `tbl76VCXwPoucGZxf` for Crews)
- **Performance:** Optimize API calls and leverage local media storage

### Development Guidelines (from project.md)
1. **Understand & Structure:** Fully understand requirements, structure tasks, ask clarifying questions
2. **Working Basis:** Start with Airtable data, English-only, focus on prioritized pages
3. **Code Quality:** Adhere to modularity and clean code structure principles
4. **Project Logging:** Maintain project log in status.md after each work session
5. **No Code:** Do NOT start coding until ambiguities are resolved and approval is given
6. **Implementation:** Develop according to phases and specifications

### CSS Development Guidelines
- **One component, one CSS file:** Each React component has corresponding CSS file to keep globals.css minimal
- **Import into globals.css:** All component CSS files are imported into globals.css for centralized management
- **No cross-component dependencies:** Components should not depend on other component styles
- **Consistent naming:** Use BEM methodology for class naming
- **Mobile-first:** Write responsive styles mobile-first within each component
- **Performance:** Keep selectors simple, avoid deep nesting, prevent globals.css bloat
- **Separation of concerns:** Component-specific styles stay in dedicated files, not in globals.css

### Common Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm test             # Run tests
```

### Key Files to Check When Debugging
1. `.env.local` - Airtable configuration
2. `/lib/airtable.ts` - Data fetching logic
3. `/pages/index.tsx` - Homepage implementation
4. `/components/Crew/` - Crew-related components
5. `BUGREPORT.md` - Current issues tracking
6. `status.md` - Project status and progress

## Memory Optimization Guidelines

### For AI Assistants
1. **Always check these files first:**
   - `AI_CONTEXT.md` (this file)
   - `BUGREPORT.md` for current issues
   - `status.md` for project status

2. **Before making changes:**
   - Verify Airtable configuration in `.env.local`
   - Check existing implementations in `/lib/airtable.ts`
   - Review component structure in `/components/`

3. **When encountering issues:**
   - Check if similar issues were resolved (see "Recently Resolved Issues")
   - Verify imports and dependencies
   - Test with development server (`npm run dev`)

### Communication Protocol
- **Solvable Issues:** Proceed with implementation and document in `BUGREPORT.md`
- **Unsolvable Issues:** Clearly state limitations and suggest alternative approaches
- **Missing Context:** Request specific files or information needed

## Technical Architecture Notes

### Data Flow
1. Airtable API → `/lib/airtable.ts` → Components → Pages
2. Image loading: Local check → Airtable fetch → Default fallback
3. ISR: Static generation with revalidation for dynamic content

### Error Handling
- Global error boundaries in place
- Graceful fallbacks for missing data
- Mock data available when Airtable unavailable

### Performance Optimizations
- Image optimization with Next.js Image component
- ISR for crew data
- Lazy loading for non-critical components

---

**Note:** This document should be updated whenever significant changes are made to the project structure, resolved issues, or new patterns are established.