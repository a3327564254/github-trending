import { GithubLogo, Translate } from '@phosphor-icons/react';
import { ThemeToggle } from './ThemeToggle';
import { useTranslation } from '../context/TranslationContext';

export function Header() {
  const { enabled, toggle } = useTranslation();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-header-bg)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2.5">
          <GithubLogo size={22} weight="fill" className="text-[var(--color-text-primary)]" />
          <span className="font-mono text-sm font-medium tracking-tight text-[var(--color-text-primary)]">
            trending
          </span>
        </a>

        <div className="flex items-center gap-2">
          {/* Translate button */}
          <button
            onClick={toggle}
            className={`flex h-8 items-center gap-1.5 rounded-md border px-2.5 font-mono text-[11px] transition-all tactile-press ${
              enabled
                ? 'border-[var(--color-accent)] bg-[var(--color-accent-dim)] text-[var(--color-accent)]'
                : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)]'
            }`}
            aria-label={enabled ? '关闭翻译' : '开启翻译'}
          >
            <Translate size={14} />
            <span className="hidden sm:inline">{enabled ? '翻译中' : '翻译'}</span>
          </button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
