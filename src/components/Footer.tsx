import { GithubLogo, Rss } from '@phosphor-icons/react';
import { downloadRSS } from '../services/rss';
import type { GitHubRepo } from '../types';

interface FooterProps {
  repos?: GitHubRepo[];
  timeRange?: string;
}

export function Footer({ repos = [], timeRange = 'daily' }: FooterProps) {
  const handleRSS = () => {
    if (repos.length > 0) {
      const labels: Record<string, string> = { daily: '今日', weekly: '本周', monthly: '本月' };
      downloadRSS(repos, labels[timeRange] || '趋势');
    }
  };

  return (
    <footer className="border-t border-[var(--color-border-subtle)] bg-[var(--color-background)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 sm:py-6">
        <span className="font-mono text-[11px] text-[var(--color-text-muted)]">
          数据由 GitHub 提供
        </span>

        <div className="flex items-center gap-3">
          {/* RSS button */}
          {repos.length > 0 && (
            <button
              onClick={handleRSS}
              className="flex items-center gap-1.5 rounded-md px-2 py-1.5 font-mono text-[11px] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:bg-[var(--color-surface)] transition-all tactile-press"
              title="下载 RSS 订阅"
            >
              <Rss size={14} />
              <span className="hidden sm:inline">RSS</span>
            </button>
          )}

          <a
            href="https://github.com/a3327564254/github-trending"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
          >
            <GithubLogo size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
