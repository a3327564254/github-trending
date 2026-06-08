import { X, Star, GitFork, Clock, ArrowSquareOut, DownloadSimple } from '@phosphor-icons/react';
import type { GitHubRepo } from '../types';

interface RepoDetailModalProps {
  repo: GitHubRepo | null;
  onClose: () => void;
}

export function RepoDetailModal({ repo, onClose }: RepoDetailModalProps) {
  if (!repo) return null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-background)] px-6 py-4 rounded-t-2xl">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={repo.owner.avatar_url}
              alt={repo.owner.login}
              className="h-10 w-10 rounded-lg border border-[var(--color-border)]"
            />
            <div className="min-w-0">
              <p className="font-mono text-[11px] text-[var(--color-text-muted)]">{repo.owner.login}</p>
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)] truncate">{repo.name}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {repo.description || '暂无描述'}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Star size={16} className="text-amber-400" weight="fill" />
                <span className="text-xl font-bold text-[var(--color-text-primary)]">{formatNumber(repo.stargazers_count)}</span>
              </div>
              <p className="font-mono text-[10px] text-[var(--color-text-muted)]">Stars</p>
            </div>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <GitFork size={16} className="text-[var(--color-text-secondary)]" />
                <span className="text-xl font-bold text-[var(--color-text-primary)]">{formatNumber(repo.forks_count)}</span>
              </div>
              <p className="font-mono text-[10px] text-[var(--color-text-muted)]">Forks</p>
            </div>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Clock size={16} className="text-[var(--color-text-secondary)]" />
                <span className="text-sm font-bold text-[var(--color-text-primary)]">{formatDate(repo.created_at)}</span>
              </div>
              <p className="font-mono text-[10px] text-[var(--color-text-muted)]">创建时间</p>
            </div>
          </div>

          {/* Language & Topics */}
          <div className="space-y-3">
            {repo.language && (
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-[var(--color-text-muted)]">语言:</span>
                <span className="rounded-md bg-[var(--color-surface)] px-2 py-1 font-mono text-xs text-[var(--color-text-primary)]">
                  {repo.language}
                </span>
              </div>
            )}
            {repo.topics && repo.topics.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[11px] text-[var(--color-text-muted)]">主题:</span>
                {repo.topics.map((topic) => (
                  <span key={topic} className="rounded-md bg-[var(--color-accent-dim)] px-2 py-1 font-mono text-[11px] text-[var(--color-accent)]">
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 text-sm font-medium text-white hover:opacity-90 transition-opacity"
            >
              <ArrowSquareOut size={16} />
              查看仓库
            </a>
            <a
              href={`${repo.html_url}/releases`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] transition-all"
            >
              <DownloadSimple size={16} />
              下载
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
