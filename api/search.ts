import type { VercelRequest, VercelResponse } from '@vercel/node';

const GITHUB_API = 'https://api.github.com';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const q = String(req.query.q || '');
    const sort = String(req.query.sort || 'stars');
    const order = String(req.query.order || 'desc');
    const page = String(req.query.page || '1');
    const per_page = String(req.query.per_page || '20');

    const params = new URLSearchParams({ q, sort, order, page, per_page });
    const url = `${GITHUB_API}/search/repositories?${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-Trending-App',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();

    // Cache for 5 minutes (Vercel CDN will cache this)
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

    return res.status(200).json(data);
  } catch (error: any) {
    console.error(`[search] Error: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
}
