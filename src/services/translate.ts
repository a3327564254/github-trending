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
  // AI & ML
  'machine learning': '机器学习',
  'deep learning': '深度学习',
  'artificial intelligence': '人工智能',
  'neural network': '神经网络',
  'natural language processing': '自然语言处理',
  'computer vision': '计算机视觉',
  'generative ai': '生成式 AI',
  'large language model': '大语言模型',
  'llm': '大语言模型',
  'gpt': 'GPT',
  'transformer': 'Transformer',
  'diffusion model': '扩散模型',
  'reinforcement learning': '强化学习',
  'data science': '数据科学',
  'data analysis': '数据分析',
  'data visualization': '数据可视化',

  // Web Development
  'web framework': 'Web 框架',
  'web development': 'Web 开发',
  'frontend': '前端',
  'backend': '后端',
  'full stack': '全栈',
  'fullstack': '全栈',
  'rest api': 'REST API',
  'graphql': 'GraphQL',
  'websocket': 'WebSocket',
  'http': 'HTTP',
  'https': 'HTTPS',
  'cors': '跨域资源共享',
  'authentication': '认证',
  'authorization': '授权',
  'oauth': 'OAuth 认证',
  'jwt': 'JWT 令牌',
  'session': '会话',
  'cookie': 'Cookie',

  // Programming
  'programming language': '编程语言',
  'programming': '编程',
  'open source': '开源',
  'open-source': '开源',
  'command line': '命令行',
  'command-line': '命令行',
  'cli': '命令行工具',
  'terminal': '终端',
  'shell': 'Shell',
  'database': '数据库',
  'sql': 'SQL',
  'nosql': 'NoSQL',
  'api': 'API 接口',
  'sdk': 'SDK',
  'ide': 'IDE',
  'editor': '编辑器',
  'code editor': '代码编辑器',
  'developer': '开发者',
  'development': '开发',
  'tutorial': '教程',
  'documentation': '文档',
  'library': '库',
  'framework': '框架',
  'tool': '工具',
  'tools': '工具',
  'plugin': '插件',
  'plugins': '插件',
  'extension': '扩展',
  'extensions': '扩展',
  'template': '模板',
  'templates': '模板',
  'boilerplate': '样板',
  'starter': '入门',
  'starter kit': '入门套件',
  'example': '示例',
  'examples': '示例',
  'demo': '演示',
  'sample': '示例',
  'samples': '示例',
  'collection': '集合',
  'awesome': '精选',
  'best practices': '最佳实践',
  'design pattern': '设计模式',
  'architecture': '架构',
  'refactoring': '重构',
  'migration': '迁移',

  // DevOps & Cloud
  'microservice': '微服务',
  'microservices': '微服务',
  'container': '容器',
  'containers': '容器',
  'containerization': '容器化',
  'deployment': '部署',
  'deploy': '部署',
  'ci/cd': 'CI/CD',
  'continuous integration': '持续集成',
  'continuous deployment': '持续部署',
  'devops': 'DevOps',
  'cloud': '云',
  'serverless': '无服务器',
  'infrastructure': '基础设施',
  'monitoring': '监控',
  'logging': '日志',
  'observability': '可观测性',

  // Testing
  'testing': '测试',
  'unit testing': '单元测试',
  'integration testing': '集成测试',
  'end-to-end testing': '端到端测试',
  'e2e testing': '端到端测试',
  'test automation': '测试自动化',
  'debugging': '调试',
  'profiling': '性能分析',

  // Security
  'security': '安全',
  'cybersecurity': '网络安全',
  'vulnerability': '漏洞',
  'penetration testing': '渗透测试',
  'encryption': '加密',
  'decryption': '解密',
  'firewall': '防火墙',
  'malware': '恶意软件',
  'phishing': '钓鱼',

  // Blockchain & Web3
  'blockchain': '区块链',
  'cryptocurrency': '加密货币',
  'crypto': '加密货币',
  'bitcoin': '比特币',
  'ethereum': '以太坊',
  'smart contract': '智能合约',
  'web3': 'Web3',
  'nft': 'NFT',
  'defi': 'DeFi',
  'decentralized': '去中心化',

  // Game & Graphics
  'game': '游戏',
  'game development': '游戏开发',
  'game engine': '游戏引擎',
  '3d': '3D',
  '2d': '2D',
  'graphics': '图形',
  'rendering': '渲染',
  'shader': '着色器',
  'animation': '动画',
  'pixel art': '像素艺术',

  // Applications
  'mobile app': '移动应用',
  'mobile application': '移动应用',
  'desktop app': '桌面应用',
  'desktop application': '桌面应用',
  'web app': 'Web 应用',
  'web application': 'Web 应用',
  'cross-platform': '跨平台',
  'cross platform': '跨平台',
  'progressive web app': '渐进式 Web 应用',
  'pwa': 'PWA',

  // Features
  'real-time': '实时',
  'realtime': '实时',
  'real time': '实时',
  'async': '异步',
  'synchronous': '同步',
  'concurrent': '并发',
  'parallel': '并行',
  'distributed': '分布式',
  'scalable': '可扩展',
  'high performance': '高性能',
  'lightweight': '轻量级',
  'fast': '快速',
  'simple': '简单',
  'easy': '简单',
  'modern': '现代',
  'beautiful': '美观',
  'responsive': '响应式',
  'accessible': '无障碍',
  'a11y': '无障碍',
  'i18n': '国际化',
  'internationalization': '国际化',
  'localization': '本地化',
  'dark mode': '深色模式',
  'dark theme': '深色主题',
  'light theme': '浅色主题',
  'theme': '主题',
  'theming': '主题化',
  'customizable': '可定制',
  'configurable': '可配置',
  'flexible': '灵活',
  'extensible': '可扩展',
  'modular': '模块化',
  'pluggable': '可插拔',

  // Common verbs & phrases
  'build': '构建',
  'create': '创建',
  'generate': '生成',
  'manage': '管理',
  'process': '处理',
  'automate': '自动化',
  'optimize': '优化',
  'improve': '改进',
  'enhance': '增强',
  'simplify': '简化',
  'streamline': '精简',
  'integrate': '集成',
  'connect': '连接',
  'sync': '同步',
  'share': '分享',
  'collaborate': '协作',
  'track': '追踪',
  'monitor': '监控',
  'analyze': '分析',
  'visualize': '可视化',
  'explore': '探索',
  'discover': '发现',
  'learn': '学习',
  'practice': '练习',
  'implement': '实现',
  'execute': '执行',
  'run': '运行',
  'launch': '启动',
  'install': '安装',
  'setup': '设置',
  'configure': '配置',
  'customize': '自定义',
  'extend': '扩展',
  'expand': '扩展',
  'scale': '扩展',
  'migrate': '迁移',
  'upgrade': '升级',
  'update': '更新',
  'maintain': '维护',
  'enable': '启用',
  'disable': '禁用',
  'allow': '允许',
  'block': '阻止',
  'prevent': '防止',
  'protect': '保护',
  'secure': '安全',
  'verify': '验证',
  'validate': '验证',
  'check': '检查',
  'test': '测试',
  'debug': '调试',
  'fix': '修复',
  'repair': '修复',
  'solve': '解决',
  'resolve': '解决',
  'include': '包含',
  'contain': '包含',
  'offer': '提供',
  'feature': '功能',
  'features': '功能',
  'functionality': '功能',
  'capability': '能力',
  'capabilities': '能力',
  'performance': '性能',
  'efficiency': '效率',
  'reliability': '可靠性',
  'stability': '稳定性',
  'compatibility': '兼容性',
  'interoperability': '互操作性',
  'usability': '易用性',
  'accessibility': '无障碍性',
  'maintainability': '可维护性',
  'readability': '可读性',
  'portability': '可移植性',

  // Frameworks & Libraries
  'react': 'React',
  'vue': 'Vue',
  'vue.js': 'Vue.js',
  'angular': 'Angular',
  'svelte': 'Svelte',
  'next.js': 'Next.js',
  'nextjs': 'Next.js',
  'nuxt': 'Nuxt',
  'nuxt.js': 'Nuxt.js',
  'gatsby': 'Gatsby',
  'remix': 'Remix',
  'astro': 'Astro',
  'solid': 'Solid',
  'solidjs': 'SolidJS',
  'preact': 'Preact',
  'jquery': 'jQuery',
  'bootstrap': 'Bootstrap',
  'tailwind': 'Tailwind',
  'tailwindcss': 'Tailwind CSS',
  'material ui': 'Material UI',
  'mui': 'MUI',
  'antd': 'Ant Design',
  'ant design': 'Ant Design',
  'chakra ui': 'Chakra UI',
  'shadcn': 'shadcn',
  'radix': 'Radix',
  'typescript': 'TypeScript',
  'javascript': 'JavaScript',
  'python': 'Python',
  'rust': 'Rust',
  'go': 'Go',
  'golang': 'Go',
  'java': 'Java',
  'c++': 'C++',
  'c#': 'C#',
  'csharp': 'C#',
  'swift': 'Swift',
  'kotlin': 'Kotlin',
  'dart': 'Dart',
  'ruby': 'Ruby',
  'php': 'PHP',
  'perl': 'Perl',
  'scala': 'Scala',
  'haskell': 'Haskell',
  'elixir': 'Elixir',
  'clojure': 'Clojure',
  'r': 'R',
  'julia': 'Julia',
  'lua': 'Lua',
  'zig': 'Zig',
  'nim': 'Nim',
  'ocaml': 'OCaml',
  'erlang': 'Erlang',
  'flutter': 'Flutter',
  'react native': 'React Native',
  'expo': 'Expo',
  'ionic': 'Ionic',
  'capacitor': 'Capacitor',
  'electron': 'Electron',
  'tauri': 'Tauri',
  'docker': 'Docker',
  'kubernetes': 'Kubernetes',
  'k8s': 'K8s',
  'terraform': 'Terraform',
  'ansible': 'Ansible',
  'jenkins': 'Jenkins',
  'github actions': 'GitHub Actions',
  'gitlab': 'GitLab',
  'linux': 'Linux',
  'windows': 'Windows',
  'macos': 'macOS',
  'android': 'Android',
  'ios': 'iOS',
  'node.js': 'Node.js',
  'nodejs': 'Node.js',
  'deno': 'Deno',
  'bun': 'Bun',
  'express': 'Express',
  'fastify': 'Fastify',
  'koa': 'Koa',
  'nestjs': 'NestJS',
  'django': 'Django',
  'flask': 'Flask',
  'fastapi': 'FastAPI',
  'spring': 'Spring',
  'spring boot': 'Spring Boot',
  'laravel': 'Laravel',
  'rails': 'Rails',
  'ruby on rails': 'Ruby on Rails',
  'asp.net': 'ASP.NET',
  'dotnet': '.NET',
  '.net': '.NET',
  'mongodb': 'MongoDB',
  'postgresql': 'PostgreSQL',
  'mysql': 'MySQL',
  'redis': 'Redis',
  'elasticsearch': 'Elasticsearch',
  'sqlite': 'SQLite',
  'firebase': 'Firebase',
  'supabase': 'Supabase',
  'prisma': 'Prisma',
  'drizzle': 'Drizzle',
  'sequelize': 'Sequelize',
  'typeorm': 'TypeORM',
  'webpack': 'webpack',
  'vite': 'Vite',
  'esbuild': 'esbuild',
  'rollup': 'Rollup',
  'parcel': 'Parcel',
  'turbopack': 'Turbopack',
  'babel': 'Babel',
  'eslint': 'ESLint',
  'prettier': 'Prettier',
  'jest': 'Jest',
  'vitest': 'Vitest',
  'mocha': 'Mocha',
  'cypress': 'Cypress',
  'playwright': 'Playwright',
  'puppeteer': 'Puppeteer',
  'storybook': 'Storybook',
  'figma': 'Figma',
  'sketch': 'Sketch',
  'photoshop': 'Photoshop',
  'illustrator': 'Illustrator',
  'blender': 'Blender',
  'unity': 'Unity',
  'unreal': 'Unreal',
  'godot': 'Godot',

  // Common descriptions
  'a collection of': '一个集合',
  'a set of': '一套',
  'a list of': '一个列表',
  'a guide to': '指南',
  'a tutorial on': '教程',
  'an introduction to': '入门介绍',
  'a tool for': '一个工具',
  'a library for': '一个库',
  'a framework for': '一个框架',
  'a template for': '一个模板',
  'a starter for': '一个入门项目',
  'a boilerplate for': '一个样板',
  'an alternative to': '替代方案',
  'a replacement for': '替代品',
  'built with': '使用...构建',
  'powered by': '由...驱动',
  'written in': '使用...编写',
  'based on': '基于',
  'inspired by': '受...启发',
  'compatible with': '兼容',
  'supports': '支持',
  'requires': '需要',
  'depends on': '依赖',
  'implements': '实现',
  'provides': '提供',
  'includes': '包含',
  'contains': '包含',
  'offers': '提供',
  'allows': '允许',
  'enables': '启用',
  'helps': '帮助',
  'makes': '使',
  'easy to use': '易于使用',
  'easy to set up': '易于设置',
  'easy to install': '易于安装',
  'no dependencies': '无依赖',
  'zero dependencies': '零依赖',
  'minimal dependencies': '最小依赖',
  'fast and lightweight': '快速且轻量',
  'production ready': '生产就绪',
  'production-ready': '生产就绪',
  'battle tested': '经过实战检验',
  'battle-tested': '经过实战检验',
  'well documented': '文档完善',
  'well-documented': '文档完善',
  'actively maintained': '积极维护',
  'free and open source': '免费开源',
  'mit license': 'MIT 许可证',
  'apache license': 'Apache 许可证',
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
