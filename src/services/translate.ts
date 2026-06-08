// Translation service using MyMemory API (free, no key required)
// Includes localStorage caching to avoid repeated API calls

const CACHE_KEY = 'github-trending-translations';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CacheEntry {
  text: string;
  timestamp: number;
}

type Cache = Record<string, CacheEntry>;

function getCache(): Cache {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return {};
    const cache: Cache = JSON.parse(raw);
    // Clean expired entries
    const now = Date.now();
    const cleaned: Cache = {};
    for (const [key, entry] of Object.entries(cache)) {
      if (now - entry.timestamp < CACHE_EXPIRY) {
        cleaned[key] = entry;
      }
    }
    return cleaned;
  } catch {
    return {};
  }
}

function saveCache(cache: Cache): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Storage full, clear old entries
    localStorage.removeItem(CACHE_KEY);
  }
}

function getCacheKey(text: string): string {
  return text.slice(0, 100); // Use first 100 chars as key
}

export async function translateToChinese(text: string): Promise<string> {
  if (!text || text.trim().length === 0) return text;

  const cacheKey = getCacheKey(text);
  const cache = getCache();

  // Check cache first
  if (cache[cacheKey]) {
    return cache[cacheKey].text;
  }

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|zh-CN`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Translation API error');
    }

    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      const translated = data.responseData.translatedText;

      // Save to cache
      cache[cacheKey] = { text: translated, timestamp: Date.now() };
      saveCache(cache);

      return translated;
    }

    return text;
  } catch {
    // On error, return original text
    return text;
  }
}

// Batch translate multiple texts (with concurrency limit)
export async function translateBatch(texts: string[], concurrency = 3): Promise<string[]> {
  const results: string[] = new Array(texts.length).fill('');
  let index = 0;

  async function worker() {
    while (index < texts.length) {
      const i = index++;
      results[i] = await translateToChinese(texts[i]);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, texts.length) }, () => worker());
  await Promise.all(workers);

  return results;
}
