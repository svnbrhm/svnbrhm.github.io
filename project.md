# Requirements Specification: Rebuild of www.runningcrews.com

# RunningCrews.com - Project Documentation

**Version:** 1.9
**Date:** June 25, 2025
**Project Owner:** Sven

## Recent Updates (Version 1.9 - June 25, 2025)

### UI/UX Improvements
- **Statistics Section Enhancement**: Centered "Global Impact" heading and removed grey gradient background
- **CSS Modernization**: Replaced Tailwind utility classes with semantic CSS classes for better maintainability
- **Visual Design**: Cleaner, more professional appearance with transparent background
- **Code Quality**: Improved component structure while preserving all animations and functionality

### CSS Architecture Improvements (11:02)
- **WorldMap Component Modularization**: Extracted map-related styles from `globals.css` into dedicated `styles/components/map.css`
- **Architectural Consistency**: Followed established modular CSS pattern used by other components
- **Files Modified**: `styles/globals.css`, `styles/components/map.css`
- **Styles Reorganized**: `#map`, `.map-section`, `.map-view-container` and responsive variants
- **Maintainability**: Improved code organization and reduced global CSS bloat
- **Visual Enhancement**: Added shadow effect to map component matching crew cards styling

## Previous Updates (Version 1.8 - June 25, 2025)

### Critical Bug Fixes
- **Statistics Discrepancy Resolution**: Resolved 18-city discrepancy between manual (188) and automated (170) counts
- **Environment Variable Standardization**: Unified all files to use `AIRTABLE_PERSONAL_ACCESS_TOKEN` consistently
- **Data Accuracy**: Statistics now accurately reflect global crew reach with verified counts
- **Performance Optimization**: Improved Airtable API efficiency and reduced N+1 query problems

### Technical Improvements
- **Verification Scripts**: Added comprehensive test scripts for statistics validation
- **Documentation Updates**: Enhanced all brain files with latest bug fixes and resolutions
- **Security Enhancements**: Standardized environment variable naming and removed deprecated references
- **Mock Data Accuracy**: Updated fallback data to reflect real statistics (188 cities, 60 countries)

---

## 1.0 Project Overview

### 1.1 Purpose of this Document
This document serves as the central requirements specification for the AI-assisted development of the website `www.runningcrews.com`. It describes all functional and non-functional requirements, the technical architecture, the design, and the data structure. The AI (Claude) is to use this document as the single, comprehensive source of truth for the entire project duration.

### 1.2 Project Goal
The goal is to develop a modern, high-performance, and user-friendly JAMstack website that serves as a global database and community platform for running crews. The website will replace the existing platform and be built on a future-proof, cost-effective tech stack.

### 1.3 Core Vision & Story
The `runningcrews.com` platform is more than just a database; it is a tribute to the global "running family." Inspired by the founder's personal experiences of finding connection and hospitality through running crews while traveling the world, the website aims to convey this feeling of community and belonging. The mission is to give runners worldwide a platform to connect, discover crews, and experience the feeling of having friends who share the same passion, no matter where they are. This ethos—global, connected, familiar, and urban—should be reflected in every aspect of the design and functionality.

---

## 2.0 Functional Requirements

### 2.1 Target Groups & Roles
* **Admin (Sven):** Full control over all content and users. Backend access for managing the entire platform.
* **Captain:** Limited editing rights. Can edit their own crew's profile page (functionality planned for Phase 2).
* **Public User:** Can browse and view all content but has no editing rights.

### 2.2 Core Features
* **Searchable Crew Database:** Search by crew name, continent, country, and city.
* **Global Interactive Map:** Visual representation of all crews with location pins and photos.
* **Global Search:** A central search bar in the main navigation that searches across all main content types (Crews, Events, Routes, Blog).
* **Admin Backend:** An interface for the admin to manage all data.
* **Content Pages:** Blog articles, event pages, and running routes (each with overview and detail pages).
* **Phased Multi-language Support:** The architecture will be built to support multiple languages, but the initial launch will be in **English only**. Other languages will be added in a later phase.
* **Analytics:** Basic traffic analysis to measure success.

### 2.3 Development Phases & Approach

#### 2.3.1 Development Focus & Prioritization
The project will be implemented in logical steps to achieve visible results early on.

* **Initial Focus (Page Implementation):** Development will first concentrate on the core functionality of the crew database.
    1.  Homepage
    2.  Crew Overview Page
    3.  Crew Detail Page
