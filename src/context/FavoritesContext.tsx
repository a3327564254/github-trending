import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { GitHubRepo } from '../types';
import { getFavorites, addFavorite, removeFavorite, isFavorite } from '../services/favorites';

interface FavoritesContextType {
  favorites: GitHubRepo[];
  toggleFavorite: (repo: GitHubRepo) => void;
  isFavorite: (repoId: number) => boolean;
  showFavorites: boolean;
  setShowFavorites: (show: boolean) => void;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<GitHubRepo[]>(getFavorites);
  const [showFavorites, setShowFavorites] = useState(false);

  const toggleFavorite = useCallback((repo: GitHubRepo) => {
    if (isFavorite(repo.id)) {
      removeFavorite(repo.id);
    } else {
      addFavorite(repo);
    }
    setFavorites(getFavorites());
  }, []);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'github-trending-favorites') {
        setFavorites(getFavorites());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite, showFavorites, setShowFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
