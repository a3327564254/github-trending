import type { GitHubRepo } from '../types';

export function exportAsCSV(repos: GitHubRepo[], filename = 'github-trending'): void {
  const headers = ['名称', '作者', '描述', 'Stars', 'Forks', '语言', '链接', '创建时间'];
  const rows = repos.map((repo) => [
    repo.name,
    repo.owner.login,
    (repo.description || '').replace(/,/g, '，'),
    repo.stargazers_count,
    repo.forks_count,
    repo.language || '',
    repo.html_url,
    repo.created_at,
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const bom = '﻿'; // UTF-8 BOM for Chinese characters
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8' });
  downloadBlob(blob, `${filename}.csv`);
}

export function exportAsJSON(repos: GitHubRepo[], filename = 'github-trending'): void {
  const data = repos.map((repo) => ({
    name: repo.full_name,
    description: repo.description,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language,
    url: repo.html_url,
    topics: repo.topics,
    created: repo.created_at,
    updated: repo.updated_at,
  }));

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  downloadBlob(blob, `${filename}.json`);
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