* **Secondary Focus:** After the core is complete, the other content sections will be implemented. The architecture must be designed from the start to seamlessly integrate these sections later.
    1.  Blog (Overview & Detail Page)
    2.  Routes (Overview & Detail Page)
    3.  Events (Overview & Detail Page)

#### 2.3.2 Working with Mock Data
Development will begin with **mock data (placeholder data)**, as the Airtable database is still being populated in parallel. This mock data must **perfectly mirror the structure of the final Airtable tables**. This ensures that the switch from mock data to the live Airtable API can be done later with minimal effort.

#### 2.3.3 Feature Roadmap
* **Phase 1 (Initial Launch):**
    * Focus on the read-only experience in **English** with the prioritized pages (Homepage, Crew Overview/Detail).
    * Implementation of the static pages: **Legal Notice/Imprint** and **Contact Page** (including form functionality).
    * All data will be read from mock data (and later, Airtable).
    * No write access for Captains or Admins via the frontend.
    * Implementation of affiliate marketing and Google AdWords.

* **Phase 2 (Community Interactivity & Write Access):**
    * Implementation of user authentication for Captains.
    * Development of forms allowing **Captains** to edit their own crew profiles.
    * Development of a public page with a form allowing anyone to submit a new crew for inclusion in the database. The submitted data will land in the `CrewSubmissions` table in Airtable for moderation.
    * Data updates will be processed via Next.js API routes.

* **Phase 3 (E-commerce):**
    * Integration of an e-commerce solution (e.g., Snipcart) for selling products.

* **Phase 4 (Internationalization):**
    * Implementation of additional languages (e.g., German, Spanish) based on the established multi-language architecture.
    * Expansion of the Airtable data model to include dedicated fields for each language.

### 2.4 Monetization
Monetization will be implemented step-by-step and includes the following channels:
1.  **Affiliate Marketing & Google AdWords:** Priority for the initial launch.
2.  **E-commerce (Phase 3):** Sale of running shirts and digital products.
3.  **Donations:** An option for users to financially support the project.

### 2.5 Standard & Utility Pages

* **Legal Notice / Imprint:** A static page with all legally required information (according to German law, § 5 TMG). The content will be provided by the project owner (Sven). The page will be linked in the footer.
* **Contact Page:** A dedicated page (`/contact`) instead of a popup to maximize user-friendliness and SEO.
    * **Form Fields:** Name, Email Address, Subject, Message.
    * **Functionality:** Upon form submission, a Next.js API route is called, which sends the content as an email to an admin-specified address. A client-side spam protection method (e.g., honeypot field or reCAPTCHA) should be considered.

---

## 3.0 Non-Functional Requirements

### 3.1 Design Philosophy: "Urban Cool & Dynamic"
The design should reflect the energy of a city and the aesthetic of streetwear. It should be modern, clean, and dynamic, while simultaneously creating a welcoming, community-oriented atmosphere.

* **Fundamentals:** Clean lines, ample white space (off-white `#FAFAFA`), strong typography accents, and targeted color pop-ups.
* **Depth & Texture:** Subtle shadows, gradients, and fine-grained textures (inspired by sportswear or urban art) create visual depth and a premium feel.
* **Movement & Interaction:** The site should feel "alive." Scroll effects, 3D elements, and micro-interactions should support the user flow and reflect the dynamics of running.

### 3.2 UX/UI Requirements

#### 3.2.1 Typography
* **Headings:** Strong, modern sans-serif font (e.g., Montserrat, Oswald, Anton, Poppins) in uppercase for maximum impact (`#2f2f2f`).
* **Body:** A highly legible, modern sans-serif font (e.g., Lato, Open Sans, Roboto).
* **Accent (optional):** A third, "edgy" font for stats or call-outs.

#### 3.2.2 Color Palette
* **Primary:** `#2f2f2f` (Dark Gray) for text and strong contrast.
* **Secondary:** `#5C8147` (Green) for interactive elements and positive accents.
    * Hover/Active: `#4A6B3A`
    * Backgrounds/Selection: `#6D9258`
* **Tertiary:** `#C0342D` (Red) as a "pop color" for important CTAs or notices.
    * Hover/Active: `#A82E28`
    * Backgrounds/Selection: `#D8423B`
