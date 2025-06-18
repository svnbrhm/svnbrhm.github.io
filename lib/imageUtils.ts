/**
 * Utility functions for handling crew images and logos
 */

// Available logo files in the public/images/crew/logos directory
// This list should be updated when new logos are added
const availableLogoFiles = [
  "023-Run-Club-Logo.jpeg", "033-Running-Crew-Logo.jpeg", "080-Tokyo-Logo.jpeg", "091RUNCrW-Logo.jpeg",
  "1991-Logo.jpeg", "247-Logo.png", "24x7-Movement-Logo.jpeg", "28850runners-Logo.png", "3Dash-Running-Logo.png",
  "442-Logo.png", "612run-Logo.png", "8000-Running-Bruges-Logo.png", "ACT-WOMENS-RUNning-Logo.jpeg",
  "AFE-Athletics-Far-East-Logo.jpeg", "AM-PC-RC-Logo.jpeg", "AR-Endurance-Sports-LONDON-Logo.jpeg",
  "Abbotsford-Trail-Running-Club-Logo.jpeg", "After-Work-Track-Club-Berlin-Logo.png", "Air-Up-There-RC-Logo.jpeg",
  "Akarunners-Logo.jpeg", "Allied-Shadow-Unit-Hong-Kong-Logo.png", "Amazing-Crew-Logo.jpeg",
  "Amsterdam-Running-Club-Logo.jpeg", "Antwerp-Running-Crew-Logo.jpeg", "Antz-Colony-RC-Logo.png",
  "Anyang-Running-Crew-Logo.jpeg", "Aphrodite-Running-Club-Logo.png", "Asian-Runners-Far-West-Logo.jpeg",
  "BIKOSUADANA-Logo.jpeg", "BKNK-Logo.jpeg", "BR20-Logo.jpeg", "BRC-Runners-Logo.jpeg",
  "BXL-Run-Crew-Brussels-Logo.png", "Bambas-Sports-Club-Amsterdam-Logo.png", "Banana-Run-Club-Logo.png",
  "Be-More-You-Logo.jpeg", "Beat-Logo.jpeg", "BeiRUn-Logo.jpeg", "Belgrade-Running-Club-Logo.jpeg",
  "Belgrade-Urban-Running-Team-Logo.png", "Bergamo-Running-Logo.jpeg", "Berlin-Braves-Logo.jpeg",
  "Berlin-Track-Club-Logo.png", "BerlinBagels-Logo.jpeg", "Biakbecicak-Logo.jpeg", "Bislet-Running-Club-Logo.jpeg",
  "Black-Roses-NYC-Logo.jpeg", "Black-Toes-Running-Team-Logo.jpeg", "Blacklist-LA-Runners-Logo.jpeg",
  "Block-Dash-Crew-Logo.jpeg", "Bomby-Running-Logo.jpeg", "Boogie-Down-Bronx-Runners-Logo.jpeg",
  "Boramae-Track-Running-Crew-Logo.png", "Boyle-Heights-Bridge-Runners-Logo.jpeg", "Braamfie-Runners-Logo.jpeg",
  "Brand-New-Waves-RC-Logo.jpeg", "Bravo-Run-Crew-Logo.jpeg", "BridgeRunners-Logo.jpeg",
  "Bridgerunners-Dusseldorf-Logo.jpeg", "Brisbane-Social-Run-Club-Logo.jpeg", "Bromance-Athletic-Club-Cover-Logo.png",
  "Brooklyn-Track-Club-Logo.jpeg", "Brooks-Running-Squad-Logo.jpeg", "Broward-Running-Society-Logo.png",
  "Brutal-Corre-Logo.jpeg", "Bundang-Line-Running-Crew-Logo.jpeg", "Bundang-Running-Crew-Logo.jpeg",
  "CREWGHOST-Logo.jpeg", "CS-Running-Team-Logo.jpeg", "Caes-D-Avenida-Porto-Logo.jpeg",
  "Cairo-Runners-Logo.png", "Calma-Logo.jpeg", "Cani-Sciolti-Running-Team-Logo.jpeg",
  "Capital-Crew-Belgrade-Logo.jpeg", "Captial-Runners-Logo.jpeg", "Chadol-Running-Club-Seoul-Logo.png",
  "Chasinglights-London-Logo.jpeg", "Chuncheon-Running-Crew-Logo.png", "Cla-Endorfina-Sao-Paulo-Logo.png",
  "Claremont-Trotters-Logos-Logo.jpeg", "Clique-Runners-Logo.jpeg", "Common-Landscape-Logo.jpeg",
  "Community-Track-Club-Cape-Town-Logo.png", "Concrete-Runners-Logo.jpeg", "Conquer-Running-Crew-Logo-1-Logo.jpeg",
  "Cool-Runnings-Recreational-Club-Logo.png", "Correr-Lisboa-Lisbon-Logo.png", "Craiova-Running-Club-Logo.jpeg",
  "Cria-Crew-Logo.jpeg", "DNA-Logo.png", "DNH-Logo.jpeg", "DOSE-Running-Perth-Logo.png",
  "Damn-Gang-Logo.jpeg", "Dash-Running-Squad-Logo.jpeg", "Delta-Runners-Logo.png",
  "District-Running-Collective-Logo.jpeg", "Dongtan-Running-Crew-Logo.jpeg", "Dorimcheon-Running-Crew-Logo.jpeg",
  "Dromo-Run-Crew-Logo.jpeg", "East-Laurier-Running-Club-Logo.jpeg", "East-Van-Run-Crew-Vancouver-Logo.jpeg",
  "Eastbound-Run-Crew-Logo.jpeg", "Edgy-Running-Collective-Logo.jpeg", "Eighty-Eight-Seoul-Running-Club-Logo.jpeg",
  "Elephant-Running-Club-Bandar-Lampung-Logo.png", "Emancipated-Run-Crew-Logo.jpeg", "Eternal-Eagles-Logo.jpeg",
  "Exodus-Logo.jpeg", "FBC-Logo.jpeg", "Faster-Bastards-Logo.jpeg", "Fat-Betty-Run-Logo.jpeg",
  "Fat-Boyz-Track-Club-Hamburg-Logo.png", "Feel-Lady-Crew-Logo.jpeg", "Fierce-Run-Force-Berlin-Logo.png",
  "Flames-Barcelona-Logo.jpeg", "Flowerboy-Run-Club-Logo.png", "Flying-Girls-Milano-Logo.jpeg",
  "Foodsport-Logo.jpeg", "Force-Running-Club-Logo.jpeg", "Founders-Running-Club-Logo.png",
  "Fragile-Running-Club-Logo.jpeg", "Fraser-Street-Run-Club-Logo.jpeg", "Fun-Not-Fast-Birmingham-Logo.png",
  "G10-Runners-Logo.png", "Galaxy-Running-Club-Logo.jpeg", "Gazelle-Logo.jpeg",
  "Geelong-Runners-Club-Logo.jpeg", "Geoje-Running-Crew-Logo.jpeg", "Ghetto-Run-Crew-Logo.jpeg",
  "Gin-and-Running-Logo.png", "GirlSole-Logo.jpeg", "Girls-Run-NYC-Logo.jpeg", "Girls-To-Go-Logo.jpeg",
  "Go-City-Runners-Logo.jpeg", "Godspeed-Running-Club-Logo.png", "GoldFinger-Track-Club-Logo.jpeg",
  "Golden-Blocks-Logo.jpeg", "Golden-Gate-Running-Club-Logo-1-Logo.jpeg", "Gorilla-Running-Club-Logo.png",
  "Gorky-Park-Runners-Logo.jpeg", "Grit-Logo.jpeg", "HILLS-Logo.jpeg", "Halle-Run-Crew-Logo.png",
  "Happy-Feet-Logo.jpeg", "Harbour-Runners-Hong-Kong-Logo.png", "HardTopRunClub-Logo.jpeg",
  "Harlem-Run-Logo.png", "HeyDashCrew-Logo.jpeg", "High-Park-Rogue-Runners-Logo.jpeg",
  "Hunter-Athletics-and-Recreation-Melbourne-Logo.png", "IPB-Runners-Logo.jpeg", "Ice-Cream-and-Donut-Run-Club-1-Logo.jpeg",
  "Independent-Run-Logo.jpeg", "Islands-Wolfpack-Logo.png", "Jacuzzi-Boys-Athletic-Clubs-Logo.jpeg",
  "Jakbrunners-Logo.jpeg", "Jam-Sil-Running-Club-Logo.jpeg", "Jeddah-Running-Collective-Logo.jpeg",
  "Jeddah-Running-Collective-Women-Logo.jpeg", "Jolie-Foulee-Logo.jpeg", "Juanson-Running-Logo.jpeg",
  "Jumeirah-Johns-Running-Club-Dubai-Logo.png", "KR-SMALL-SQUARE-Logo.jpeg", "KRC-Logo.jpeg",
  "KXTC-Logo.png", "Keep-On-Keeping-On-Manchester-Logo.png", "Kendos-Logo.jpeg", "Kendos-Running-Crew-Logo.jpeg",
  "Komorebi-Running-Club-Logo.jpeg", "Kraft-Runners-Berlin-Logo.png", "Kudos-Run-Crew-Logo.jpeg",
  "Kyiv-Runners-Logo.jpeg", "Kyserun-Krew-Kuala-Lumpur-Logo.png", "LA-Rebels-Santa-Moncia-Logo.png",
  "LAST-Logo.jpeg", "LDN-Brunch-Club-Logo.jpeg", "LaRunFam-Logo.jpeg", "LadyRushers-Logo.jpeg",
  "Lazyboys-Track-Club-Logo.jpeg", "Leptina-Runners-Logo.jpeg", "LibuRUN-Logo.jpeg",
  "Lost-Boys-Track-Club-Logo.jpeg", "Lostboys-Track-Club-Logo.jpeg", "Louisville-Race-Club-Logo.jpeg",
  "Lyon-Running-Club-Logo.jpeg", "MAP-Runners-Logo.jpeg", "MNKS-Logo.jpeg", "MRC-Paris-Logo.jpeg",
  "MTAR-Logo.jpeg", "Mad-One-Crew-Logo.jpeg", "Maem-Running-Club-Logo.jpeg", "Manic-Run-Club-Logo.png",
  "Milennials-Run-Crew-Logo.jpeg", "Mindful-Movement-Club-Logo.jpeg", "Mindset-Movement--Logo.png",
  "Mint-Running-Club-LDN-Logo.jpeg", "Mint-Running-Logo.jpeg", "Modu-Running-Crew-Logo-1-Logo.jpeg",
  "Moskva-River-Runners-Logo.jpeg", "Movers-And-Pacers-Logo.jpeg", "Munich-Running-Society-Logo.png",
  "Munk-Store-Runners-Logo.png", "MustLoveHills-RUNCREW-Logo.png", "Mutant-Logo.jpeg",
  "N1RC-Logo.jpeg", "NBRO-Running-Crew-Copenhagen-Logo.png", "NDG-Run-Rite-Athletics-Club-Logo.jpeg",
  "NTRC-FLAGS-COLOUR-fbBANNER-SQUARE-NightTerrors-Run-Logo.jpeg", "Negative-Split-Running-Tribe-Logo.jpeg",
  "Neighbourhood-Logo.jpeg", "New-Breed-Runners-Zurich-Logo.png", "Nextgendingmad-Logo.png",
  "NightKids-Runners-Logo.jpeg", "No-Name-Crew-Barcelona-1-Logo.png", "No-Reason-Co-Logo.jpeg",
  "No-Regrets-Runners-Logo.jpeg", "North-End-Runners-Halifax-Logo.png", "Nuremberg-Track-Club-Logo.jpeg",
  "OPAC-Logo.jpeg", "OPR-Seoul-Logo.jpeg", "Odense-Running-Crew-Logo.png", "Off-Running-Crew-Seoul-1-Logo.png",
  "Old-Man-Run-CLub-Logo.jpeg", "Olympic-Capital-Runners-Lausanne-Logo.jpeg", "Open-Mile-Bali-Logo.png",
  "Outrun-Montreal-Logo.png", "PRRC-1936-Logo.jpeg", "Pace-Killers-Logo.jpeg", "Pace-Pack-Runners--Logo.jpeg",
  "Pacer-Track-Club-Logo.jpeg", "Padang-Trail-Runners-Logo.jpeg", "Palembang-Runners-Logo-1-Logo.jpeg",
  "Palembang-Runners-Logo.jpeg", "Paris-Running-Club-Logo.jpeg", "Parkdale-Road-Runners-Logo.png",
  "Patta-Running-Team-Amsterdam-Logo.png", "Patta-Running-Team-Logo.png", "Penang-City-Running-Runners-Logo.jpeg",
  "Pernah-Lari-Di-Bekasi-Logo.jpeg", "Pigeon-Project-Milano-Logo.jpeg", "Pioneers-Run-Crew-Logo.png",
  "Positive-Force-Logo.jpeg", "Prefontaine-Run-Club-Logo.jpeg", "Prism-Runners-Logo.jpeg",
  "Pular-Athletic-Club-Seoul-Logo.png", "Purple-Lights-Logo.jpeg", "Queens-Rebels-Logo.jpeg",
  "RC8K-Logo.jpeg", "RUN4-Auckland-Logo.png", "RUN89-Logo.png", "RUNAAR-Logo.jpeg",
  "RUNB-Logo-1-Logo.jpeg", "RUNDISTRICT-Logo.jpeg", "RUNMDN-Logo.jpeg", "RUNSEOUL-Logo.jpeg",
  "RUNderground-Logo.jpeg", "RUSH-Logo.jpeg", "RVMRVNNXRS-Logo.jpeg", "Rabbit-Running-Crew-Logo.jpeg",
  "Racoon-Runners-Kuala-Lumpur-Logo.png", "Rainbow-Run-Crew-Logo.jpeg", "Rasa-Club-Logo.jpeg",
  "Reaction-Logo.jpeg", "Red-Run-Club-Tokyo-Logo.jpeg", "Red-Snakes-Milano-Logo.jpeg",
  "Resident-Runners-Logo.jpeg", "Retiro-Running-Logo.png", "RinRunRoad-Logo.jpeg",
  "Riot-Squad-Running-Logo.jpeg", "Riyadh-Urban-Runners-Logo.jpeg", "Rochester-Road-Runners-Logo.jpeg",
  "RockPacers-Logo.jpeg", "Roebling-Runners-Logo.jpeg", "Run-After-Work-Crew-Logo.jpeg",
  "Run-Brum-Crew-Logo.jpeg", "Run-Club-Busan-Logo.jpeg", "Run-Collective-Stockholm-Logo.png",
  "Run-Dem-Crew-Logo.jpeg", "Run-Fleet-Hamburg-Logo.png", "Run-JPG-Logo.jpeg",
  "Run-Pack-Berlin-Logo.png", "Run-Squad-CGN-Cologne-Logo.png", "Run-the-Tan-RUN-CLUB-Logo.png",
  "Run-with-us-Melbourne-Logo.png", "Runarchy-Logo.jpeg", "Rundamental-Logo.jpeg",
  "Rungry-Project-Logo.jpeg", "Runnersheep-Seoul-Logo.png", "Running-Gooses-1-Logo.png",
  "Running-Junkies-Logo.jpeg", "Running-Mafia-Logo.jpeg", "Running-Rage-Logo.png",
  "Running-with-Kyunghee-Logo.jpeg", "Rush-Runners-Logo.jpeg", "SD-Runners-Logo.jpeg",
  "SRC-Logo.jpeg", "Selari-Logo.jpeg", "Seogwipo-RC-Logo.jpeg", "Seuxphen-Running-Team-Logo.png",
  "Seven-Runners-Crew-Logo.jpeg", "Social-Hour-Run-Club-Logo.png", "Social-Running-Crew-Seoul-Logo.jpeg",
  "Soul-Run-Crew--Logo.png", "Souplesse-Rome-Logo.png", "South-Side-Run-Crew-Logo.jpeg",
  "South-Striders-Munich-Logo-1-Logo.jpeg", "Spartan-Sundays-Logo.jpeg", "Special-Moment-Running-Crew-Dongtan-Logo.png",
  "Ssideline-City-Run-Club-Stockholm-Logo.png", "Steveston-Run-Crew-Logo.jpeg", "Still-Waters-Run-Deep-Manchester-Logo.png",
  "Streets-101-Logo.jpeg", "String-Track-Club-Logo.jpeg", "Stumprunners-Logo.jpeg",
  "Suicide-Hill-Racing-Club-Logo.jpeg", "Sword-Warsaw-Logo.jpeg", "Synergy-Running-Club-Logo.jpeg",
  "Tamojunto-Wes-Running-Logo.jpeg", "Team-DLD-Logo.png", "Team-RunBo-Logo.jpeg",
  "Team-Walid-Logo.jpeg", "Team2Much-Logo.jpeg", "Temanlar-Logo.jpeg", "Tempo-Running-Crew-Mexico-City-Logo.png",
  "Ten-Fifty-Logo.jpeg", "The-504th-Logo.jpeg", "The-Corners-Run-Crew-Logo.jpeg",
  "The-Fresh-Patterns-Collective-Logo.png", "The-Gang-Running-Club-Mexico-City-Logo.png", "The-High-Panters-Logo.jpeg",
  "The-Nine-Four-Logo.jpeg", "The-One-Crew-Logo.jpeg", "The-Pack-Logo.jpeg",
  "The-Republic-Logo.jpeg", "Thesis-Run-Crew-Logo.jpeg", "Three-Run-Two-Logo.png",
  "Thunderlight-Jakarta-Logo.jpeg", "Tide-Runners-Hamburg-Logo.jpeg", "Tirun-Logo.jpeg",
  "Tokyo-Girls-Run-Logo.jpeg", "Tokyo-Night-Run-Club-Logo.jpeg", "Tortugas-Run-Club-Chicago-Logo.png",
  "Track-East-RDC-Logo.jpeg", "Track-Mafia-Logo.jpeg", "Trail-Maniacs-Logo.jpeg",
  "Trail-Trash-Logo.png", "UCON-Daegu-Cover-2-Logo.jpeg", "UCON-Logo.jpeg",
  "UDC-Okayama-Logo.jpeg", "URC-Logo.jpeg", "Umbali-Runninga-Logo.jpeg",
  "Umbali-Runningb-Logo.jpeg", "Unseen-Run-Club-Logo.png", "Urban-Runners-Crew-Logo.jpeg",
  "Urban-Runners-Podgorica-Logo.jpeg", "Urban-Running-Troupe-Logo.jpeg", "Urban-Tribes-Logo.jpeg",
  "Utrecht-Running-Project-Logo.jpeg", "VMA-Logo.jpeg", "Velvet-Runners-Logo.jpeg",
  "Vie-Run-Logo.jpeg", "Vienna-Running-Collective-Logo.png", "Volt-Women-Logo.jpeg",
  "WERUNJKT-Logo.png", "WRB-Logo.jpeg", "Wausan-30-Logo.jpeg", "Wazup-Running-Club-Hong-Kong-Logo.png",
  "We-Are-Kiin-1-Logo.png", "We-Run-Clan-Logo.jpeg", "WeBeThirsty-Logo.jpeg",
  "WeRunBrooKlyn-Logo.jpeg", "West-Way-Logo.jpeg", "Wild-Rose-Runners-Logo.jpeg",
  "Wild-Trail-Runners-Logo.jpeg", "Wolfpack-Running-Logo.jpeg", "Yamajo-Logo.jpeg",
  "Yo-Running-Club-Logo.jpeg", "Yoga-and-Sport-for-Refugees-Logo.jpeg", "Zagreb-Runners-Logo.png",
  "Zoom-Volt-Runners-Logo.jpeg", "ak1-Nisan-Papila-Logo.jpeg", "de-Grace-Running-Collective-Logo.png",
  "default-crew-logo.svg", "division-bpm-Berlin-Logo.jpeg", "dogani-Logo.jpeg",
  "hmrc-Logo.jpeg", "icon-color-bg-black-Logo.jpeg", "iron-runners-Logo.jpeg",
  "lactic-acid-junkies-Logo.jpeg", "no-tag-runners-Logo.png", "run3-Logo.jpeg",
  "run365ph-Logo.jpeg", "seongsu-rc--Logo.jpeg", "tc-track-core-Logo.png",
  "unnamed-Logo.jpeg", "urban-run-project-Logo.jpeg", "wru-Logo.jpeg", "youth-10-runners-Logo.jpeg"
];

