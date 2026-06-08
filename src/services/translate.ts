// Translation service with multiple fallback APIs and caching

const CACHE_KEY = 'github-trending-translations';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CacheEntry {
  text: string;
  timestamp: number;
}

type Cache = Record<string, CacheEntry>;

// Common programming terms dictionary (fallback)
const DICT: Record<string, string> = {
  'machine learning': '机器学习',
  'deep learning': '深度学习',
  'artificial intelligence': '人工智能',
  'neural network': '神经网络',
  'web framework': 'Web 框架',
  'programming language': '编程语言',
  'open source': '开源',
  'command line': '命令行',
  'database': '数据库',
  'api': 'API 接口',
  'frontend': '前端',
  'backend': '后端',
  'full stack': '全栈',
  'developer': '开发者',
  'development': '开发',
  'tutorial': '教程',
  'documentation': '文档',
  'library': '库',
  'framework': '框架',
  'tool': '工具',
  'plugin': '插件',
  'extension': '扩展',
  'template': '模板',
  'boilerplate': '样板',
  'starter': '入门',
  'example': '示例',
  'demo': '演示',
  'sample': '示例',
  'collection': '集合',
  'awesome': '精选',
  'best practices': '最佳实践',
  'design pattern': '设计模式',
  'microservice': '微服务',
  'container': '容器',
  'deployment': '部署',
  'testing': '测试',
  'debugging': '调试',
  'performance': '性能',
  'security': '安全',
  'authentication': '认证',
  'authorization': '授权',
  'encryption': '加密',
  'blockchain': '区块链',
  'cryptocurrency': '加密货币',
  'game': '游戏',
  'mobile app': '移动应用',
  'desktop app': '桌面应用',
  'web app': 'Web 应用',
  'react': 'React',
  'vue': 'Vue',
  'angular': 'Angular',
  'svelte': 'Svelte',
  'next.js': 'Next.js',
  'nuxt': 'Nuxt',
  'typescript': 'TypeScript',
  'javascript': 'JavaScript',
  'python': 'Python',
  'rust': 'Rust',
  'go': 'Go',
  'java': 'Java',
  'c++': 'C++',
  'swift': 'Swift',
  'kotlin': 'Kotlin',
  'dart': 'Dart',
  'flutter': 'Flutter',
  'react native': 'React Native',
  'electron': 'Electron',
  'docker': 'Docker',
  'kubernetes': 'Kubernetes',
  'linux': 'Linux',
  'windows': 'Windows',
  'macos': 'macOS',
  'android': 'Android',
  'ios': 'iOS',
};

function getCache(): Cache {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return {};
    const cache: Cache = JSON.parse(raw);
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
    localStorage.removeItem(CACHE_KEY);
  }
}

function getCacheKey(text: string): string {
  return text.slice(0, 100);
}

function dictTranslate(text: string): string | null {
  const lower = text.toLowerCase().trim();
  // Exact match
  if (DICT[lower]) return DICT[lower];
  // Partial match - check if text contains any dictionary term
  for (const [en, zh] of Object.entries(DICT)) {
    if (lower.includes(en)) {
      return text.replace(new RegExp(en, 'gi'), zh);
    }
  }
  return null;
}

async function fetchWithTimeout(url: string, timeout = 5000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    return response;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

export async function translateToChinese(text: string): Promise<string> {
  if (!text || text.trim().length === 0) return text;

  const cacheKey = getCacheKey(text);
  const cache = getCache();

  // Check cache first
  if (cache[cacheKey]) {
    return cache[cacheKey].text;
  }

  // Try dictionary fallback first (instant, no API call)
  const dictResult = dictTranslate(text);
  if (dictResult) {
    cache[cacheKey] = { text: dictResult, timestamp: Date.now() };
    saveCache(cache);
    return dictResult;
  }

  // Try translation API (via proxy to avoid CORS/rate limit issues)
  try {
    const url = `/api/translate?q=${encodeURIComponent(text)}`;
    const response = await fetchWithTimeout(url, 10000);

    if (response.ok) {
      const data = await response.json();
      if (data.responseStatus === 200 && data.responseData?.translatedText) {
        const translated = data.responseData.translatedText;
        // Check if translation is actually different (not just returning original)
        if (translated.toLowerCase() !== text.toLowerCase()) {
          cache[cacheKey] = { text: translated, timestamp: Date.now() };
          saveCache(cache);
          return translated;
        }
      }
    }
  } catch {
    // API failed, continue to fallback
  }

  // Return original text if all translation attempts fail
  return text;
}

export function clearTranslationCache(): void {
  localStorage.removeItem(CACHE_KEY);
}

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
