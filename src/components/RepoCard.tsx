import { Star, GitFork, DownloadSimple, BookmarkSimple, ShareNetwork } from '@phosphor-icons/react';
import type { GitHubRepo } from '../types';
import { TranslatedText } from './TranslatedText';
import { useFavorites } from '../context/FavoritesContext';
import { useState } from 'react';

interface RepoCardProps {
  repo: GitHubRepo;
  index: number;
}

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Lua: '#000080',
  Zig: '#ec915c',
  Elixir: '#6e4a7e',
  Haskell: '#5e5086',
  Scala: '#c22d40',
  R: '#198CE7',
};

export function RepoCard({ repo, index }: RepoCardProps) {
  const { toggleFavorite, isFavorite: checkIsFavorite } = useFavorites();
  const [showCopied, setShowCopied] = useState(false);
  const isFav = checkIsFavorite(repo.id);

  const formatStars = (count: number): string => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  const langColor = repo.language ? LANGUAGE_COLORS[repo.language] || '#71717a' : undefined;
  const delayClass = `stagger-${Math.min(index + 1, 9)}`;
  const releaseUrl = `${repo.html_url}/releases`;

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(repo);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(repo.html_url);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 1500);
    } catch {
      // Fallback
    }
  };

  return (
    <div
      className={`animate-slide-up ${delayClass} group flex flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-4 sm:p-5 transition-all duration-200 hover:border-[var(--color-text-muted)] hover:bg-[var(--color-card-hover)] hover:shadow-lg hover:shadow-black/5 cursor-pointer active:scale-[0.98]`}
    >
      {/* Header: avatar + name + action buttons */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={repo.owner.avatar_url}
            alt={`${repo.owner.login} avatar`}
            className="h-10 w-10 sm:h-8 sm:w-8 rounded-lg border border-[var(--color-border)] flex-shrink-0"
            loading="lazy"
          />
          <div className="min-w-0">
            <p className="font-mono text-[11px] text-[var(--color-text-muted)] truncate">{repo.owner.login}</p>
            <h3 className="text-[15px] sm:text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors truncate">
              {repo.name}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Share button */}
          <button
            onClick={handleShare}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] transition-all"
            aria-label="复制链接"
            title="复制链接"
          >
            {showCopied ? (
              <span className="text-[10px] text-[var(--color-accent)]">OK</span>
            ) : (
              <ShareNetwork size={16} />
            )}
          </button>

          {/* Favorite button */}
          <button
            onClick={handleFavorite}
            className={`flex h-8 w-8 items-center justify-center rounded-md transition-all ${
              isFav
                ? 'text-amber-400'
                : 'text-[var(--color-text-muted)] hover:text-amber-400 hover:bg-[var(--color-surface)]'
            }`}
            aria-label={isFav ? '取消收藏' : '收藏'}
            title={isFav ? '取消收藏' : '收藏'}
          >
            <BookmarkSimple size={16} weight={isFav ? 'fill' : 'regular'} />
          </button>
        </div>
      </div>

      {/* Description */}
      <TranslatedText
        text={repo.description || 'No description available'}
        className="mb-4 flex-1 text-sm sm:text-[13px] leading-relaxed text-[var(--color-text-secondary)] line-clamp-2"
        fallback="暂无描述"
      />

      {/* Stats + Download */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2.5">
          {repo.language && (
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--color-text-secondary)]">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: langColor }}
              />
              {repo.language}
            </span>
          )}
          <span className="flex items-center gap-1 font-mono text-[11px] text-[var(--color-text-muted)]">
            <Star size={12} className="text-amber-400" weight="fill" />
            {formatStars(repo.stargazers_count)}
          </span>
          <span className="flex items-center gap-1 font-mono text-[11px] text-[var(--color-text-muted)]">
            <GitFork size={12} />
            {formatStars(repo.forks_count)}
          </span>
        </div>

        {/* Download button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            window.open(releaseUrl, '_blank', 'noopener,noreferrer');
          }}
          className="flex h-10 sm:h-8 items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 font-mono text-[11px] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-dim)] transition-all flex-shrink-0"
          title="查看 Release 下载"
        >
          <DownloadSimple size={14} />
          <span>下载</span>
        </button>
      </div>

      {/* Topics */}
      {repo.topics && repo.topics.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {repo.topics.slice(0, 3).map((topic) => (
            <TranslatedText
              key={topic}
              text={topic}
              className="rounded-md bg-[var(--color-accent-dim)] px-2 py-1 font-mono text-[10px] text-[var(--color-accent)]"
            />
          ))}
        </div>
      )}
    </div>
  );
}
