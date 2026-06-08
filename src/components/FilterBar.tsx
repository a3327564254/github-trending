import { useState } from 'react';
import { MagnifyingGlass, X } from '@phosphor-icons/react';
import type { TimeRange } from '../types';

interface FilterBarProps {
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  selectedLanguage: string | null;
  setSelectedLanguage: (lang: string | null) => void;
  selectedTopic: string | null;
  setSelectedTopic: (topic: string | null) => void;
  languages: string[];
  topics: string[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function FilterBar({
  timeRange,
  setTimeRange,
  selectedLanguage,
  setSelectedLanguage,
  selectedTopic,
  setSelectedTopic,
  languages,
  topics,
  searchQuery,
  setSearchQuery,
}: FilterBarProps) {
  const [inputValue, setInputValue] = useState(searchQuery);

  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: 'daily', label: '今日' },
    { value: 'weekly', label: '本周' },
    { value: 'monthly', label: '本月' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(inputValue.trim());
  };

  const handleClear = () => {
    setInputValue('');
    setSearchQuery('');
  };

  return (
    <div className="border-b border-[var(--color-border-subtle)] bg-[var(--color-background)]">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4">
        {/* Search bar - larger on mobile */}
        <form onSubmit={handleSearch} className="mb-3">
          <div className="relative">
            <MagnifyingGlass
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
            />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="搜索仓库名称、描述、作者..."
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-input-bg)] py-3 pl-11 pr-24 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/30 sm:rounded-lg sm:py-2.5 sm:pr-20"
            />
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
                  aria-label="清除搜索"
                >
                  <X size={16} />
                </button>
              )}
              <button
                type="submit"
                className="h-9 rounded-lg bg-[var(--color-accent)] px-4 text-xs font-medium text-white hover:opacity-90 transition-opacity tactile-press"
              >
                搜索
              </button>
            </div>
          </div>
        </form>

        {/* Filters - scrollable on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {/* Time Range */}
          <div className="flex items-center gap-1 rounded-lg bg-[var(--color-surface)] p-1 flex-shrink-0">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`rounded-md px-3 py-2 font-mono text-xs font-medium transition-all tactile-press whitespace-nowrap ${
                  timeRange === range.value
                    ? 'bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* Language */}
          <select
            value={selectedLanguage || ''}
            onChange={(e) => setSelectedLanguage(e.target.value || null)}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] px-3 py-2 font-mono text-xs text-[var(--color-text-primary)] focus:border-[var(--color-text-muted)] focus:outline-none appearance-none cursor-pointer flex-shrink-0"
          >
            <option value="">语言</option>
            {languages.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>

          {/* Topic */}
          <select
            value={selectedTopic || ''}
            onChange={(e) => setSelectedTopic(e.target.value || null)}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] px-3 py-2 font-mono text-xs text-[var(--color-text-primary)] focus:border-[var(--color-text-muted)] focus:outline-none appearance-none cursor-pointer flex-shrink-0"
          >
            <option value="">主题</option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic.charAt(0).toUpperCase() + topic.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
