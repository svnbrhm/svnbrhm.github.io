import React from 'react';
import { Crew } from '@/types/crew';
import Link from 'next/link';
import Image from 'next/image';
import { getCrewLogoPath, getDefaultCrewLogo, getDefaultCrewPicture, getCrewPhotoGallery } from '../../lib/imageUtils';

interface CrewCardProps {
  crew: Crew;
  featured?: boolean;
}

const CrewCard: React.FC<CrewCardProps> = ({ crew, featured = false }) => {
  const foundingDate = crew.FoundingDate ? new Date(crew.FoundingDate) : null;
  const foundingMonth = foundingDate ? foundingDate.toLocaleDateString('en-US', { month: 'short' }) : null;
  const foundingYear = foundingDate ? foundingDate.getFullYear() : null;

  // Get crew logo - use logoUrl from crew object with fallback
  const crewLogo = crew.logoUrl || getCrewLogoPath(crew.CrewName);
  
  // Get crew picture - use heroImageUrl with fallback to PrimaryImageUrl
  const crewPicture = crew.heroImageUrl || crew.PrimaryImageUrl;
  const crewGallery = getCrewPhotoGallery(crew.CrewName, crew.media);

  return (
    <div className={`crew-card-new ${featured ? 'featured-crew-card' : ''}`}>
      {/* Top Section - Crew Image with Logo and Name Overlay */}
      <div className="crew-card-image-new">
        <Image
          src={crewPicture || getDefaultCrewPicture()}
          alt={`${crew.CrewName} crew picture`}
          fill
          style={{ objectFit: 'cover' }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = getDefaultCrewPicture();
          }}
        />
        
        {/* Photo Gallery Indicator */}
        {crewGallery.length > 0 && (
          <div className="crew-photo-gallery-indicator">
            <span className="gallery-count">+{crewGallery.length}</span>
          </div>
        )}
        <div className="crew-card-logo-container">
          <div className="crew-card-logo">
            <Image
              src={crewLogo}
              alt={`${crew.CrewName} logo`}
              width={80}
              height={80}
              className="crew-logo-img"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = getDefaultCrewLogo();
              }}
            />
          </div>
        </div>
        <div className="crew-card-image-overlay">
          <h3 className="crew-card-name-overlay">{crew.CrewName}</h3>
        </div>
      </div>
      
      {/* Info Section */}
      <div className="crew-card-info-new">
        {/* Badges Row */}
        <div className="crew-card-badges-row">
          {foundingMonth && foundingYear && (
            <span className="crew-card-badge">
              {foundingMonth} {foundingYear}
            </span>
          )}
          <span className="crew-card-badge">
            {crew.City}, {crew.Country}
          </span>
        </div>

        {/* Intro Copy */}
        <p className="crew-card-intro">
          {crew.CrewStoryExcerpt || 
           `Experience running with ${crew.ApproxMemberCount || 'passionate'} members in ${crew.City}.`}
        </p>
      </div>

      {/* Bottom Section - CTA Button */}
      <div className="crew-card-cta-section">
        <Link href={`/crews/${crew.id}`}>
          <button className="crew-card-cta-new">
            Read More…
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CrewCard;