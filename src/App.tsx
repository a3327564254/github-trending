import { useState, useEffect, useCallback } from 'react';
import { ArrowUp } from '@phosphor-icons/react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FilterBar } from './components/FilterBar';
import { TranslationProvider } from './context/TranslationContext';
import { RepoCard } from './components/RepoCard';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { Footer } from './components/Footer';
import { fetchTrendingRepos, fetchTrendingByTopic, fetchSearchRepos, LANGUAGES, TOPICS } from './api';
import type { GitHubRepo, TimeRange } from './types';

function App() {
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
        // Search mode: search by query
        result = await fetchSearchRepos(searchQuery, selectedLanguage, page);
      } else if (selectedTopic) {
        // Topic filter mode
        result = await fetchTrendingByTopic(selectedTopic, page);
      } else {
        // Trending mode (default)
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <TranslationProvider>
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

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="font-mono text-xs text-[var(--color-text-muted)]">
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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {repos.map((repo, index) => (
                  <RepoCard key={repo.id} repo={repo} index={index} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-lg text-[var(--color-text-secondary)]">未找到项目</p>
                <p className="mt-2 font-mono text-xs text-[var(--color-text-muted)]">
                  {searchQuery
                    ? '请尝试其他关键词'
                    : '请尝试调整筛选条件或时间范围'}
                </p>
              </div>
            )}

            {totalCount > 20 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 font-mono text-xs text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] disabled:opacity-40 disabled:cursor-not-allowed transition-all tactile-press"
                >
                  上一页
                </button>
                <span className="px-4 font-mono text-xs text-[var(--color-text-muted)]">
                  {page} / {Math.ceil(totalCount / 20)}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= Math.ceil(totalCount / 20)}
                  className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 font-mono text-xs text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] disabled:opacity-40 disabled:cursor-not-allowed transition-all tactile-press"
                >
                  下一页
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] transition-all tactile-press"
          aria-label="回到顶部"
        >
          <ArrowUp size={16} />
        </button>
      )}
    </div>
    </TranslationProvider>
  );
}

export default App;
