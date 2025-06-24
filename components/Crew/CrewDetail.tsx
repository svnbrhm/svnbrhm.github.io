import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Crew, RunningRoute } from '../../types/crew';
import { getDefaultCrewLogo, getDefaultCrewPicture } from '../../lib/imageUtils';

interface CrewDetailProps {
  crew: Crew;
  otherCrewsInCity?: Crew[];
  relatedRoutes?: RunningRoute[];
}

// Function to format crew story with proper headlines and remove unwanted intro
const formatCrewStory = (story: string): string => {
  if (!story) return '';
  
  // Highlight the founding story instead of removing it
  // More flexible pattern to handle variations in spacing and line breaks
  let formattedStory = story.replace(
    /It was Fall 2015 when Joel and Kevin spent a wild night in a club in St[\s\.]?Gallen,?\s*Switzerland\s*with too many beers[\s\S]*?That night dreams and visions became decisions they never regretted[\s\S]*?Since the idea of a traditional running club was alien to them,?\s*they decided to start their own thing,?\s*that should be a fusion of competition and fun[\s\S]*?\./gi,
    '<div class="founding-story-highlight">$&</div>'
  );
  
  // Handle any similar founding story variations with more flexible matching
  formattedStory = formattedStory.replace(
    /It was [\s\S]*?when [\s\S]*? spent a wild night [\s\S]*?That night dreams and visions became decisions they never regretted[\s\S]*?Since the idea of a traditional running club was alien to them[\s\S]*?they decided to start their own thing[\s\S]*?fusion of competition and fun[\s\S]*?\./gi,
    '<div class="founding-story-highlight">$&</div>'
  );
  
  // Also handle any standalone sentences that might remain
  formattedStory = formattedStory.replace(
    /It was Fall 2015[\s\S]*?fusion of competition and fun\./gi,
    '<div class="founding-story-highlight">$&</div>'
  );
  
  // Format the first line as a main headline (h1)
  formattedStory = formattedStory.replace(
    /^([^\n]+)/,
    '<h1>$1</h1>'
  );
  
  // Format specific sections as subheadlines (h2)
  const subheadlines = [
    'Crew Overview',
    'Introduction', 
    'Philosophy & Founders',
    'Community & Collaboration',
    'Culture & Activities',
    'Invitation',
    'About the City',
    'Routes & Landmarks',
    'Local Crews',
    'Local Races'
  ];
  
  subheadlines.forEach(headline => {
    const regex = new RegExp(`^(${headline})$`, 'gm');
    formattedStory = formattedStory.replace(regex, `<h2>$1</h2>`);
  });
  
  // Format city names as headlines (h1) when they appear on their own line
  formattedStory = formattedStory.replace(
    /^(Zurich|St\. Gallen|Geneva|Basel|Bern|Lausanne)$/gm,
    '<h1>$1</h1>'
  );
  
  // Split into paragraphs and wrap each in <p> tags
  const paragraphs = formattedStory.split(/\n\s*\n/).filter(p => p.trim());
  
  formattedStory = paragraphs.map(paragraph => {
    // Skip if it's already a headline
    if (paragraph.includes('<h1>') || paragraph.includes('<h2>')) {
      return paragraph;
    }
    // Convert single line breaks within paragraphs to spaces
    const cleanParagraph = paragraph.replace(/\n/g, ' ').trim();
    return cleanParagraph ? `<p>${cleanParagraph}</p>` : '';
  }).filter(p => p).join('\n\n');
  
  // Clean up any remaining single line breaks
  formattedStory = formattedStory.replace(/\n/g, '');
  
  return formattedStory;
};

