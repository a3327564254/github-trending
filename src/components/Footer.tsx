import { GithubLogo } from '@phosphor-icons/react';

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border-subtle)] bg-[var(--color-background)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <span className="font-mono text-[11px] text-[var(--color-text-muted)]">
          数据由 GitHub 提供
        </span>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
        >
          <GithubLogo size={18} />
        </a>
      </div>
    </footer>
  );
}
