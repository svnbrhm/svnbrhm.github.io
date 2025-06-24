import React, { useState, useEffect, useMemo } from 'react';
import CrewCard from './CrewCard';
import WorldMap from '../Map/WorldMap';
import { Crew } from '@/types/crew';
import { mockCrews } from '@/lib/mockData';
import { trackMockDataUsage } from '@/lib/mockDataTracker';

interface CrewListProps {
  crews: Crew[];
  searchQuery?: string;
  initialSearchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const CrewList: React.FC<CrewListProps> = ({ crews, searchQuery = '', initialSearchQuery = '', onSearchChange }) => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [displayedCrews, setDisplayedCrews] = useState<Crew[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(initialSearchQuery || searchQuery);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedCrewSize, setSelectedCrewSize] = useState<string>('all');
  // Activity level filter removed - schedules not available in basic crew data
  const [sortBy, setSortBy] = useState<'name' | 'country' | 'members'>('name');
  
  // Use provided crews or fallback to mock data
  const allCrews = React.useMemo(() => {
    if (crews && crews.length > 0) {
      return crews;
    } else {
      trackMockDataUsage('CrewList_component', 'airtable_error', `No crews provided, using ${mockCrews.length} mock crews`);
      return mockCrews;
    }
  }, [crews]);
  

  
  // Filter crews based on search query and filters
  const filteredCrews = React.useMemo(() => {
    let filtered = allCrews;
    
    // Apply search filter
    if (localSearchQuery.trim()) {
      const query = localSearchQuery.toLowerCase().trim();
      
      // Enhanced filtering logic
      filtered = filtered.filter(crew => {
        const crewName = crew.CrewName?.toLowerCase() || '';
        const country = crew.Country?.toLowerCase() || '';
        const city = crew.City?.toLowerCase().trim() || '';
        const continent = crew.Continent?.toLowerCase() || '';
        
        // Special handling for Berlin searches
        if (query === 'berlin') {
          return crewName.includes('berlin') || 
                 city.includes('berlin') || 
                 city === 'berlin, germany' ||
                 city === 'berlin' ||
                 country === 'germany' && city.includes('berlin');
        }
        
        return crewName.includes(query) ||
               country.includes(query) ||
               city.includes(query) ||
               continent.includes(query);
      });
    }
    
    // Apply city filter
    if (selectedCity !== 'all') {
      filtered = filtered.filter(crew => crew.City === selectedCity);
    }
    
    // Apply crew size filter
    if (selectedCrewSize !== 'all') {
      filtered = filtered.filter(crew => {
        const memberCount = crew.ApproxMemberCount || 0;
        switch (selectedCrewSize) {
          case 'small': return memberCount <= 20;
          case 'medium': return memberCount > 20 && memberCount <= 50;
          case 'large': return memberCount > 50;
          default: return true;
        }
      });
    }
    
    // Activity level filter removed - schedules not available in basic crew data
    // Users can view detailed schedule info on individual crew pages
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.CrewName || '').localeCompare(b.CrewName || '');
        case 'country':
          return (a.Country || '').localeCompare(b.Country || '');
        case 'members':
          return (b.ApproxMemberCount || 0) - (a.ApproxMemberCount || 0);
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [allCrews, localSearchQuery, selectedCity, selectedCrewSize, sortBy]);
  
  // Get unique cities for filter
  const cities = React.useMemo(() => {
    const unique = Array.from(new Set(allCrews.map(crew => crew.City).filter(Boolean)));
    return unique.sort();
  }, [allCrews]);
  
  // Smart pagination strategy based on search context and result count
  const getDisplayStrategy = (searchQuery: string, filteredCount: number) => {
    if (!searchQuery.trim()) {
      // No search - use normal pagination (4 per page)
      return { showAll: false, pageSize: 4 };
    }
    
    if (filteredCount <= 12) {
      // Small result set - show all
      return { showAll: true, pageSize: filteredCount };
    } else if (filteredCount <= 50) {
      // Medium result set - larger pages
      return { showAll: false, pageSize: 12 };
    } else {
      // Large result set - even larger pages
      return { showAll: false, pageSize: 20 };
    }
  };
  
  const displayStrategy = getDisplayStrategy(localSearchQuery, filteredCrews.length);
  const CREWS_PER_PAGE = displayStrategy.pageSize;
  const totalPages = displayStrategy.showAll ? 1 : Math.ceil(filteredCrews.length / CREWS_PER_PAGE);
  const hasMoreCrews = !displayStrategy.showAll && currentPage < totalPages;
  const dataLoading = false; // No loading state needed with SSG

