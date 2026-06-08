import type { GitHubRepo } from '../types';

const STORAGE_KEY = 'github-trending-favorites';

export function getFavorites(): GitHubRepo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addFavorite(repo: GitHubRepo): void {
  const favorites = getFavorites();
  if (!favorites.some((f) => f.id === repo.id)) {
    favorites.unshift(repo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }
}

export function removeFavorite(repoId: number): void {
  const favorites = getFavorites().filter((f) => f.id !== repoId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

export function isFavorite(repoId: number): boolean {
  return getFavorites().some((f) => f.id === repoId);
}