const CrewDetail: React.FC<CrewDetailProps> = ({ crew, otherCrewsInCity, relatedRoutes }) => {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);
  const [showAllSchedules, setShowAllSchedules] = useState(false);
  const [fallbackCoords, setFallbackCoords] = useState<{lat: number, lng: number} | null>(null);

  // Function to get city coordinates as fallback
  const getCityCoordinates = async (city: string, country: string) => {
    // Common city coordinates for major cities worldwide
    const cityCoords: { [key: string]: { lat: number, lng: number } } = {
      // Italy
      'Rome,Italy': { lat: 41.9028, lng: 12.4964 },
      'Milan,Italy': { lat: 45.4642, lng: 9.1900 },
      'Florence,Italy': { lat: 43.7696, lng: 11.2558 },
      'Naples,Italy': { lat: 40.8518, lng: 14.2681 },
      'Turin,Italy': { lat: 45.0703, lng: 7.6869 },
      'Venice,Italy': { lat: 45.4408, lng: 12.3155 },
      'Bologna,Italy': { lat: 44.4949, lng: 11.3426 },
      'Palermo,Italy': { lat: 38.1157, lng: 13.3615 },
      'Genoa,Italy': { lat: 44.4056, lng: 8.9463 },
      'Bari,Italy': { lat: 41.1171, lng: 16.8719 },
      // Switzerland
      'Zurich,Switzerland': { lat: 47.3769, lng: 8.5417 },
      'Geneva,Switzerland': { lat: 46.2044, lng: 6.1432 },
      'Basel,Switzerland': { lat: 47.5596, lng: 7.5886 },
      'Bern,Switzerland': { lat: 46.9481, lng: 7.4474 },
      'Lausanne,Switzerland': { lat: 46.5197, lng: 6.6323 },
      // Germany
      'Berlin,Germany': { lat: 52.5200, lng: 13.4050 },
      'Munich,Germany': { lat: 48.1351, lng: 11.5820 },
      'Hamburg,Germany': { lat: 53.5511, lng: 9.9937 },
      'Frankfurt,Germany': { lat: 50.1109, lng: 8.6821 },
      'Cologne,Germany': { lat: 50.9375, lng: 6.9603 },
      // France
      'Paris,France': { lat: 48.8566, lng: 2.3522 },
      'Lyon,France': { lat: 45.7640, lng: 4.8357 },
      'Marseille,France': { lat: 43.2965, lng: 5.3698 },
      'Nice,France': { lat: 43.7102, lng: 7.2620 },
      // UK
      'London,United Kingdom': { lat: 51.5074, lng: -0.1278 },
      'Manchester,United Kingdom': { lat: 53.4808, lng: -2.2426 },
      'Edinburgh,United Kingdom': { lat: 55.9533, lng: -3.1883 },
      'Birmingham,United Kingdom': { lat: 52.4862, lng: -1.8904 },
      // USA
      'New York City,USA': { lat: 40.7128, lng: -74.0060 },
      'Los Angeles,USA': { lat: 34.0522, lng: -118.2437 },
      'Chicago,USA': { lat: 41.8781, lng: -87.6298 },
      'San Francisco,USA': { lat: 37.7749, lng: -122.4194 },
      'Boston,USA': { lat: 42.3601, lng: -71.0589 },
      // Canada
      'Toronto,Canada': { lat: 43.6532, lng: -79.3832 },
      'Vancouver,Canada': { lat: 49.2827, lng: -123.1207 },
      'Montreal,Canada': { lat: 45.5017, lng: -73.5673 },
      // Australia
      'Sydney,Australia': { lat: -33.8688, lng: 151.2093 },
      'Melbourne,Australia': { lat: -37.8136, lng: 144.9631 },
      'Brisbane,Australia': { lat: -27.4698, lng: 153.0251 },
      // Other major cities
      'Tokyo,Japan': { lat: 35.6762, lng: 139.6503 },
      'Seoul,South Korea': { lat: 37.5665, lng: 126.9780 },
      'Singapore,Singapore': { lat: 1.3521, lng: 103.8198 },
      'Amsterdam,Netherlands': { lat: 52.3676, lng: 4.9041 },
      'Stockholm,Sweden': { lat: 59.3293, lng: 18.0686 },
      'Copenhagen,Denmark': { lat: 55.6761, lng: 12.5683 },
      'Oslo,Norway': { lat: 59.9139, lng: 10.7522 },
      'Helsinki,Finland': { lat: 60.1699, lng: 24.9384 }
    };
    
    const key = `${city},${country}`;
    return cityCoords[key] || null;
  };

  useEffect(() => {
    // If headquarters coordinates are missing, try to get city coordinates
    if ((!crew.HeadquarterLatitude || !crew.HeadquarterLongitude) && crew.City && crew.Country) {
      getCityCoordinates(crew.City, crew.Country).then(coords => {
        if (coords) {
          setFallbackCoords(coords);
        }
      });
    }
  }, [crew.City, crew.Country, crew.HeadquarterLatitude, crew.HeadquarterLongitude]);

  // Initialize Leaflet map
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const initMap = async () => {
      const mapId = `crew-map-${crew.id}`;
      const mapContainer = document.getElementById(mapId);
      
      if (!mapContainer || (mapContainer as any)._leaflet_id) {
        return;
      }

      const lat = crew.HeadquarterLatitude || fallbackCoords?.lat;
      const lng = crew.HeadquarterLongitude || fallbackCoords?.lng;
      
      if (!lat || !lng) return;

      try {
        const L = (await import('leaflet')).default;
        
        // Fix for missing marker icons in Next.js
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: '/marker-icon-2x.png',
          iconUrl: '/marker-icon.png',
          shadowUrl: '/marker-shadow.png',
        });

        const map = L.map(mapId).setView([lat, lng], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        const marker = L.marker([lat, lng]).addTo(map);
        marker.bindPopup(`
          <div style="text-align:center; padding:10px;">
            <h3 style="margin:0 0 5px 0; color:#2f2f2f;">${crew.CrewName}</h3>
            <p style="margin:0; color:#6A8B9C;">${crew.City}, ${crew.Country}</p>
          </div>
        `);

        return () => {
          map.remove();
        };
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };
    
    if ((crew.HeadquarterLatitude && crew.HeadquarterLongitude) || fallbackCoords) {
      initMap();
    }
  }, [crew.id, crew.CrewName, crew.City, crew.Country, crew.HeadquarterLatitude, crew.HeadquarterLongitude, fallbackCoords]);

  // Media gallery - use crew.media array from Airtable
  const mediaGallery = crew.media ? crew.media
    .filter(media => 
      (media.MediaType === 'Crew Picture' || media.MediaType === 'Running Picture') && 
      media.Status === 'publish' && 
      media.FileURL
    )
    .map(media => ({
      type: 'image',
      url: media.FileURL!,
      caption: media.MediaTitle || media.AltText || `${crew.CrewName} image`
    })) : [];

  const activeSchedules = crew.schedules?.filter(schedule => schedule.RunSchedulesStatus === 'Active') || [];
  const displayedSchedules = showAllSchedules ? activeSchedules : activeSchedules.slice(0, 3);

  const openLightbox = (index: number) => {
    setSelectedMediaIndex(index);
  };

  const closeLightbox = () => {
    setSelectedMediaIndex(null);
  };

  const navigateMedia = (direction: 'prev' | 'next') => {
    if (selectedMediaIndex === null) return;
    
    if (direction === 'prev') {
      setSelectedMediaIndex(selectedMediaIndex > 0 ? selectedMediaIndex - 1 : mediaGallery.length - 1);
    } else {
      setSelectedMediaIndex(selectedMediaIndex < mediaGallery.length - 1 ? selectedMediaIndex + 1 : 0);
    }
  };

  return (
    <div className="crew-detail-page">
      {/* Hero Section */}
      <div className="crew-hero">
        <div className="hero-background">
          <Image
             src={crew.heroImageUrl || '/images/default-crew-hero.svg'}
             alt={`${crew.CrewName} hero image`}
             fill
             style={{ objectFit: 'cover' }}
             onError={(e) => {
               const target = e.target as HTMLImageElement;
               target.src = '/images/default-crew-hero.svg';
             }}
          />
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="container">
            <div className="crew-identity">
              <div className="crew-logo">
                <Image
                  src={crew.logoUrl || getDefaultCrewLogo()}
                  alt={`${crew.CrewName} logo`}
                  width={120}
                   height={120}
                  className="crew-logo-img"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = getDefaultCrewLogo();
                  }}
                />
              </div>
              <div className="crew-info">
                <h1 className="crew-name">{crew.CrewName}</h1>
                <div className="location-tag">
                  <span className="location-icon">📍</span>
                  <span>{crew.City}, {crew.Country}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <section className="crew-main-content">
        <div className="container">
          <div className="content-layout">
            {/* Left Column (2/3 width) */}
            <div className="left-column">
              {/* About the Crew - Long-form content */}
              <div className="crew-story-section">
                <div className="story-content">
                  {crew.SEODescription && <p className="mission-statement">{crew.SEODescription}</p>}
                  {crew.CrewStoryLongFinal ? (
                    <div dangerouslySetInnerHTML={{ 
                      __html: formatCrewStory(crew.CrewStoryLongFinal) 
                    }} />
                  ) : (
                    <>
                      <p>Since our founding in {crew.FoundingDate ? new Date(crew.FoundingDate).getFullYear() : '2020'}, we have grown into one of {crew.City}'s most active running crews. Our mission is to bring people together, share the joy of running, and discover the beautiful locations throughout our city.</p>
                      <p>Whether you're a beginner or an experienced marathoner – everyone is welcome. We believe that running not only strengthens the body, but also creates community and fosters new friendships.</p>
                      <p>Our weekly runs take us through {crew.City}'s most scenic locations. We explore parks, riverside paths, and urban trails that showcase the diverse character of our amazing city.</p>
                      <p>What makes us special is our inclusive approach. We organize runs for different fitness levels, from easy-paced social runs to challenging speed sessions. Our experienced captains ensure everyone feels supported and motivated to achieve their personal goals.</p>
                    </>
                  )}
                </div>
              </div>

              {/* Weekly Runs Section */}
              <section className="crew-runs-section">
                <h2>Weekly Runs</h2>
                {activeSchedules.length > 0 ? (
                  <>
                    <div className="runs-grid">
                      {(showAllSchedules ? activeSchedules : activeSchedules.slice(0, 3)).map((schedule, index) => (
                        <div key={index} className="run-card">
                          <div className="run-time-section">
                            <div className="run-day">{schedule.DayOfWeek}</div>
                            <div className="run-time">{schedule.Time}</div>
                          </div>
                          <div className="run-details">
                            <h3 className="run-name">{schedule.RunName}</h3>
                            <p className="run-description">{schedule.DistanceDescription}</p>
                            <div className="run-location">📍 {schedule.MeetingPointAddress}</div>
                          </div>
                          <div className="run-distance">{schedule.PaceDescription}</div>
                          <div className="run-map">
                            <div className="map-preview">
                              <span>🗺️</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {activeSchedules.length > 3 && (
                      <button 
                        className="show-more-schedules"
                        onClick={() => setShowAllSchedules(!showAllSchedules)}
                      >
                        {showAllSchedules ? 'Show Less' : `Show More (${activeSchedules.length - 3} more)`}
                      </button>
                    )}
                  </>
                ) : (
                  <div className="no-schedule">
                    <p>No scheduled runs available at the moment. Check back soon!</p>
                  </div>
                )}
              </section>

              {/* Gallery Section */}
              <section className="crew-gallery-section">
                <h2>Gallery</h2>
                {mediaGallery.length > 0 ? (
                  <>
                    <div className="gallery-grid">
                      {mediaGallery.slice(0, 4).map((media, index) => (
                        <div key={index} className="gallery-item" onClick={() => openLightbox(index)}>
                          <Image
                            src={media.url || getDefaultCrewPicture()}
                            alt={media.caption}
                            width={350}
                            height={300}
                            style={{ objectFit: 'cover' }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = getDefaultCrewPicture();
                            }}
                          />
                          <div className="gallery-overlay">
                            <span className="gallery-overlay-icon">👁</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {mediaGallery.length > 4 && (
                      <button className="view-all-photos" onClick={() => openLightbox(0)}>
                        📷 View All Photos ({mediaGallery.length})
                      </button>
                    )}
                  </>
                ) : (
                  <div className="gallery-grid">
                    {[1, 2, 3, 4].map((index) => (
                      <div key={index} className="gallery-item">
                        <Image
                          src={getDefaultCrewPicture()}
                          alt={`Sample crew photo ${index}`}
                          width={350}
                          height={300}
                          style={{ objectFit: 'cover' }}
                        />
                        <div className="gallery-overlay">
                          <span className="gallery-overlay-icon">📷</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Related Blog Posts Section - Only show when there are actual blog posts */}
              {false && ( // TODO: Replace with actual blog posts check when blog functionality is implemented
                <section className="crew-blog-posts">
                  <h2>Related Blog Posts</h2>
                  <div className="blog-posts-grid">
                    <div className="blog-post-card">
                      <div className="blog-post-image">
                        <Image
                          src={getDefaultCrewPicture()}
                          alt="Blog post"
                          width={300}
                          height={200}
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="blog-post-content">
                        <h3>Running in {crew.City}: Best Routes</h3>
                        <p>Discover the most scenic and runner-friendly paths in {crew.City}...</p>
                        <Link href="/blog" className="read-more">Read More</Link>
                      </div>
                    </div>
                    <div className="blog-post-card">
                      <div className="blog-post-image">
                        <Image
                          src={getDefaultCrewPicture()}
                          alt="Blog post"
                          width={300}
                          height={200}
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="blog-post-content">
                        <h3>Training Tips for Beginners</h3>
                        <p>Start your running journey with these essential tips...</p>
                        <Link href="/blog" className="read-more">Read More</Link>
                      </div>
                    </div>
                    <div className="blog-post-card">
                      <div className="blog-post-image">
                        <Image
                          src={getDefaultCrewPicture()}
                          alt="Blog post"
                          width={300}
                          height={200}
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="blog-post-content">
                        <h3>Urban Running Safety</h3>
                        <p>Essential tips for safe city running in {crew.City}...</p>
                        <Link href="/blog" className="read-more">Read More</Link>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Related Running Routes Section */}
              {relatedRoutes && relatedRoutes.length > 0 && (
                <section className="related-routes">
                  <h2>Related Running Routes</h2>
                  <p>Discover popular running routes in {crew.City}</p>
                  <div className="routes-grid">
                    {relatedRoutes.map((route) => (
                      <div key={route.RouteID} className="route-card">
                        <div className="route-header">
                          <h3>{route.RouteName}</h3>
                          {route.ApproximateDistance && (
                            <span className="route-distance">
                              {route.ApproximateDistance} {route.DistanceUnit || 'km'}
                            </span>
                          )}
                        </div>
                        {route.BriefDescription && (
                          <p className="route-description">{route.BriefDescription}</p>
                        )}
                        {route.KeyLandmarks && (
                          <div className="route-landmarks">
                            <span className="landmarks-label">Key Landmarks:</span>
                            <span className="landmarks-text">{route.KeyLandmarks}</span>
                          </div>
                        )}
                        <div className="route-points">
                          {route.StartPoint && (
                            <div className="route-point">
                              <span className="point-label">Start:</span>
                              <span className="point-text">{route.StartPoint}</span>
                            </div>
                          )}
                          {route.EndPoint && (
                            <div className="route-point">
                              <span className="point-label">End:</span>
                              <span className="point-text">{route.EndPoint}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="right-sidebar">
              {/* Quick Facts */}
              <div className="sidebar-section quick-facts">
                <h3>Quick Facts</h3>
                <div className="fact-item">
                  <span className="fact-label">📍 Location</span>
                  <span className="fact-value">{crew.City}, {crew.Country}</span>
                </div>
                <div className="fact-item">
                  <span className="fact-label">👥 Members</span>
                  <span className="fact-value">{crew.ApproxMemberCount || '50'}+</span>
                </div>
                {crew.FoundingDate && (
                  <div className="fact-item">
                    <span className="fact-label">📅 Founded</span>
                    <span className="fact-value">{new Date(crew.FoundingDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                  </div>
                )}

              </div>

              {/* Map Widget */}
              {((crew.HeadquarterLatitude && crew.HeadquarterLongitude) || fallbackCoords) && (
                <div className="sidebar-section map-widget">
                  <h3>Location</h3>
                  <div className="map-container">
                    <div 
                      id={`crew-map-${crew.id}`} 
                      style={{ height: '300px', width: '100%' }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Territory Widget for when no coordinates available */}
              {!crew.HeadquarterLatitude && !crew.HeadquarterLongitude && !fallbackCoords && (
                <div className="sidebar-section map-widget">
                  <h3>Our Territory</h3>
                  <div className="map-container">
                    <div className="map-placeholder">
                      <div className="map-visual">
                        <span className="map-icon">🗺️</span>
                        <p className="map-text">{crew.City}, {crew.Country}</p>
                      </div>
                    </div>
                    {crew.HeadquarterName && (
                      <div className="location-details">
                        <div className="headquarters-info">
                          <p><strong>Headquarters:</strong></p>
                          <p>{crew.HeadquarterName}</p>
                          <p>{crew.City}, {crew.Country}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Connect With Us */}
              <div className="sidebar-section connect-section">
                <h3>Connect With Us</h3>
                <div className="social-links">
                  {crew.InstagramURL && (
                    <a href={crew.InstagramURL} className="social-link instagram" target="_blank" rel="noopener noreferrer" title="Instagram">
                      <div className="social-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </div>
                    </a>
                  )}
                  {crew.FacebookFanpageURL && (
                    <a href={crew.FacebookFanpageURL} className="social-link facebook" target="_blank" rel="noopener noreferrer" title="Facebook Fanpage">
                      <div className="social-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </div>
                    </a>
                  )}
                  {crew.FacebookGroupURL && (
                    <a href={crew.FacebookGroupURL} className="social-link facebook-group" target="_blank" rel="noopener noreferrer" title="Facebook Group">
                      <div className="social-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.017 14v-3h-2.017v3h2.017zM16 14v-3h-2v3h2zM20.5 2h-17c-1.381 0-2.5 1.119-2.5 2.5v15c0 1.381 1.119 2.5 2.5 2.5h17c1.381 0 2.5-1.119 2.5-2.5v-15c0-1.381-1.119-2.5-2.5-2.5zM21 19.5c0 .276-.224.5-.5.5h-17c-.276 0-.5-.224-.5-.5v-15c0-.276.224-.5.5-.5h17c.276 0 .5.224.5.5v15zM8 14v-3h-2v3h2zM6 8.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5zM12 8.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5zM18 8.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5z"/>
                        </svg>
                      </div>
                    </a>
                  )}
                  {crew.StravaClubURL && (
                    <a href={crew.StravaClubURL} className="social-link strava" target="_blank" rel="noopener noreferrer" title="Strava Club">
                      <div className="social-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0l-7 13.828h4.172"/>
                        </svg>
                      </div>
                    </a>
                  )}
                  {crew.XURL && (
                    <a href={crew.XURL} className="social-link x-twitter" target="_blank" rel="noopener noreferrer" title="X (formerly Twitter)">
                      <div className="social-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </div>
                    </a>
                  )}
                  {crew.ContactEmailCrew && (
                    <a href={`mailto:${crew.ContactEmailCrew}`} className="social-link email" target="_blank" rel="noopener noreferrer" title="Email">
                      <div className="social-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                        </svg>
                      </div>
                    </a>
                  )}
                  {crew.HomepageURL && (
                    <a href={crew.HomepageURL} className="social-link website" target="_blank" rel="noopener noreferrer" title="Website">
                      <div className="social-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                        </svg>
                      </div>
                    </a>
                  )}
                  {crew.OtherSocialMediaURLs && (
                    <a href={crew.OtherSocialMediaURLs} className="social-link other-social" target="_blank" rel="noopener noreferrer" title="Other Social Media">
                      <div className="social-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      </div>
                    </a>
                  )}
                </div>
              </div>

              {/* Other Crews in City */}
              {otherCrewsInCity && otherCrewsInCity.length > 0 && (
                <div className="sidebar-section other-crews-section">
                  <h3>Other Crews in {crew.City}</h3>
                  <div className="other-crews-list">
                    {otherCrewsInCity.slice(0, 3).map((otherCrew) => (
                      <Link key={otherCrew.id} href={`/crews/${otherCrew.id}`} className="other-crew-card">
                        <div className="other-crew-info">
                          <div className="other-crew-logo">
                            <Image
                              src={otherCrew.logoUrl || getDefaultCrewLogo()}
                              alt={`${otherCrew.CrewName} logo`}
                              width={40}
                              height={40}
                              style={{ objectFit: 'cover' }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = getDefaultCrewLogo();
                              }}
                            />
                          </div>
                          <div className="other-crew-details">
                            <h4>{otherCrew.CrewName}</h4>
                            <p>{otherCrew.ApproxMemberCount || 'Unknown'} members</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  {otherCrewsInCity.length > 3 && (
                    <Link href={`/crews?city=${encodeURIComponent(crew.City)}`} className="view-all-crews-btn">
                      View all {otherCrewsInCity.length + 1} crews in {crew.City}
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedMediaIndex !== null && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>×</button>
            <button className="lightbox-nav prev" onClick={() => navigateMedia('prev')}>‹</button>
            <button className="lightbox-nav next" onClick={() => navigateMedia('next')}>›</button>
            <Image
              src={mediaGallery[selectedMediaIndex].url || getDefaultCrewPicture()}
              alt={mediaGallery[selectedMediaIndex].caption}
              width={800}
              height={600}
              style={{ objectFit: 'contain' }}
              className="lightbox-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = getDefaultCrewPicture();
              }}
            />
            <p className="lightbox-caption">{mediaGallery[selectedMediaIndex].caption}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrewDetail;