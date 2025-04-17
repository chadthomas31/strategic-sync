import fs from 'fs';
import path from 'path';

// Define the cache entry interface
export interface CacheEntry {
  content: string;
  timestamp: number;
  provider?: string;
}

// Define the cache structure
interface Cache {
  [key: string]: CacheEntry;
}

// Path to the cache file
const CACHE_FILE_PATH = path.join(process.cwd(), 'data', 'content-cache.json');

// Ensure the data directory exists
const ensureDataDirectory = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Load the cache from disk
const loadCache = (): Cache => {
  try {
    ensureDataDirectory();
    if (fs.existsSync(CACHE_FILE_PATH)) {
      const data = fs.readFileSync(CACHE_FILE_PATH, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading cache:', error);
  }
  return {};
};

// Save the cache to disk
const saveCache = (cache: Cache) => {
  try {
    ensureDataDirectory();
    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(cache, null, 2));
  } catch (error) {
    console.error('Error saving cache:', error);
  }
};

/**
 * Get a value from the cache by key
 * @param key The cache key
 * @returns The cache entry or null if not found
 */
export async function getCache(key: string): Promise<CacheEntry | null> {
  const cache = loadCache();
  return cache[key] || null;
}

/**
 * Set a value in the cache by key
 * @param key The cache key
 * @param entry The cache entry to store
 */
export async function setCache(key: string, entry: CacheEntry): Promise<void> {
  const cache = loadCache();
  cache[key] = entry;
  saveCache(cache);
}

/**
 * Clear expired entries from the cache
 * @param maxAgeDays Maximum age in days (default: 7)
 */
export async function clearExpiredCache(maxAgeDays: number = 7): Promise<void> {
  const cache = loadCache();
  const now = Date.now();
  const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000;

  for (const [key, entry] of Object.entries(cache)) {
    if (now - entry.timestamp > maxAgeMs) {
      delete cache[key];
    }
  }

  saveCache(cache);
}

// Default export with all functions
export default {
  getCache,
  setCache,
  clearExpiredCache
}; 