* **Background:** `#FAFAFA` (Off-White).
* **Thematic Accent Colors:**
    * **Crew Pages:** Cool blue tones (e.g., `#6A8B9C`, `#9ABCC9`).
    * **Blog Pages:** Warm yellow/orange tones (e.g., `#F7C75C`, `#F29D4E`).
    * **Event Pages:** Metallic orange tones (e.g., `#FF6B3D`, `#E05A2A`).
    * **Route Pages:** Earthy green/brown tones (e.g., `#6B8E23`, `#8B7D6B`).

#### 3.2.3 Animations & Micro-Interactions
All animations must respect the user's `prefers-reduced-motion` setting.
* **Cards:** A slight "lift" effect on hover (`transform: translateY(-2px)`), a subtle scaling on click (`scale(0.98)`).
* **Scroll Effects:** Gentle fading in of elements ("Reveal"), purposeful use of parallax effects (e.g., in the hero section).
* **Sticky Elements:** The header, global search, and filter bars should remain visible during scrolling.
* **Hardware Acceleration:** Use CSS transforms (`transform: translate3d`) to ensure smooth animations.

### 3.3 Technical Requirements
* **Performance:** Mobile-first approach, fast load times (Core Web Vitals), lazy loading for images, and modern image formats (WebP, AVIF).
* **Responsiveness:** Seamless adaptation to all screen sizes, from mobile devices to ultrawide monitors. Touch targets must be at least 48x48px.
* **Accessibility (WCAG 2.2):** High color contrast ratios (min. 4.5:1), support for `prefers-reduced-motion`, semantic HTML, and focus management.
* **SEO:** Clean URL structure, structured data (Schema.org), meta tags, and good internal linking must be planned from the start.

---

## 4.0 Architecture & Tech Stack

### 4.1 Recommended Tech Stack
* **Framework:** **Next.js** (Offers flexibility for static and dynamic pages, optimal for SEO and map integration).
* **Hosting & Deployment:** **Vercel** (The free tier should suffice for the start; perfect integration with Next.js).
* **Domain:** **STRATO** (Used only for domain registration, which will point to Vercel).
* **Data Source (CMS):** **Airtable** (Serves as the primary, user-friendly data source; read-only in Phase 1).
* **Map:** **Leaflet** (Free, open-source, and lightweight).
* **Authentication (for Phase 2):** **Supabase Auth** (Integrated with a database, cost-effective) or alternatively Auth0/Clerk.dev.
* **Database for Write Access (for Phase 2):** **Supabase** (PostgreSQL database for processing Captain updates).
* **Synchronization (for Phase 2):** **Make/Zapier** or a custom Vercel Edge Function to mirror data from Supabase to Airtable.
* **E-commerce (for Phase 3):** **Snipcart** (Lightweight, pay-as-you-go model).
* **Analytics:** **Google Analytics** or **Plausible**.
* **Image Optimization:** Vercel's built-in solution via the `next/image` component.

### 4.2 Data Architecture
* **Initial Data Flow (Phase 1):** The Next.js application fetches all content from the existing single-language fields in the Airtable tables via the Airtable API.

* **Write Access (Phase 2):**
    1.  A Captain logs into the website via Supabase Auth.
    2.  A form on the crew page sends the modified data to a Next.js API route.
    3.  This server-side function securely writes the data to the Supabase database.
    4.  An automated process (e.g., a trigger in Supabase) initiates a synchronization that transfers the new data to the corresponding Airtable table. This ensures that Airtable remains the "single source of truth" for the admin.

* **Multi-language Strategy (Phased):**
    * The initial launch (Phase 1) will be **English-only**. The application will fetch content from the existing single-language fields in Airtable.
    * The architecture, however, will be prepared for future internationalization using Next.js's built-in i18n capabilities.
    * For future language additions (Phase 4), the strategy will be as follows:
        * **Airtable Expansion:** For every field requiring translation (e.g., `CrewStory`, `Title`), new dedicated columns for each language will be created (e.g., `CrewStory_de`, `CrewStory_es`).
        * **Frontend Integration:** The Next.js application will then use the language prefix in the URL (e.g., `/de/crews`) to dynamically fetch content from the corresponding language column.
        * **Static UI texts** (like navigation links or button labels) will be managed using standard Next.js internationalization with JSON files (e.g., `public/locales/en/common.json`, `public/locales/de/common.json`).

