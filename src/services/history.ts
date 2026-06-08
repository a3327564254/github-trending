import type { GitHubRepo } from '../types';

const STORAGE_KEY = 'github-trending-history';
const MAX_ITEMS = 50;

export function getHistory(): GitHubRepo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToHistory(repo: GitHubRepo): void {
  const history = getHistory().filter((r) => r.id !== repo.id);
  history.unshift(repo);
  if (history.length > MAX_ITEMS) history.pop();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
