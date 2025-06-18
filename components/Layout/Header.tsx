import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 150);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className={`header ${isSticky ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="logo">RUNNINGCREWS</div>
        
        <nav>
          <ul className="nav-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/crews">Crews</Link></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#events">Events</a></li>
            <li><a href="#routes">Routes</a></li>
            <li><a href="#about">About</a></li>
          </ul>
        </nav>
        
        <div className="global-search">
          <input type="text" placeholder="Search crews, cities..." className="transparent-input" />
        </div>

        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{ color: isSticky ? 'var(--primary-dark)' : 'white', fontSize: '1.5rem', border: 'none', background: 'none' }}
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <nav className="mobile-nav md:hidden">
          <ul>
            <li><Link href="/" onClick={handleLinkClick}>Home</Link></li>
            <li><Link href="/crews" onClick={handleLinkClick}>Crews</Link></li>
            <li><a href="#blog" onClick={handleLinkClick}>Blog</a></li>
            <li><a href="#events" onClick={handleLinkClick}>Events</a></li>
            <li><a href="#routes" onClick={handleLinkClick}>Routes</a></li>
            <li><a href="#about" onClick={handleLinkClick}>About</a></li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;