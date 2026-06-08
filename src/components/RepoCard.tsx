import { Star, GitFork, ArrowSquareOut, DownloadSimple } from '@phosphor-icons/react';
import type { GitHubRepo } from '../types';
import { TranslatedText } from './TranslatedText';

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
  const formatStars = (count: number): string => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  const langColor = repo.language ? LANGUAGE_COLORS[repo.language] || '#71717a' : undefined;
  const delayClass = `stagger-${Math.min(index + 1, 9)}`;
  const releaseUrl = `${repo.html_url}/releases`;

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking the download button
    if ((e.target as HTMLElement).closest('[data-download-btn]')) return;
    window.open(repo.html_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      onClick={handleCardClick}
      className={`animate-slide-up ${delayClass} group flex flex-col rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] p-5 transition-all duration-200 hover:border-[var(--color-text-muted)] hover:bg-[var(--color-card-hover)] cursor-pointer tactile-press`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={repo.owner.avatar_url}
            alt={`${repo.owner.login} avatar`}
            className="h-8 w-8 rounded-md border border-[var(--color-border)] flex-shrink-0"
            loading="lazy"
          />
          <div className="min-w-0">
            <p className="font-mono text-[11px] text-[var(--color-text-muted)] truncate">{repo.owner.login}</p>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors truncate">
              {repo.name}
            </h3>
          </div>
        </div>
        <ArrowSquareOut
          size={16}
          className="flex-shrink-0 text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)] transition-colors mt-0.5"
        />
      </div>

      {/* Translated description */}
      <TranslatedText
        text={repo.description || 'No description available'}
        className="mb-4 flex-1 text-[13px] leading-relaxed text-[var(--color-text-secondary)] line-clamp-2"
        fallback="暂无描述"
      />

      {/* Stats + Download */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
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

        {/* Download / Release button */}
        <a
          href={releaseUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-download-btn
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 font-mono text-[11px] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-dim)] transition-all tactile-press"
          title="查看 Release 下载"
        >
          <DownloadSimple size={12} />
          <span>下载</span>
        </a>
      </div>

      {repo.topics && repo.topics.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {repo.topics.slice(0, 3).map((topic) => (
            <TranslatedText
              key={topic}
              text={topic}
              className="rounded-md bg-[var(--color-accent-dim)] px-2 py-0.5 font-mono text-[10px] text-[var(--color-accent)]"
            />
          ))}
        </div>
      )}
    </div>
  );
}
