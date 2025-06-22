# RunningCrews.com

Global running crew database and community hub built with Next.js and Airtable.

## 🏃‍♂️ About

RunningCrews.com serves as a global database for running crews worldwide. Users can search for running crews by location, explore crew profiles, read blog articles about running culture, and discover running routes and events.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Database**: Airtable (read-only)
- **Styling**: CSS Modules with custom design system
- **Maps**: Leaflet for interactive maps
- **Animations**: Framer Motion
- **Deployment**: Vercel
- **SEO**: Next-SEO

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Airtable account with API access

### Installation

1. Clone the repository:
```bash
git clone https://github.com/svnbrhm/codellm_runningcrews.git
cd codellm_runningcrews
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Airtable credentials:
```
AIRTABLE_API_KEY=your_actual_api_key
AIRTABLE_BASE_ID=your_actual_base_id
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI elements
│   ├── layout/         # Layout components
│   ├── crew/           # Crew-specific components
│   ├── blog/           # Blog components
│   ├── events/         # Event components
│   ├── routes/         # Route components
│   └── map/            # Map components
├── lib/                # Utility libraries
│   └── airtable/       # Airtable integration
├── pages/              # Next.js pages
├── styles/             # CSS styles
├── types/              # TypeScript type definitions
├── utils/              # Helper functions
└── public/             # Static assets
```

## 🌍 Features

- **Global Crew Database**: Searchable database of running crews worldwide
- **Interactive Maps**: Leaflet-powered maps showing crew locations
- **Crew Profiles**: Detailed pages for each running crew
- **Blog System**: Articles about running culture, gear, and events
- **Event Listings**: Upcoming running events and races
- **Route Discovery**: Community-curated running routes
- **Mobile-First Design**: Responsive design optimized for all devices
- **SEO Optimized**: Built-in SEO optimization for better discoverability

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

Required environment variables:

- `AIRTABLE_API_KEY` - Your Airtable API key
- `AIRTABLE_BASE_ID` - Your Airtable base ID
- `NEXT_PUBLIC_SITE_URL` - Your site URL (for SEO)

## 📊 Airtable Schema

The application expects the following Airtable tables:

- **Crews** - Main crew information
- **TeamMembers** - Crew captains and members
- **RunSchedules** - Weekly running schedules
- **CrewMedia** - Photos and videos
- **RunningEvents** - Events and races
- **RunningRoutes** - Running routes
- **Blog** - Blog posts and articles

## 🚀 Deployment

The site is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

## 📝 License

This project is private and proprietary.

## 🤝 Contributing

Test: Vercel Integration Fix - [20.06.2025]

This is a private project. For questions or suggestions, contact the development team.
# Updated Wed Jun 18 07:23:57 CEST 2025
# Force deployment Wed Jun 18 09:03:52 CEST 2025
# Force deployment Wed Jun 18 09:05:09 CEST 2025
# Force deployment Wed Jun 18 09:05:34 CEST 2025
# Wed Jun 18 10:05:22 CEST 2025
Environment Variables Fixed - Sun Jun 22 13:34:22 CEST 2025
Build fix: All TypeScript errors resolved - Sun Jun 22 13:44:05 CEST 2025
GitHub Integration Fixed - Sun Jun 22 13:48:43 CEST 2025
Final test: Vercel GitHub App configured - Sun Jun 22 13:54:17 CEST 2025
FINAL TEST: All Vercel settings optimized