  // Update local search query when initialSearchQuery changes
  useEffect(() => {
    if (initialSearchQuery !== undefined) {
      setLocalSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
    setDisplayedCrews([]);
  }, [localSearchQuery, selectedCity, selectedCrewSize, sortBy]);
  
  // Initialize with first page of crews (or all crews if showAll strategy)
  useEffect(() => {
    if (!dataLoading && filteredCrews.length > 0) {
      const strategy = getDisplayStrategy(localSearchQuery, filteredCrews.length);
      const initialCrews = strategy.showAll 
        ? filteredCrews 
        : filteredCrews.slice(0, strategy.pageSize);
      setDisplayedCrews(initialCrews);
    }
  }, [dataLoading, filteredCrews, localSearchQuery]);
  
  // Handle search input changes
  const handleSearchChange = (query: string) => {
    setLocalSearchQuery(query);
    if (onSearchChange) {
      onSearchChange(query);
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setLocalSearchQuery('');
    setSelectedCity('all');
    setSelectedCrewSize('all');
    setSortBy('name');
    if (onSearchChange) {
      onSearchChange('');
    }
  };
  
  // Check if any filters are active
  const hasActiveFilters = localSearchQuery.trim() || selectedCity !== 'all' || selectedCrewSize !== 'all' || sortBy !== 'name';

  // Load more crews function
  const loadMoreCrews = async () => {
    if (isLoading || !hasMoreCrews) return;
    
    setIsLoading(true);
    
    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const strategy = getDisplayStrategy(localSearchQuery, filteredCrews.length);
    const nextPage = currentPage + 1;
    const startIndex = 0;
    const endIndex = nextPage * strategy.pageSize;
    const newDisplayedCrews = filteredCrews.slice(startIndex, endIndex);
    
    setDisplayedCrews(newDisplayedCrews);
    setCurrentPage(nextPage);
    setIsLoading(false);
  };

  // Touch/swipe handling for mobile
  useEffect(() => {
    let startY = 0;
    let isScrolling = false;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      isScrolling = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!startY) return;
      isScrolling = true;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!startY || !isScrolling) return;
      
      const endY = e.changedTouches[0].clientY;
      const deltaY = startY - endY;
      const threshold = 50;
      
      const isNearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      
      if (deltaY > threshold && isNearBottom && hasMoreCrews && !isLoading) {
        loadMoreCrews();
      }
      
      startY = 0;
      isScrolling = false;
    };

    if ('ontouchstart' in window) {
      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      document.addEventListener('touchmove', handleTouchMove, { passive: true });
      document.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      if ('ontouchstart' in window) {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [hasMoreCrews, isLoading]);

  return (
    <>

      
      <section className="crew-overview-section">
        <div className="container">
          {/* Filter Controls */}
        <div className="crew-filters">
          <div className="filter-controls">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            
            <select
              value={selectedCrewSize}
              onChange={(e) => setSelectedCrewSize(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Sizes</option>
              <option value="small">Small (≤20 members)</option>
              <option value="medium">Medium (21-50 members)</option>
              <option value="large">Large (50+ members)</option>
            </select>
            
            {/* Activity Level filter removed - schedules not available in basic crew data */}
            
            <select
               value={sortBy}
               onChange={(e) => setSortBy(e.target.value as 'name' | 'country' | 'members')}
               className="filter-select"
             >
               <option value="name">Sort by Name</option>
               <option value="country">Sort by Country</option>
               <option value="members">Sort by Members</option>
             </select>
             
             {hasActiveFilters && (
               <button
                 onClick={clearFilters}
                 className="clear-filters-btn"
                 title="Clear all filters"
               >
                 ✕ Clear
               </button>
             )}
           </div>
        </div>

        {/* Centered View Mode Toggle */}
        <div className="view-controls-center">
          <div className="view-toggle-buttons">
            <button 
              className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              📋 List View
            </button>
            <button 
              className={`view-button ${viewMode === 'map' ? 'active' : ''}`}
              onClick={() => setViewMode('map')}
            >
              🗺️ Map View
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="results-info-center">
          <div className="results-stats">
            <p>Showing {displayedCrews.length} of {filteredCrews.length} crews
              {allCrews.length !== filteredCrews.length && ` (${allCrews.length - filteredCrews.length} filtered out)`}
            </p>
            {(localSearchQuery || selectedCity !== 'all' || selectedCrewSize !== 'all') && (
              <div className="active-filters">
                {localSearchQuery && <span className="filter-tag">Search: "{localSearchQuery}"</span>}
                {selectedCity !== 'all' && <span className="filter-tag">City: {selectedCity}</span>}
                {selectedCrewSize !== 'all' && <span className="filter-tag">Size: {selectedCrewSize}</span>}
              </div>
            )}
          </div>
          {filteredCrews.length === 0 && hasActiveFilters && (
            <p className="no-results">No crews found matching your filters. Try adjusting your search criteria.</p>
          )}
        </div>

        {/* Crew Grid */}
        {viewMode === 'list' && (
          <>
            {/* Loading State */}
            {dataLoading && (
              <div className="crew-loading">
                <div className="loading-spinner"></div>
                <p>Loading crews from Airtable...</p>
              </div>
            )}
            
            {/* Note: Error handling is now done at the page level with SSG fallback */}
            
            {/* Crew Grid */}
            {!dataLoading && (
              <div className="crew-grid">
                {displayedCrews.length > 0 ? (
                  displayedCrews.map((crew) => (
                    <CrewCard key={crew.id} crew={crew} />
                  ))
                ) : (
                  <div className="empty-state">
                    <h3>No crews found</h3>
                    <p>Try adjusting your search terms</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Load More Button */}
            {hasMoreCrews && (
              <div className="load-more-container">
                <button 
                  className={`load-more-button ${isLoading ? 'loading' : ''}`}
                  onClick={loadMoreCrews}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More Crews
                      <span className="load-more-icon">↓</span>
                    </>
                  )}
                </button>
                <p className="swipe-hint">💡 On mobile: Swipe up at the bottom to load more</p>
              </div>
            )}
            
            {/* End of results message */}
            {!hasMoreCrews && displayedCrews.length > CREWS_PER_PAGE && (
              <div className="end-of-results">
                <p>🎉 You've seen all crews! Check back later for new additions.</p>
              </div>
            )}
          </>
        )}

        {/* Map View - Now using the same WorldMap component as homepage */}
        {viewMode === 'map' && (
          <div className="map-view-container">
            <WorldMap />
          </div>
        )}
      </div>
    </section>
    </>
  );
};

export default CrewList;