### 4.3 Budget Note
The target budget of **€20–30/month** is realistic for Phase 1. With the introduction of Phases 2 and beyond, potential costs for Supabase (depending on usage) and automation services like Make/Zapier must be calculated and monitored.

### 4.4 CSS Code Structure & Modularity
* **Component-Based Architecture:** Every logical UI element (e.g., Header, Footer, CrewCard, FilterBar) will be developed as a self-contained, reusable component with its own markup (JSX), logic (JS/TS), and styling.
* **Modular CSS:** Instead of a single large CSS file, styling will also be encapsulated per component. 
* **CSS Modules** (`*.module.css`) will be used for this. This prevents class name conflicts and keeps the styles directly with their associated component. A `globals.css` file will be used only for fundamental, global styles and CSS variables (e.g., for colors, font sizes).
* **Logical File Structure:** The code will be organized in an understandable folder structure (e.g., `/components`, `/app` or `/pages`, `/lib`, `/styles`) to maximize maintainability and clarity.


#### 4.4.1 File Organization
CSS files are organized in the following structure:
styles/
├── base/
│   ├── variables.css
│   └── typography.css
├── components/
│   ├── header.css
│   ├── footer.css
│   ├── hero.css
│   ├── cards.css
│   ├── buttons.css
│   ├── crew.css
│   └── statistics.css
├── pages/
│   └── crews.css
└── globals.css

#### 4.4.2 Globals.css Philosophy
The `globals.css` file is kept **lean and focused** on:
- **Imports:** Importing all modular CSS files
- **Base Styles:** Essential body, html, and reset styles
- **Global Utilities:** Only truly global utility classes
- **Tailwind Integration:** Tailwind CSS directives

**What NOT to include in globals.css:**
- Component-specific styles (these belong in dedicated component files)
- Page-specific styles (these belong in the pages/ directory)
- Complex layout styles (these belong in component files)

#### 4.4.3 Component-Specific CSS Files

##### 4.4.3.1 Naming Convention
Each component has its own CSS file following the pattern:
- `header.css` for Header component
- `footer.css` for Footer component
- `cards.css` for all card-related components
- `hero.css` for Hero sections

##### 4.4.3.2 Component CSS Structure
Each component CSS file should contain:
1. **Main component styles**
2. **Modifier classes** (e.g., `.header.scrolled`)
3. **Responsive styles** for that component
4. **Component-specific animations/transitions**

#### 4.4.5 Import Strategy
/* globals.css */
@import './base/variables.css';
@import './base/typography.css';
@import './components/header.css';
@import './components/footer.css';
@import './components/hero.css';
@import './components/cards.css';
@import './components/buttons.css';
@import './components/crew.css';
@import './components/statistics.css';
@import './pages/crews.css';

#### 4.4.6 Development Guidelines
- One component, one CSS file: Each React component should have its corresponding CSS file
- No cross-component dependencies: Components should not depend on styles from other component files
- Consistent naming: Use BEM methodology or similar for class naming within components
- Mobile-first: Write responsive styles mobile-first within each component file
- Performance: Keep selectors simple and avoid deep nesting

#### 4.4.7 Benefits
- Maintainability: Easy to locate and modify component-specific styles
- Scalability: New components can be added without affecting existing styles
- Reusability: Components and their styles can be easily reused
- Team Collaboration: Multiple developers can work on different components without conflicts
- Performance: Only necessary styles are loaded

#### 4.4.8 Future Considerations
- CSS-in-JS Migration: The modular structure allows for easy migration to CSS-in-JS solutions if needed
- Design System: The component-based approach facilitates the development of a comprehensive design system
- Automated Testing: Component-specific CSS files enable targeted style testing

---

## 5.0 Page Structure & Descriptions

### 5.1 Page Layouts & Logic
The website consists of the following main pages and subpages, with specific interaction logic.

* **Landing Page (Homepage):**
    * **Structure:** Consists of the main navigation (with the global search), a hero section, followed by content sections for Crews, Blog, Events, and Routes, and finally the footer.
    * **Content Sections Logic:** Each section (Crews, Blog, etc.) displays a **single, horizontally scrollable row of cards**.
    * **Card Loading:** Each row contains exactly **12 randomly selected cards** "mirrored" from the corresponding overview page.
    * **Call-to-Action Card:** The 13th item in each horizontal row is not a content card but a special CTA card. This card will have text like "Click here to see more crews" and will link directly to the respective overview page (e.g., `/crews`).
    * **Layout Behavior:** The rows must never wrap. They are always a single line, scrollable left-to-right.

