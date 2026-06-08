import type { GitHubRepo } from './types';

// Use relative path: works on Vercel (serverless) and local (vite proxy)
const API_BASE = '/api';

export async function fetchTrendingRepos(
  timeRange: 'daily' | 'weekly' | 'monthly' = 'daily',
  language?: string | null,
  page: number = 1
): Promise<{ repos: GitHubRepo[]; totalCount: number }> {
  const date = getDateRange(timeRange);
  const langQuery = language ? `language:${language}` : '';
  // Use `pushed:>date` (recently active) instead of `created:>date` (newly created)
  // This matches GitHub's actual trending behavior: active repos gaining stars
  const query = `stars:>100 pushed:>${date} ${langQuery}`.trim();

  const response = await fetch(
    `${API_BASE}/search?q=${encodeURIComponent(query)}&sort=stars&order=desc&page=${page}&per_page=20`
  );

  if (!response.ok) {
    throw new Error('加载失败，请重试');
  }

  const data = await response.json();
  return {
    repos: data.items,
    totalCount: data.total_count,
  };
}

export async function fetchTrendingByTopic(
  topic: string,
  page: number = 1
): Promise<{ repos: GitHubRepo[]; totalCount: number }> {
  const response = await fetch(
    `${API_BASE}/search?q=topic:${topic}&sort=stars&order=desc&page=${page}&per_page=20`
  );

  if (!response.ok) {
    throw new Error('加载失败，请重试');
  }

  const data = await response.json();
  return {
    repos: data.items,
    totalCount: data.total_count,
  };
}

export async function fetchSearchRepos(
  query: string,
  language?: string | null,
  page: number = 1
): Promise<{ repos: GitHubRepo[]; totalCount: number }> {
  const langQuery = language ? `language:${language}` : '';
  const q = `${query} stars:>10 ${langQuery}`.trim();

  const response = await fetch(
    `${API_BASE}/search?q=${encodeURIComponent(q)}&sort=stars&order=desc&page=${page}&per_page=20`
  );

  if (!response.ok) {
    throw new Error('搜索失败，请重试');
  }

  const data = await response.json();
  return {
    repos: data.items,
    totalCount: data.total_count,
  };
}

function getDateRange(timeRange: 'daily' | 'weekly' | 'monthly'): string {
  const date = new Date();
  switch (timeRange) {
    case 'daily':
      // Last 3 days: shows repos actively trending right now
      date.setDate(date.getDate() - 3);
      break;
    case 'weekly':
      // Last 7 days: weekly trending
      date.setDate(date.getDate() - 7);
      break;
    case 'monthly':
      // Last 30 days: monthly trending
      date.setDate(date.getDate() - 30);
      break;
  }
  return date.toISOString().split('T')[0];
}

export const LANGUAGES = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'Go',
  'Rust',
  'C++',
  'C',
  'C#',
  'PHP',
  'Ruby',
  'Swift',
  'Kotlin',
  'Dart',
  'Lua',
  'Zig',
  'Elixir',
  'Haskell',
  'Scala',
  'R',
];

export const TOPICS = [
  'machine-learning',
  'web-development',
  'mobile-app',
  'devtools',
  'ai',
  'blockchain',
  'game-development',
  'data-science',
  'security',
  'cli',
  'api',
  'database',
];
