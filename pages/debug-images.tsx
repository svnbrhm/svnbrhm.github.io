import { GetStaticProps, NextPage } from 'next';
import { useState } from 'react';
import airtableService from '../lib/airtable';
import { Crew } from '../types/crew';

interface DebugImagesProps {
  crews: Crew[];
}

const DebugImages: NextPage<DebugImagesProps> = ({ crews }) => {
  const [selectedCrew, setSelectedCrew] = useState<Crew | null>(null);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Debug Images Page</h1>
      <p>Total crews loaded: {crews.length}</p>
      
      <h2>Crew Selection</h2>
      <select 
        onChange={(e) => {
          const crew = crews.find(c => c.id === e.target.value);
          setSelectedCrew(crew || null);
        }}
        value={selectedCrew?.id || ''}
      >
        <option value="">Select a crew...</option>
        {crews.map(crew => (
          <option key={crew.id} value={crew.id}>
            {crew.CrewName} ({crew.City}, {crew.Country})
          </option>
        ))}
      </select>

      {selectedCrew && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '15px' }}>
          <h3>Crew Details: {selectedCrew.CrewName}</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <h4>Image URLs:</h4>
            <p><strong>logoUrl:</strong> {selectedCrew.logoUrl || 'undefined'}</p>
            <p><strong>heroImageUrl:</strong> {selectedCrew.heroImageUrl || 'undefined'}</p>
            <p><strong>PrimaryImageUrl:</strong> {selectedCrew.PrimaryImageUrl || 'undefined'}</p>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <h4>Media Data:</h4>
            <p><strong>Media count:</strong> {selectedCrew.media?.length || 0}</p>
            {selectedCrew.media && selectedCrew.media.length > 0 && (
              <div>
                {selectedCrew.media.map((media, index) => (
                  <div key={index} style={{ marginLeft: '20px', marginBottom: '10px', border: '1px solid #eee', padding: '10px' }}>
                    <p><strong>Title:</strong> {media.MediaTitle}</p>
                    <p><strong>Type:</strong> {media.MediaType}</p>
                    <p><strong>Status:</strong> {media.Status}</p>
                    <p><strong>FileURL:</strong> {media.FileURL || 'undefined'}</p>
                    <p><strong>MediaFile:</strong> {media.MediaFile ? JSON.stringify(media.MediaFile, null, 2) : 'undefined'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <h4>Image Preview:</h4>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div>
                <p><strong>Logo:</strong></p>
                <img 
                  src={selectedCrew.logoUrl} 
                  alt="Logo" 
                  style={{ width: '100px', height: '100px', objectFit: 'contain', border: '1px solid #ccc' }}
                  onError={(e) => {
                    console.error('Logo failed to load:', selectedCrew.logoUrl);
                    e.currentTarget.style.border = '2px solid red';
                  }}
                  onLoad={() => {
                    console.log('Logo loaded successfully:', selectedCrew.logoUrl);
                  }}
                />
              </div>
              <div>
                <p><strong>Hero Image:</strong></p>
                <img 
                  src={selectedCrew.heroImageUrl} 
                  alt="Hero" 
                  style={{ width: '100px', height: '100px', objectFit: 'cover', border: '1px solid #ccc' }}
                  onError={(e) => {
                    console.error('Hero image failed to load:', selectedCrew.heroImageUrl);
                    e.currentTarget.style.border = '2px solid red';
                  }}
                  onLoad={() => {
                    console.log('Hero image loaded successfully:', selectedCrew.heroImageUrl);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: '30px' }}>
        <h2>All Crews Summary</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Crew Name</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Logo URL</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Hero URL</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Media Count</th>
            </tr>
          </thead>
          <tbody>
            {crews.slice(0, 20).map(crew => (
              <tr key={crew.id}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{crew.CrewName}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px', fontSize: '12px' }}>
                  {crew.logoUrl?.substring(0, 50)}{crew.logoUrl && crew.logoUrl.length > 50 ? '...' : ''}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px', fontSize: '12px' }}>
                  {crew.heroImageUrl?.substring(0, 50)}{crew.heroImageUrl && crew.heroImageUrl.length > 50 ? '...' : ''}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{crew.media?.length || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<DebugImagesProps> = async () => {
  try {
    console.log('=== DEBUG PAGE: Fetching crews with media ===');
    const crews = await airtableService.getAllCrewsWithMedia();
    console.log(`=== DEBUG PAGE: Fetched ${crews.length} crews ===`);
    
    // Log first few crews for debugging
    crews.slice(0, 3).forEach(crew => {
      console.log(`DEBUG: ${crew.CrewName} - logoUrl: ${crew.logoUrl}, heroImageUrl: ${crew.heroImageUrl}, media count: ${crew.media?.length || 0}`);
    });
    
    return {
      props: {
        crews,
      },
      revalidate: 60, // Revalidate every minute for debugging
    };
  } catch (error) {
    console.error('DEBUG PAGE: Error fetching crews:', error);
    return {
      props: {
        crews: [],
      },
      revalidate: 60,
    };
  }
};

export default DebugImages;