// Exact crew name to logo filename mappings for special cases
const exactLogoMapping: Record<string, string> = {
  "OPAC": "OPAC-Logo.jpeg",
  "Original Propaganda Athletic Club": "OPAC-Logo.jpeg",
  "Still Waters Run Deep Manchester": "Still-Waters-Run-Deep-Manchester-Logo.png",
  // Add more exact mappings as needed
};

// Common abbreviations and alternative names
const abbreviationMapping: Record<string, string[]> = {
  "OPAC": ["Original Propaganda Athletic Club"],
  "Original Propaganda Athletic Club": ["OPAC"],
  "Berlin Street Runners": ["Berlin-Street-Runners", "BSR"],
  "Still Waters Run Deep": ["Still-Waters-Run-Deep", "SWRD"],
  // Add more abbreviations as needed
};

/**
 * Normalize a string for comparison (lowercase, remove special chars, etc.)
 */
function normalizeString(str: string): string {
  // Handle null, undefined, or non-string values
  if (!str || typeof str !== 'string') {
    return '';
  }
  
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract keywords from a crew name for fuzzy matching
 */
function extractKeywords(crewName: string): string[] {
  const normalized = normalizeString(crewName);
  const words = normalized.split(' ');
  
  // Filter out only very common words that don't help with matching
  // Keep words like 'track' and 'club' as they can be distinguishing features
  const stopWords = ['run', 'running', 'runners', 'athletic', 'the', 'and', 'of', 'a', 'an'];
  return words.filter(word => word.length > 2 && !stopWords.includes(word));
}

/**
 * Calculate similarity score between two strings
 */
function calculateSimilarity(str1: string, str2: string): number {
  const norm1 = normalizeString(str1);
  const norm2 = normalizeString(str2);
  
  // Exact match
  if (norm1 === norm2) return 1.0;
  
  // Check if one contains the other
  if (norm1.includes(norm2) || norm2.includes(norm1)) return 0.8;
  
  // Keyword matching
  const keywords1 = extractKeywords(str1);
  const keywords2 = extractKeywords(str2);
  
  if (keywords1.length === 0 || keywords2.length === 0) return 0;
  
  const matchingKeywords = keywords1.filter(k1 => 
    keywords2.some(k2 => k1.includes(k2) || k2.includes(k1))
  );
  
  const keywordScore = matchingKeywords.length / Math.max(keywords1.length, keywords2.length);
  return keywordScore * 0.6; // Scale down keyword matches
}

/**
 * Calculate similarity score between two keyword arrays
 */
function calculateKeywordSimilarity(keywords1: string[], keywords2: string[]): number {
  if (keywords1.length === 0 || keywords2.length === 0) return 0;
  
  const matchingKeywords = keywords1.filter(k1 => 
    keywords2.some(k2 => k1.includes(k2) || k2.includes(k1))
  );
  
  const keywordScore = matchingKeywords.length / Math.max(keywords1.length, keywords2.length);
  return keywordScore;
}

/**
 * Find the best matching logo file for a crew name
 */
function findBestLogoMatch(crewName: string): string | null {
  let bestMatch = '';
  let bestScore = 0;
  const minScore = 0.3; // Minimum similarity threshold
  
  // Extract crew name from filename (remove -Logo.extension)
  const extractCrewNameFromFile = (filename: string): string => {
    return filename
      .replace(/-Logo\.(jpeg|jpg|png|svg)$/i, '')
      .replace(/-/g, ' ');
  };
  
  for (const logoFile of availableLogoFiles) {
    const fileCrewName = extractCrewNameFromFile(logoFile);
    const score = calculateSimilarity(crewName, fileCrewName);
    
    if (score > bestScore && score >= minScore) {
      bestScore = score;
      bestMatch = logoFile;
    }
  }
  
  return bestMatch || null;
}

/**
 * Check abbreviations and alternative names
 */
function findByAbbreviation(crewName: string): string | null {
  const alternatives = abbreviationMapping[crewName] || [];
  
  for (const alt of alternatives) {
    const match = findBestLogoMatch(alt);
    if (match) return match;
  }
  
  // Also check if the crew name is an abbreviation of something else
  for (const [key, values] of Object.entries(abbreviationMapping)) {
    if (values.includes(crewName)) {
      const match = findBestLogoMatch(key);
      if (match) return match;
    }
  }
  
  return null;
}

// Function to generate logo filename from crew name (fallback)
export function getLogoFilename(crewName: string): string {
  // Convert crew name to filename format
  // Remove special characters, replace spaces with hyphens, add Logo suffix
  const cleanName = crewName
    .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special chars except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  
  return `${cleanName}-Logo`;
}

/**
 * Smart logo resolution with multiple fallback strategies
 */
export function getCrewLogoPath(crewName: string): string {
  console.log(`[getCrewLogoPath] Looking for logo for crew: "${crewName}"`);
  
  // Strategy 1: Check exact mapping
  if (exactLogoMapping[crewName]) {
    const mappedFilename = exactLogoMapping[crewName];
    console.log(`[getCrewLogoPath] Found exact mapping: ${crewName} -> ${mappedFilename}`);
    return `/images/crew/logos/${mappedFilename}`;
  }
  
  // Strategy 2: Fuzzy matching with available files
  const fuzzyMatch = findBestLogoMatch(crewName);
  if (fuzzyMatch) {
    console.log(`[getCrewLogoPath] Found fuzzy match: ${crewName} -> ${fuzzyMatch}`);
    return `/images/crew/logos/${fuzzyMatch}`;
  }
  
  // Strategy 3: Check abbreviations and alternative names
  const abbreviationMatch = findByAbbreviation(crewName);
  if (abbreviationMatch) {
    console.log(`[getCrewLogoPath] Found abbreviation match: ${crewName} -> ${abbreviationMatch}`);
    return `/images/crew/logos/${abbreviationMatch}`;
  }
  
  // Strategy 4: Legacy filename generation (for backward compatibility)
  const generatedFilename = getLogoFilename(crewName) + '.jpeg';
  if (availableLogoFiles.includes(generatedFilename)) {
    console.log(`[getCrewLogoPath] Found generated filename: ${crewName} -> ${generatedFilename}`);
    return `/images/crew/logos/${generatedFilename}`;
  }
  
  // Strategy 5: Default fallback
  console.log(`[getCrewLogoPath] No match found for "${crewName}", using default logo`);
  return `/images/crew/logos/default-crew-logo.svg`;
}

// Function to get logo path with fallback
export function getCrewLogoWithFallback(crewName: string): string {
  const logoPath = getCrewLogoPath(crewName);
  
  // You could add logic here to check if file exists
  // For now, we'll return the path and let the browser handle 404s
  return logoPath;
}

// Function to get default logo if crew logo doesn't exist
export function getDefaultCrewLogo(): string {
  return '/images/crew/logos/default-crew-logo.svg';
}

// Function to get default crew picture if crew picture doesn't exist
export function getDefaultCrewPicture(): string {
  return '/images/crew/photos/default-crew-picture.svg';
}

// Function to check if a crew has a custom logo (based on filename patterns)
export function hasCustomLogo(crewName: string): boolean {
  const filename = getLogoFilename(crewName);
  // This is a simple check - in production you might want to maintain a list
  // of crews that have logos or check file existence
  return filename !== 'default-crew-logo';
}

// Available crew photo files (to be updated as photos are added)
const availablePhotoFiles: string[] = [
  // Main photos (primary background images)
  '023RunClub-Photo.jpg',
  '033-Running-Crew-Photo.jpg',
  '080Tokyo-Photo.jpeg',
  '091RUNCrW-Photo.jpg',
  '1991RUNNERS-Photo.jpg',
  '24x7-Movement-Photo.jpg',
  '3Dash-Running-Photo.jpg',
  '442-Crew-Photo.jpg',
  '612run-St-Gallen-Photo.jpg',
  '612run-Zurich-Photo.jpg',
  '8000-Running-Photo.jpeg',
  'ACT-WOMENS-RUNning-Photo.jpg',
  'AMPMRC-Photo.jpg',
  'Abbotsford-Trail-Running-Club-Photo.jpg',
  'After-Work-Track-Club-Photo.jpeg',
  'Air-Up-There-Run-Crew-Photo.jpeg',
  'Akarunners-Photo.jpeg',
  'Allied-Shadow-Unit-Photo.jpg',
  'Amazing-Crew-Photo.jpg',
  'Amsterdam-Running-Club-Photo.jpeg',
  'Ankara-Kouyor-Photo.jpg',
  'Antwerp-Running-Crew-Photo.jpg',
  'Antz-Colony-RC-Photo.jpg',
  'Aphrodite-Running-Club-Photo.jpg',
  'Asian-Runners-Far-West-Photo.jpg',
  'Athletics-Far-East-Fukuoka-Photo.jpg',
  'Athletics-Far-East-Osaka-Photo.jpg',
  'Athletics-Far-East-Tokyo-Photo.jpg',
  'BR20-Photo.jpg',
  'BRC-Runners-Photo.jpg',
  'BXL-Run-Crew-Photo.jpg',
  'Bambas-Sports-Club-Photo.jpg',
  'Banana-Run-Club-Photo.jpg',
  'Be-More-You-Photo.jpg',
  'BeiRun-Crew-Photo.jpg',
  'Belgrade-Running-Club-Photo.jpg',
  'Belgrade-Urban-Running-Team-Photo.jpg',
  'Bergamo-Running-Photo.jpg',
  'Berlin-Braves-Photo.png',
  'Berlin-Track-Club-Photo.jpg',
  'BerlinBagels-Photo.jpg',
  'BiakBecicak-Photo.jpg',
  'Bislet-Running-Club-Photo.jpg',
  'Black-Roses-NYC-Photo.jpeg',
  'Black-Toes-Running-Team-Photo.jpg',
  'Blacklist-LA-Photo.jpg',
  'Bombay-Running-Crew-Photo.jpg',
  'Boramae-Track-Running-Crew-Photo.jpg',
  'Braamfie-Runners-Photo.jpg',
  'Brand-New-Waves-Running-Club-Photo.png',
  'Bridge-Runners-Dsseldorf-Photo.png',
  'Bridge-Runners-Photo.jpg',
  'Brisbane-Social-Run-Club-Photo.jpg',
  'Briza-Corre-Photo.jpg',
  'Brooklyn-Track-Club-Photo.jpg',
  'Brooks-Running-Squad-Photo.jpg',
  'Broward-Running-Society-Photo.jpg',
  'Brutal-Corre-Photo.jpg',
  'Bundang-Line-Running-Crew-Photo.jpg',
  'Bundang-Running-Crew-Photo.png',
  'CREWGHOST-Photo.jpeg',
  'CS-Running-Team-Photo.png',
  'Calma-Photo.jpeg',
  'Cani-Sciolti-Running-Team-Photo.png',
  'Capital-Crew-Belgrade-Photo.jpg',
  'Capital-Runners-Vilnius-Photo.png',
  'Ces-D-Avenida-Photo.jpg',
  'Chadol-Running-Club-Photo.jpg',
  'ChasingLights-Collective-Photo.jpg',
  'Chuncheon-Running-Crew-Photo.jpg',
  'Cl-Endorfina-Photo.jpg',
  'Claremont-Trotters-Photo.jpg',
  'Clique-Runners-Photo.jpg',
  'Common-Landscape-Photo.jpeg',
  'Community-Track-Club-Photo.jpg',
  'Concrete-Runners-Photo.jpg',
  'Conquer-Running-Crew-Photo.jpeg',
  'Cool-Runnings-Recreational-Club-Photo.jpg',
  'Correr-Lisboa-Photo.jpg',
  'Craiova-Running-Club-Photo.jpg',
  'Cria-Crew-Photo.jpg',
  'DNA-Photo.jpg',
  'DNH-Hill-Runners-Photo.jpg',
  'DOSE-Running-Photo.jpg',
  'Damn-Gang-Photo.jpg',
  'Dash-Running-Squad-Photo.jpg',
  'District-Running-Collective-Photo.jpg',
  'Dogani-Running-Crew-Photo.jpg',
  'Dongtan-Running-Crew-Photo.png',
  'Dorimcheon-Running-Crew-Photo.jpg',
  'Dromo-Run-Crew-Photo.jpg',
  'East-Laurier-Running-Club-Photo.jpg',
  'East-Van-Run-Crew-Photo.jpg',
  'Eastbound-Run-Crew-Photo.jpg',
  'Edgy-Running-Collective-Photo.jpg',
  'Eighty-Eight-Seoul-Running-Club-Photo.jpeg',
  'Elephant-Running-Club-Photo.jpeg',
  'Eternal-Eagles-Photo.jpg',
  'Exodus-Running-Community-Photo.jpg',
  'Fast-Breakfast-Club-Photo.jpeg',
  'Faster-Bastards-Photo.jpg',
  'FatBettyRun-Photo.jpg',
  'Flames-Barcelona-Photo.jpg',
  'Flowerboy-Run-Club-Photo.jpg',
  'Flying-Girls-Milano-Photo.jpeg',
  'FoodSport-Crew-Photo.jpg',
  'Force-Running-Club-Photo.jpg',
  'Founders-Running-Club-Photo.jpg',
  'Fragile-Running-Club-Photo.jpg',
  'Fraser-Street-Run-Club-Photo.jpg',
  'G10-Runners-Photo.jpg',
  'GRIT-USA-Photo.jpg',
  'Gazzelle-On-The-Road-Photo.jpg',
  'Geelong-Runners-Club-Photo.jpg',
  'Geoje-Running-Crew-Photo.jpg',
  'Ghetto-Run-Crew-Photo.jpg',
  'Gin-Running-Photo.png',
  'Godspeed-Running-Club-Photo.jpg',
  'GoldFinger-Track-Club-Photo.png',
  'Golden-Blocks-Photo.jpg',
  'Golden-Gate-Running-Club-Photo.jpg',
  'Gorilla-Running-Club-Photo.jpeg',
  'Gorky-Park-Runners-Photo.jpeg',
  'Happy-Feet-Photo.png',
  'Harbour-Runners-Photo.jpg',
  'HardTopRunClub-Photo.jpg',
  'Harlem-Run-Photo.jpg',
  'High-Park-Rogue-Runners-Photo.jpg',
  'Hills-Krew-Photo.png',
  'Hunter-Athletics-and-Recreation-Photo.jpg',
  'IPB-Runners-Photo.jpg',
  'Ice-Cream-Donut-Run-Club-Photo.jpg',
  'Islands-Wolfpack-Photo.jpg',
  'JakBrunners-Photo.jpg',
  'Jam-Sil-Running-Club-Photo.jpg',
  'Jeddah-Running-Collective-Photo.jpg',
  'Jumeirah-Johns-Running-Club-Photo.jpg',
  'KIIN-RUN-CLUB-Photo.jpg',
  'Keep-On-Keeping-On-Photo.jpg',
  'Kendos-Running-Crew-Photo.jpg',
  'Kings-Cross-Track-Club-Photo.jpg',
  'Kirribilli-Runners-Photo.jpg',
  'Komorebi-Running-Club-Photo.jpg',
  'Koreatown-Run-Club-Photo.jpg',
  'Kraft-Runners-Photo.jpg',
  'KyivRunners-Photo.jpg',
  'Kyserun-Krew-Photo.jpg',
  'LA-Rebels-Photo.png',
  'LAST-Photo.jpg',
  'LDN-Brunch-Club-Photo.jpg',
  'LaRunFam-Photo.jpeg',
  'Lactic-Acid-Junkies-Photo.jpeg',
  'LadyRushers-Photo.jpg',
  'Lazyboys-Track-Club-Photo.jpg',
  'Leptina-Runners-Photo.jpg',
  'LibuRUN-Photo.jpeg',
  'Lostboys-Track-Club-Photo.jpg',
  'Louisville-Race-Club-Photo.jpg',
  'Lyon-Running-Club-Photo.jpg',
  'MAP-Runners-Photo.jpg',
  'MNKS-Run-Crew-Photo.jpg',
  'MRC-Paris-Photo.jpg',
  'MTAR-Crew-Photo.jpg',
  'MadOne-Crew-Photo.jpg',
  'Manic-RC-Photo.jpg',
  'Mile-Run-Crew-Photo.jpg',
  'Mindset-Movement-Photo.jpg',
  'Mint-Running-Club-London-Photo.jpg',
  'Mint-Running-Club-St-Petersburg-Photo.jpg',
  'Modu-Running-Crew-Photo.jpg',
  'Moskva-River-Runners-Photo.jpg',
  'Movers-And-Pacers-Photo.jpg',
  'Munich-Running-Society-Photo.jpg',
  'Munk-Store-Runners-Photo.jpg',
  'MustLoveHills-RUNCREW-Photo.jpg',
  'Mutant-Photo.jpg',
  'NBRO-Running-Photo.jpg',
  'NDG-Run-Rite-Athletics-Club-Photo.jpg',
  'Negative-Split-Running-Tribe-Photo.jpg',
  'Neighbourhood-Track-Club-Photo.jpg',
  'NextGenDingmad-Photo.jpeg',
  'Night-Terrors-Run-Toronto-Photo.jpg',
  'No-Name-Crew-Barcelona-Photo.png',
  'No-Reason-Co-Photo.jpg',
  'No-Tag-Runners-Photo.jpg',
  'North-End-Runners-Photo.jpg',
  'November-Project-Montral-Photo.jpg',
  'Nowon-Running-Crew-Photo.jpeg',
  'Nuremberg-Track-Club-Photo.jpg',
  'OUTrun-Club-Photo.jpg',
  'OVD-Running-Club-Busan-Photo.jpg',
  'Odense-Running-Crew-Photo.jpg',
  'Old-Man-Run-Club-Photo.jpg',
  'Open-Mile-Bali-Photo.jpg',
  'Open-Run-Seoul-OPR-Photo.jpg',
  'Original-Propaganda-Athletic-Club-Photo.jpg',
  'Outra-F-Photo.jpg',
  'PIONEERS-Run-Crew-Photo.jpeg',
  'Pace-Pack-Runners-Photo.jpg',
  'Pacer-Track-Club-Photo.jpg',
  'Padang-Trail-Runners-Photo.jpg',
  'Palembang-Runners-Photo.jpeg',
  'Paris-Running-Club-Photo.jpg',
  'Parkdale-Roadrunners-Photo.jpg',
  'Patta-Running-Team-Amsterdam-Photo.jpg',
  'Penang-City-Running-Runners-Photo.jpg',
  'Prefontaine-Running-Squad-Photo.jpg',
  'Prism-Runners-Photo.jpg',
  'Private-Road-Running-Club-Photo.jpg',
  'Prts-Feu-Partez-Photo.jpg',
  'Pular-Athletic-Club-Photo.jpg',
  'Purple-Lights-Photo.jpg',
  'RC8K-Photo.jpg',
  'RIOT-Squad-Running-Photo.jpeg',
  'RUN4-Photo.jpg',
  'RUN89-Photo.jpg',
  'RUNAAR-Photo.jpg',
  'RUNDISTRIKT-Photo.jpg',
  'RUNMDN-Photo.jpg',
  'RUNderground-Photo.jpg',
  'RUSH-Photo.jpg',
  'RVMRVNNXRS-Photo.png',
  'Racoon-Runners-Photo.jpg',
  'Rainbow-Run-Photo.jpg',
  'Reaction-Photo.jpg',
  'Red-Run-Club-Tokyo-Photo.jpg',
  'Red-Snakes-Milano-Photo.jpg',
  'Retiro-Running-Photo.jpg',
  'RingRunRoad-Photo.png',
  'Riyadh-Urban-Runners-Photo.png',
  'Rochester-Road-Runners-Photo.jpg',
  'RockPacers-Photo.png',
  'Roebling-Runners-Photo.jpg',
  'Run-After-Work-Crew-Photo.jpg',
  'Run-Collective-Stockholm-Photo.jpg',
  'Run-Dem-Crew-Photo.jpg',
  'Run-Fleet-Hamburg-Photo.jpg',
  'Run-In-Bundang-RUNB-Photo.jpg',
  'Run-Jolly-Pace-Group-Photo.jpeg',
  'Run-Pack-Berlin-Photo.jpg',
  'Run-Squad-CGN-Photo.jpg',
  'Run-the-Tan-RUN-CLUB-Photo.jpg',
  'Run-with-us-Melbourne-Photo.jpg',
  'Run3-Crew-Photo.jpg',
  'Run365ph-Photo.jpg',
  'Runarchy-RC-Photo.jpg',
  'Rundamental-Photo.jpg',
  'Rungry-Project-Photo.jpg',
  'Runnersheep-Photo.jpg',
  'Running-Gooses-Photo.jpg',
  'Running-Junkies-Photo.jpg',
  'Running-Mafia-Photo.jpg',
  'Running-Rage-Photo.jpg',
  'Running-with-Kyunghee-Photo.jpg',
  'Rush-Runners-Photo.jpg',
  'SD-Runners-Photo.png',
  'SRC-Run-Crew-Photo.jpg',
  'Selari-Photo.jpg',
  'Seogwipo-RC-Photo.jpg',
  'Seongsu-Running-Crew-Photo.jpg',
  'Seuxphen-Running-Team-Photo.jpg',
  'Seven-Runners-Crew-Photo.jpg',
  'Social-Hour-Run-Club-Photo.jpg',
  'Social-Running-Crew-Seoul-Photo.jpg',
  'Soul-Run-Crew-Photo.jpg',
  'Souplesse-Photo.jpg',
  'South-Side-Run-Crew-Photo.jpg',
  'South-Striders-Munich-Photo.jpg',
  'Spartan-Sundays-Run-Club-Photo.jpg',
  'Special-Moment-Running-Crew-Photo.jpg',
  'Steveston-Run-Crew-Photo.jpg',
  'Still-Waters-Run-Deep-Photo.jpg',
  'Streets-101-Photo.jpg',
  'String-Track-Club-Photo.jpg',
  'Stumprunners-Photo.jpg',
  'Suicide-Hill-Racing-Club-Photo.jpg',
  'Swords-Warsaw-Photo.png',
  'Synergy-Running-Crew-Photo.jpg',
  'TC-Track-Core-Photo.jpg',
  'TEN-FIFTY-Photo.jpg',
  'TIRUN-Photo.jpeg',
  'TamoJunto-Photo.jpg',
  'Team-DLD-Photo.jpg',
  'Team-RunBO-Photo.jpg',
  'Team-Walid-Photo.jpg',
  'Temanlari-Photo.jpg',
  'Tempo-Running-Crew-Photo.jpg',
  'The-504th-Photo.jpg',
  'The-Corners-Run-Crew-Photo.jpg',
  'The-Fresh-Patterns-Collective-Photo.jpg',
  'The-Gang-Running-Club-Photo.jpg',
  'The-High-Panters-Photo.jpg',
  'The-Nine-Four-Photo.jpg',
  'The-Pack-Photo.jpg',
  'The-Republic-Photo.jpg',
  'Thesis-Run-Cru-Photo.jpg',
  'Three-Run-Two-Photo.jpeg',
  'Thunder-Light-Jakarta-Photo.jpg',
  'Tide-Runners-Hamburg-Photo.jpg',
  'Tokyo-Night-Run-Club-Photo.jpg',
  'Tortugas-Run-Club-Photo.jpg',
  'Track-East-Photo.jpg',
  'TrackMafia-Photo.jpg',
  'Trail-Maniacs-Bern-Photo.jpg',
  'Trail-Maniacs-Zurich-Photo.jpg',
  'Trail-Trash-Photo.jpg',
  'Twenty4Seven-Runners-Photo.jpg',
  'UCON-Daegu-Photo.jpg',
  'UCON-Seoul-Photo.jpg',
  'UDC-Okayama-Photo.jpg',
  'Umbali-Coasta-Rica-Photo.jpg',
  'Underground-Run-Club-Photo.jpeg',
  'Unnamed-Run-Crew-Photo.jpeg',
  'Unseen-Run-Club-Photo.jpg',
  'Urban-Run-Project-Photo.jpg',
  'Urban-Runners-Crew-Photo.jpg',
  'Urban-Running-Troupe-Photo.jpg',
  'Urban-Tribes-Photo.jpg',
  'Velvet-Runners-Photo.jpg',
  'Vie-Run-Photo.jpg',
  'Vienna-Running-Collective-Photo.jpg',
  'Viens-MAttraper-Photo.png',
  'Voltwomen-Photo.jpg',
  'WAUSAN30-Photo.jpg',
  'Wazup-Running-Club-Photo.jpg',
  'We-Run-Belfast-Photo.jpg',
  'We-Run-Clan-Photo.jpg',
  'We-Run-Jakarta-Photo.jpg',
  'We-Run-Uptown-Photo.jpg',
  'WeBeThirsty-Photo.jpg',
  'West-Way-Run-Crew-Photo.jpg',
  'Wild-Rose-Runners-Photo.jpg',
  'Wolfpack-Running-Chicago-Photo.jpg',
  'YAMAJO-Run-Crew-Photo.jpg',
  'Yoga-and-Sport-for-Refugees-Photo.jpg',
  'Youth-10-Runners-Photo.jpeg',
  'Zagreb-Runners-Photo.jpg',
  'de-Grce-Running-Collective-Photo.jpg',
  'delRun-Brum-Crewdel-Photo.jpg',
  'fierce-run-force-Photo.jpg',
  'stanbul-Kou-Kuvvetleri-Photo.jpg'
];

// Helper function to get crew photo path with fallback system
export function getCrewPhotoPath(crewName: string, photoType: 'main' | 'gallery' = 'main'): string {
  // Only try to find photos if we have available photos
  if (availablePhotoFiles.length === 0) {
    return getDefaultCrewPicture();
  }
  
  // Strategy 1: Try exact match in available photos
  const exactMatch = availablePhotoFiles.find(file => {
    const fileName = file.replace(/\.[^/.]+$/, ''); // Remove extension
    const normalizedFileName = normalizeString(fileName.replace(/-Photo.*$/, ''));
    const normalizedCrewName = normalizeString(crewName);
    return normalizedFileName === normalizedCrewName;
  });
  
  if (exactMatch) {
    return `/images/crew/photos/${exactMatch}`;
  }
  
  // Strategy 2: Try fuzzy matching (similar to logo matching)
  const fuzzyMatch = findBestPhotoMatch(crewName, photoType);
  if (fuzzyMatch) {
    return `/images/crew/photos/${fuzzyMatch}`;
  }
  
  // Strategy 3: Return default instead of generating invalid paths
  return getDefaultCrewPicture();
}

// Get all available photos for a specific crew
export function getAllCrewPhotos(crewName: string): string[] {
  const normalizedCrewName = normalizeString(crewName);
  
  const matchingPhotos = availablePhotoFiles.filter(file => {
    const fileName = file.replace(/\.[^/.]+$/, ''); // Remove extension
    const normalizedFileName = normalizeString(fileName.replace(/-Photo.*$/, ''));
    return normalizedFileName === normalizedCrewName;
  });
  
  return matchingPhotos.map(file => `/images/crew/photos/${file}`);
}

// Get crew photos by category (main, event, group, etc.)
export function getCrewPhotosByCategory(crewName: string, category?: string): string[] {
  const allPhotos = getAllCrewPhotos(crewName);
  
  if (!category) {
    return allPhotos;
  }
  
  return allPhotos.filter(photo => {
    const fileName = photo.split('/').pop() || '';
    return fileName.toLowerCase().includes(category.toLowerCase());
  });
}

// Get the best crew photo for display (prioritizes main, then most recent)
export function getBestCrewPhoto(crewName: string, mediaArray?: any[]): string {
  // First check Airtable media
  if (mediaArray && mediaArray.length > 0) {
    const crewPicture = mediaArray.find(m => 
      m.MediaType === 'Crew Picture' && m.Status === 'Published'
    );
    if (crewPicture && crewPicture.FileURL) {
      return crewPicture.FileURL;
    }
  }
  
  // Then check file system using fuzzy matching
  if (availablePhotoFiles.length > 0) {
    const bestMatch = findBestPhotoMatch(crewName, 'main');
    if (bestMatch) {
      return `/images/crew/photos/${bestMatch}`;
    }
  }
  
  // Fallback to default picture
  return getDefaultCrewPicture();
}

// Helper function to find best photo match using fuzzy matching
function findBestPhotoMatch(crewName: string, photoType: 'main' | 'gallery' = 'main'): string | null {
  if (availablePhotoFiles.length === 0) return null;
  
  const normalizedCrewName = normalizeString(crewName);
  const crewKeywords = extractKeywords(normalizedCrewName);
  
  let bestMatch = '';
  let bestScore = 0;
  const minScore = 0.3; // Lower threshold for better matching
  
  for (const file of availablePhotoFiles) {
    const fileName = file.replace(/\.[^/.]+$/, '').replace(/-Photo.*$/, '');
    const normalizedFileName = normalizeString(fileName);
    const fileKeywords = extractKeywords(normalizedFileName);
    
    const similarity = calculateKeywordSimilarity(crewKeywords, fileKeywords);
    
    // For main photos, prioritize files without suffixes
    if (photoType === 'main' && file.includes('-Photo.') && !file.includes('-Photo-')) {
      if (similarity > bestScore && similarity >= minScore) {
        bestScore = similarity;
        bestMatch = file;
      }
    } else if (similarity > bestScore && similarity >= minScore) {
      bestScore = similarity;
      bestMatch = file;
    }
  }
  
  return bestMatch || null;
}

// Enhanced function to get crew photo with Airtable media fallback
export function getCrewPhotoWithFallback(crewName: string, mediaArray?: any[]): string {
  return getBestCrewPhoto(crewName, mediaArray);
}

// Get crew photo gallery (all photos except the main one)
export function getCrewPhotoGallery(crewName: string, mediaArray?: any[]): string[] {
  const allPhotos: string[] = [];
  
  // Add Airtable media photos
  if (mediaArray && mediaArray.length > 0) {
    const galleryPhotos = mediaArray
      .filter(m => m.MediaType === 'Crew Picture' && m.Status === 'Published')
      .map(m => m.FileURL)
      .filter(url => url);
    allPhotos.push(...galleryPhotos);
  }
  
  // Add file system photos
  const fileSystemPhotos = getAllCrewPhotos(crewName);
  allPhotos.push(...fileSystemPhotos);
  
  // Remove duplicates and main photo
  const mainPhoto = getBestCrewPhoto(crewName, mediaArray);
  const uniquePhotos = Array.from(new Set(allPhotos));
  
  return uniquePhotos.filter(photo => photo !== mainPhoto);
}

// Get a random crew photo for hero backgrounds
export function getRandomCrewPhoto(): string {
  if (availablePhotoFiles.length === 0) {
    return '/images/crew/photos/default-crew-picture.svg';
  }
  
  const randomIndex = Math.floor(Math.random() * availablePhotoFiles.length);
  const randomPhoto = availablePhotoFiles[randomIndex];
  
  return `/images/crew/photos/${randomPhoto}`;
}