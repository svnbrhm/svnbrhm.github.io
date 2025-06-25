import React, { useEffect } from 'react';
import { Crew } from '../types/crew';
import WorldMap from '../components/Map/WorldMap';

// Test data with crews that have and don't have headquarter coordinates
const testCrews: Crew[] = [
  {
    id: '1',
    CrewName: 'Test Crew with HQ Coords',
    City: 'Berlin',
    Country: 'Germany',
    HeadquarterLatitude: 52.5200,
    HeadquarterLongitude: 13.4050,
    ApproxMemberCount: 50,
    Featured: false
  },
  {
    id: '2', 
    CrewName: 'Test Crew without HQ Coords',
    City: 'Paris',
    Country: 'France',
    ApproxMemberCount: 30,
    Featured: false
  },
  {
    id: '3',
    CrewName: 'Another Test Crew',
    City: 'London', 
    Country: 'United Kingdom',
    ApproxMemberCount: 75,
    Featured: false
  }
];

const TestMapPage = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Map Geocoding Test</h1>
      <p>This page tests the WorldMap component with geocoding fallback for crews without headquarter coordinates.</p>
      <WorldMap crews={testCrews} />
    </div>
  );
};

export default TestMapPage;