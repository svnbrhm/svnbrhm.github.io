import React from 'react';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  height?: 'small' | 'medium' | 'large' | 'extra-large' | 'huge' | 'massive' | 'giant';
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
}

const PageHero: React.FC<PageHeroProps> = ({
  title,
  subtitle,
  backgroundImage,
  backgroundColor = 'var(--crew-primary)',
  height = 'medium',
  showSearch = false,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...'
}) => {
  const heightClass = {
    small: 'h-64',
    medium: 'h-80',
    large: 'h-96',
    'extra-large': 'h-112',
    huge: 'h-128',
    massive: 'h-144',
    giant: 'h-160'
  }[height];

  return (
    <section 
      className={`page-hero ${heightClass}`}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundColor: !backgroundImage ? backgroundColor : 'transparent',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="page-hero-overlay" style={{
        background: backgroundImage ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.2)'
      }}>
        <div className="page-hero-content">
          <h1 className="page-hero-title">{title}</h1>
          {subtitle && <p className="page-hero-subtitle">{subtitle}</p>}
          
          {showSearch && (
            <div className="hero-search-section">
              <div className="hero-search">
                <input
                  type="text"
                  className="hero-search-input"
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PageHero;