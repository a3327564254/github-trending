import type { GitHubRepo } from '../types';

export function generateRSSFeed(repos: GitHubRepo[], title: string): string {
  const now = new Date().toUTCString();

  const items = repos
    .slice(0, 20)
    .map(
      (repo) => `
    <item>
      <title><![CDATA[${repo.full_name} - ${repo.description || 'No description'}]]></title>
      <link>${repo.html_url}</link>
      <guid isPermaLink="true">${repo.html_url}</guid>
      <pubDate>${new Date(repo.updated_at).toUTCString()}</pubDate>
      <description><![CDATA[
        <p><strong>${repo.full_name}</strong></p>
        <p>${repo.description || 'No description'}</p>
        <p>Stars: ${repo.stargazers_count.toLocaleString()} | Forks: ${repo.forks_count.toLocaleString()}${repo.language ? ` | Language: ${repo.language}` : ''}</p>
        ${repo.topics.length > 0 ? `<p>Topics: ${repo.topics.join(', ')}</p>` : ''}
      ]]></description>
    </item>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>GitHub Trending - ${title}</title>
    <link>https://github-trending-aqb.pages.dev</link>
    <description>GitHub 热门开源项目趋势</description>
    <language>zh-cn</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="https://github-trending-aqb.pages.dev/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;
}

export function downloadRSS(repos: GitHubRepo[], title: string): void {
  const xml = generateRSSFeed(repos, title);
  const blob = new Blob([xml], { type: 'application/rss+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'github-trending.xml';
  a.click();
  URL.revokeObjectURL(url);
}
