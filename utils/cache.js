/**
 * Simple in-memory cache utility for API responses
 * Helps reduce API calls during build time and improves performance
 */

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const cache = new Map();

/**
 * Get a value from the cache
 * @param {string} key - Cache key
 * @returns {any|null} Cached value or null if not found/expired
 */
export const getCachedValue = (key) => {
  if (!key) return null;
  
  const cachedItem = cache.get(key);
  if (!cachedItem) return null;
  
  const { value, timestamp } = cachedItem;
  const now = Date.now();
  
  // Check if cache is expired
  if (now - timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  
  return value;
};

/**
 * Set a value in the cache
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {number} duration - Custom cache duration in milliseconds (optional)
 */
export const setCachedValue = (key, value, duration = CACHE_DURATION) => {
  if (!key) return;
  
  cache.set(key, {
    value,
    timestamp: Date.now(),
    duration,
  });
};

/**
 * Clear a specific item from the cache
 * @param {string} key - Cache key to clear
 */
export const clearCacheItem = (key) => {
  if (!key) return;
  cache.delete(key);
};

/**
 * Clear all items from the cache
 */
export const clearCache = () => {
  cache.clear();
};

/**
 * Wrap an async function with caching
 * @param {Function} fn - Async function to wrap
 * @param {string} key - Cache key
 * @param {number} duration - Custom cache duration in milliseconds (optional)
 * @returns {Promise<any>} - Result of the function call (cached or fresh)
 */
export const withCache = async (fn, key, duration = CACHE_DURATION) => {
  // Try to get from cache first
  const cachedResult = getCachedValue(key);
  if (cachedResult !== null) {
    return cachedResult;
  }
  
  // If not in cache, call the function
  try {
    const result = await fn();
    setCachedValue(key, result, duration);
    return result;
  } catch (error) {
    // Don't cache errors
    throw error;
  }
};

/**
 * Get cache statistics
 * @returns {Object} Cache statistics
 */
export const getCacheStats = () => {
  const now = Date.now();
  let activeItems = 0;
  let expiredItems = 0;
  
  cache.forEach(({ timestamp }) => {
    if (now - timestamp <= CACHE_DURATION) {
      activeItems++;
    } else {
      expiredItems++;
    }
  });
  
  return {
    totalItems: cache.size,
    activeItems,
    expiredItems,
  };
};

export default {
  get: getCachedValue,
  set: setCachedValue,
  clear: clearCache,
  clearItem: clearCacheItem,
  withCache,
  getStats: getCacheStats,
};