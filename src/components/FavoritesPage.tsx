import { X, BookmarkSimple } from '@phosphor-icons/react';
import { useFavorites } from '../context/FavoritesContext';
import { RepoCard } from './RepoCard';

export function FavoritesPage() {
  const { favorites, showFavorites, setShowFavorites } = useFavorites();

  if (!showFavorites) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm pt-16 pb-8 px-4">
      <div className="relative w-full max-w-7xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-background)] px-6 py-4 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <BookmarkSimple size={20} weight="fill" className="text-[var(--color-accent)]" />
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
              我的收藏
            </h2>
            <span className="rounded-full bg-[var(--color-accent-dim)] px-2 py-0.5 font-mono text-[11px] text-[var(--color-accent)]">
              {favorites.length}
            </span>
          </div>
          <button
            onClick={() => setShowFavorites(false)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] transition-all tactile-press"
            aria-label="关闭"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {favorites.map((repo, index) => (
                <RepoCard key={repo.id} repo={repo} index={index} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <BookmarkSimple size={48} className="mx-auto mb-4 text-[var(--color-text-muted)]" />
              <p className="text-lg text-[var(--color-text-secondary)]">还没有收藏</p>
              <p className="mt-2 font-mono text-xs text-[var(--color-text-muted)]">
                点击仓库卡片上的收藏按钮即可添加
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
