export async function onRequest(context: any) {
  const { request } = context;
  const url = new URL(request.url);

  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Content-Type': 'application/json',
  });

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  try {
    const text = url.searchParams.get('q') || '';
    if (!text) {
      return new Response(JSON.stringify({ error: 'Missing q parameter' }), { status: 400, headers });
    }

    // Try MyMemory API
    const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|zh-CN`;
    const response = await fetch(apiUrl, {
      headers: { 'User-Agent': 'GitHub-Trending-App' },
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        ...Object.fromEntries(headers),
        'Cache-Control': 'public, max-age=86400', // Cache 24 hours
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
  }
}
