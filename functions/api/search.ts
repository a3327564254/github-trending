const GITHUB_API = 'https://api.github.com';

export async function onRequest(context: any) {
  const { request } = context;
  const url = new URL(request.url);

  // CORS headers
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Content-Type': 'application/json',
  });

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  try {
    const q = url.searchParams.get('q') || '';
    const sort = url.searchParams.get('sort') || 'stars';
    const order = url.searchParams.get('order') || 'desc';
    const page = url.searchParams.get('page') || '1';
    const per_page = url.searchParams.get('per_page') || '20';

    const params = new URLSearchParams({ q, sort, order, page, per_page });
    const apiUrl = `${GITHUB_API}/search/repositories?${params.toString()}`;

    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-Trending-App',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        ...Object.fromEntries(headers),
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers,
    });
  }
}
