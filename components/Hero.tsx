import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getRandomCrewHeroImage } from '../lib/randomImageUtils';

interface HeroProps {
  onSearch?: (query: string) => void;
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
}

const Hero: React.FC<HeroProps> = ({ onSearch, title = "EXPLORE THE\nGLOBAL RUNNING\nCREW DATABASE", subtitle = "Connect with running communities worldwide and discover your next adventure", backgroundImage }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [heroBackground, setHeroBackground] = useState('/images/hero-bg.jpg');
  const router = useRouter();

  useEffect(() => {
    // Use provided background image or set random crew photo as background
    if (backgroundImage) {
      setHeroBackground(backgroundImage);
    } else {
      const loadRandomImage = async () => {
        const randomImage = await getRandomCrewHeroImage();
        setHeroBackground(randomImage);
      };
      loadRandomImage();
    }
  }, [backgroundImage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      // Default behavior: navigate to crews page with search query
      router.push(`/crews?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <section 
      className="hero" 
      style={{
        backgroundImage: `url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1>EXPLORE THE<br />GLOBAL RUNNING<br />CREW DATABASE</h1>
        <p>Connect with running communities worldwide and discover your next adventure</p>
        
        <form className="hero-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search crews by name, continent, country, city..."
            className="hero-search-input"
            value={searchQuery}
            onChange={handleInputChange}
          />
          <button type="submit" className="hero-search-button">
            🔍
          </button>
        </form>
      </div>
    </section>
  );
};

export default Hero;