* **Overview Pages (Crews, Events, Blog, Routes):**
    * **Structure:** Each overview page follows a consistent structure:
        1.  Main Navigation Bar (with Global Search).
        2.  Hero Section: Contains a large image and a search bar **specific to that section** (e.g., the `/crews` page hero has a "Search Crews" function).
        3.  Card Grid Section.
        4.  Load More Button.
        5.  Footer.
    * **Card Grid Logic:**
        * The page initially displays a responsive grid of **randomly generated cards**, arranged in **three visible rows**.
        * The number of cards per row adapts to the screen size (e.g., 4 on desktop, 2 on tablet, 1 on mobile).
    * **Loading More Logic:**
        * A "Load More" button is always present below the grid. Clicking it loads the next set of random cards.
        * On mobile devices, users can **swipe up** from the bottom of the grid as an alternative interaction to load more cards.

* **Detail Pages (Crew, Event, Blog, Route):**
    * These pages display the full content for a single item selected from an overview page or the homepage.

* **Standard Pages:**
    * **Legal Notice / Imprint Page (`/imprint`):** Static page for legal compliance.
    * **Contact Page (`/contact`):** Page with a contact form.
    * **Crew Submission Page (`/submit-crew`):** Page with a form for community submissions (Phase 2).

### 5.2 Card Components (Reusable Elements)

#### 5.2.1 General Design Principles
Cards are the central element for displaying content in lists. They follow a uniform structure and design principle.

* **Image with Gradient Overlay:** Each card has a header image with a theme-specific color gradient to ensure the readability of the overlay text.
* **Text Position:** The title is placed on the image, with further information and teaser text below it.
* **Badges:** Key metadata (date, location) are displayed in small, button-like badges with white text (`#f8f9fa`) and a 3D effect.
* **Interaction:** The entire card is clickable and leads to the corresponding detail page.

#### 5.2.2 Visual & Structural Specification
The cards used across the homepage and overview pages must be visually consistent. The implementation should adhere to the design philosophy and component-based structure outlined in this document, creating a reusable and maintainable card component. Key characteristics include a fixed aspect ratio for desktop, a prominent image header, clear typography, and a distinct call-to-action button.

---

## 6.0 Data Model (Airtable)

Airtable serves as the backend and CMS. The following tables define the data structure.

*(Note: The `CrewSubmissions` table is a backend-only table for data processing and becomes relevant for the public submission form in Phase 2. All submissions will land there for moderation by the admin.)*

* **`Crews`:** The main table for all running crews. Contains master data, contact info, story, and links to other tables.
* **`TeamMembers`:** Profiles of founders, captains, and coaches, linked to their respective crews.
* **`RunSchedules`:** Recurring run schedules for a crew (day, time, location).
* **`CrewMedia`:** A media library for logos, crew pictures, and videos, linked to the respective crew.
* **`RunningEvents`:** A database of events (marathons, local runs, etc.) hosted or attended by crews.
* **`RunningRoutes`:** A collection of running routes with details like distance, GPX data (future), and descriptions.
* **`Blog`:** Contains all blog articles with content, images, and links to crews, events, or routes.

---

## 7.0 Instructions for the AI

* **Role:** You are acting as an expert in Full-Stack Web Development and UX/UI Design, specializing in the JAMstack.
* **Approach:**
    1.  **Understand & Structure:** Your first task is to fully understand this requirements specification, structure the task, and ask clarifying questions. Challenge my ideas and suggest improvements.
    2.  **Working Basis:** Development will start with mock data and will be **English-only**. It will focus on the prioritized pages (Homepage, Crew Overview/Detail) and the standard pages (Imprint, Contact), as described in section 2.3.
    3.  **Code Quality:** Adhere to the principles of modularity and clean code structure outlined in section 4.4.
    4.  **Project Logging:** You are required to maintain a separate project log in a file named `projectstatus.md`. After each work session, you must add an entry detailing: the date, a summary of the work completed, the current project status, and any questions or blockers you have encountered. This ensures a transparent and traceable development process.
    5.  **No Code:** Do NOT start coding until all ambiguities have been resolved and explicit approval has been given.
    6.  **Implementation:** After approval, you will begin developing `runningcrews.com` according to the phases and specifications in this document.

