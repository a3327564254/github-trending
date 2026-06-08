import express from 'express';
import cors from 'cors';
import https from 'https';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const GITHUB_API = 'https://api.github.com';

// Direct HTTPS request to GitHub API (no proxy needed)
function fetchGitHub(url) {
  return new Promise((resolve, reject) => {
    const reqOptions = {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-Trending-App',
      },
    };

    const req = https.request(url, reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            json: () => Promise.resolve(jsonData),
          });
        } catch (e) {
          reject(new Error('Invalid JSON response'));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.end();
  });
}

app.get('/api/search', async (req, res) => {
  try {
    const q = String(req.query.q || '');
    const sort = String(req.query.sort || 'stars');
    const order = String(req.query.order || 'desc');
    const page = String(req.query.page || '1');
    const per_page = String(req.query.per_page || '20');

    const params = new URLSearchParams({ q, sort, order, page, per_page });
    const url = `${GITHUB_API}/search/repositories?${params.toString()}`;

    console.log(`[search] q=${q} page=${page}`);
    const response = await fetchGitHub(url);

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[search] OK - ${data.items?.length} repos`);
    res.json(data);
  } catch (error) {
    console.error(`[search] Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
