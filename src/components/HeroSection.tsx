import { MagnifyingGlass, ArrowRight } from '@phosphor-icons/react';
import type { TimeRange } from '../types';

interface HeroSectionProps {
  timeRange: TimeRange;
  totalCount: number;
}

const RANGE_LABELS: Record<TimeRange, string> = {
  daily: '今日',
  weekly: '本周',
  monthly: '本月',
};

export function HeroSection({ timeRange, totalCount }: HeroSectionProps) {
  return (
    <section className="border-b border-[var(--color-border-subtle)] bg-[var(--color-background)]">
      <div className="mx-auto max-w-7xl px-4 pt-10 pb-8 sm:px-6 sm:pt-16 sm:pb-12">
        <div className="max-w-2xl">
          <div className="animate-fade-in mb-3 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            GitHub 趋势
          </div>

          <h1 className="animate-slide-up stagger-1 text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-[var(--color-text-primary)] leading-tight">
            发现热门开源项目
          </h1>

          <p className="animate-slide-up stagger-2 mt-3 sm:mt-4 max-w-[50ch] text-sm sm:text-base leading-relaxed text-[var(--color-text-secondary)]">
            实时追踪 GitHub 上增长最快的仓库，了解开发者社区正在构建什么。
          </p>

          <div className="animate-slide-up stagger-3 mt-6 sm:mt-8 flex flex-wrap items-center gap-4 sm:gap-6 font-mono text-[11px] sm:text-xs text-[var(--color-text-muted)]">
            <div className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
              <span>{RANGE_LABELS[timeRange]}趋势</span>
            </div>
            <div className="flex items-center gap-2">
              <MagnifyingGlass size={12} />
              <span>{totalCount.toLocaleString()} 个项目</span>
            </div>
            <a
              href="https://github.com/trending"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
            >
              <span>GitHub 官方</span>
              <ArrowRight size={12} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
