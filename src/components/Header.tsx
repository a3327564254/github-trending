import { GithubLogo, Translate } from '@phosphor-icons/react';
import { ThemeToggle } from './ThemeToggle';
import { useTranslation } from '../context/TranslationContext';

export function Header() {
  const { enabled, toggle } = useTranslation();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[var(--color-header-bg)] backdrop-blur-xl backdrop-saturate-150 shadow-[inset_0_-1px_0_rgba(255,255,255,0.05)]">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="/" className="flex items-center gap-2">
          <GithubLogo size={20} weight="fill" className="text-[var(--color-text-primary)]" />
          <span className="font-mono text-sm font-medium tracking-tight text-[var(--color-text-primary)]">
            trending
          </span>
        </a>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-all tactile-press ${
              enabled
                ? 'border-[var(--color-accent)] bg-[var(--color-accent-dim)] text-[var(--color-accent)]'
                : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]'
            }`}
            aria-label={enabled ? '关闭翻译' : '开启翻译'}
          >
            <Translate size={18} />
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
