// components/UI/InfoCard.tsx
import React from 'react';

type InfoCardProps = {
  title: string;
  subtitle: string;
  description: string;
  imageUrl?: string;
  themeColor?: string;
};

const InfoCard = ({ title, subtitle, description, imageUrl, themeColor }: InfoCardProps) => {
  return (
    <div className="info-card" style={{ borderLeftColor: themeColor || 'gray' }}>
      {imageUrl && (
        <div
          className="info-card-image"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}
      <div className="info-card-content">
        <div className="info-card-date">{subtitle}</div>
        <h3 className="info-card-title">{title}</h3>
        <p className="info-card-snippet">{description}</p>
        
        {/* NEU HINZUGEFÜGT: Der "More..." Button */}
        <div className="info-card-footer">
            <a href="#" className="info-card-cta">More...</a>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;