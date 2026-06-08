import { useState, useEffect, useCallback } from 'react';
import { ArrowUp } from '@phosphor-icons/react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FilterBar } from './components/FilterBar';
import { TranslationProvider } from './context/TranslationContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { FavoritesPage } from './components/FavoritesPage';
import { RepoCard } from './components/RepoCard';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { Footer } from './components/Footer';
import { fetchTrendingRepos, fetchTrendingByTopic, fetchSearchRepos, LANGUAGES, TOPICS } from './api';
import type { GitHubRepo, TimeRange } from './types';

function AppContent() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const loadRepos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let result;
      if (searchQuery) {
        result = await fetchSearchRepos(searchQuery, selectedLanguage, page);
      } else if (selectedTopic) {
        result = await fetchTrendingByTopic(selectedTopic, page);
      } else {
        result = await fetchTrendingRepos(timeRange, selectedLanguage, page);
      }
      setRepos(result.repos);
      setTotalCount(result.totalCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败，请重试');
    } finally {
      setLoading(false);
    }
  }, [timeRange, selectedLanguage, selectedTopic, searchQuery, page]);

  useEffect(() => {
    loadRepos();
  }, [loadRepos]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [timeRange, selectedLanguage, selectedTopic, searchQuery]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) {
        return;
      }

      switch (e.key) {
        case '/':
          e.preventDefault();
          document.querySelector<HTMLInputElement>('input[type="text"]')?.focus();
          break;
        case 't':
        case 'T':
          e.preventDefault();
          document.querySelector<HTMLButtonElement>('[aria-label*="切换"]')?.click();
          break;
        case 'b':
        case 'B':
          e.preventDefault();
          document.querySelector<HTMLButtonElement>('[aria-label="我的收藏"]')?.click();
          break;
        case 'j':
          e.preventDefault();
          window.scrollBy({ top: 300, behavior: 'smooth' });
          break;
        case 'k':
          e.preventDefault();
          window.scrollBy({ top: -300, behavior: 'smooth' });
          break;
        case 'g':
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Language statistics
  const langStats = repos.reduce((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topLangs = Object.entries(langStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const langColors: Record<string, string> = {
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

  return (
    <div className="min-h-[100dvh]" style={{ background: 'var(--color-background)' }}>
      <Header />
      <HeroSection timeRange={timeRange} totalCount={totalCount} />
      <FilterBar
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        selectedTopic={selectedTopic}
        setSelectedTopic={setSelectedTopic}
        languages={LANGUAGES}
        topics={TOPICS}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Language statistics bar */}
        {!loading && !error && topLangs.length > 0 && (
          <div className="mb-4 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="font-mono text-[10px] text-[var(--color-text-muted)] flex-shrink-0">语言:</span>
            <div className="flex gap-1.5">
              {topLangs.map(([lang, count]) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(selectedLanguage === lang ? null : lang)}
                  className={`flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[10px] transition-all tactile-press flex-shrink-0 ${
                    selectedLanguage === lang
                      ? 'bg-[var(--color-accent-dim)] text-[var(--color-accent)] border border-[var(--color-accent)]'
                      : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-transparent hover:border-[var(--color-border)]'
                  }`}
                >
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: langColors[lang] || '#71717a' }}
                  />
                  {lang}
                  <span className="text-[9px] opacity-60">{count}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="mb-4 sm:mb-6 flex items-center justify-between">
          <p className="font-mono text-[11px] sm:text-xs text-[var(--color-text-muted)]">
            {searchQuery ? (
              <>搜索 "{searchQuery}" - </>
            ) : null}
            {totalCount > 0 ? (
              <>{repos.length} / {totalCount.toLocaleString()} 个项目</>
            ) : (
              '加载中...'
            )}
          </p>
          {page > 1 && (
            <span className="font-mono text-[11px] text-[var(--color-text-muted)]">
              第 {page} 页
            </span>
          )}
        </div>

        {error && (
          <div className="mb-8 rounded-lg border border-rose-500/20 bg-rose-500/5 p-4">
            <p className="text-sm text-rose-400">{error}</p>
            <button
              onClick={loadRepos}
              className="mt-2 font-mono text-xs text-rose-300 underline hover:text-rose-200 tactile-press"
            >
              重试
            </button>
          </div>
        )}

        {loading && <LoadingSkeleton />}

        {!loading && !error && (
          <>
            {repos.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
                {repos.map((repo, index) => (
                  <RepoCard key={repo.id} repo={repo} index={index} />
                ))}
              </div>
            ) : (
              <div className="py-16 sm:py-20 text-center">
                <p className="text-base sm:text-lg text-[var(--color-text-secondary)]">未找到项目</p>
                <p className="mt-2 font-mono text-[11px] sm:text-xs text-[var(--color-text-muted)]">
                  {searchQuery
                    ? '请尝试其他关键词'
                    : '请尝试调整筛选条件或时间范围'}
                </p>
              </div>
            )}

            {totalCount > 20 && (
              <div className="mt-6 sm:mt-8 flex items-center justify-center gap-3">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 font-mono text-xs text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] disabled:opacity-40 disabled:cursor-not-allowed transition-all tactile-press"
                >
                  上一页
                </button>
                <span className="px-3 font-mono text-xs text-[var(--color-text-muted)]">
                  {page} / {Math.ceil(totalCount / 20)}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= Math.ceil(totalCount / 20)}
                  className="h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 font-mono text-xs text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] disabled:opacity-40 disabled:cursor-not-allowed transition-all tactile-press"
                >
                  下一页
                </button>
              </div>
            )}
          </>
        )}

        {/* Keyboard shortcuts hint */}
        <div className="mt-8 hidden sm:flex items-center justify-center gap-4 font-mono text-[10px] text-[var(--color-text-muted)]">
          <span><kbd className="px-1 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border)]">/</kbd> 搜索</span>
          <span><kbd className="px-1 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border)]">T</kbd> 主题</span>
          <span><kbd className="px-1 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border)]">B</kbd> 收藏</span>
          <span><kbd className="px-1 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border)]">J/K</kbd> 滚动</span>
          <span><kbd className="px-1 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border)]">G</kbd> 回顶</span>
        </div>
      </main>

      <Footer repos={repos} timeRange={timeRange} />

      <FavoritesPage />

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] transition-all tactile-press"
          aria-label="回到顶部"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </div>
  );
}

function App() {
  return (
    <TranslationProvider>
      <FavoritesProvider>
        <AppContent />
      </FavoritesProvider>
    </TranslationProvider>
  );
}

export default App;
