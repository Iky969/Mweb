import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Proxy Deezer Search API (supports both /search and /api/search)
const handleSearch = async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  try {
    const deezerUrl = `https://api.deezer.com/search?q=${encodeURIComponent(query)}`;
    const response = await fetch(deezerUrl, {
      headers: {
        'User-Agent': 'Aura-Music-Player/1.0',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Deezer API error: ${response.statusText}` });
    }

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error('Error fetching from Deezer API:', err);
    return res.status(500).json({ error: 'Failed to fetch tracks from Deezer' });
  }
};

app.get('/search', handleSearch);
app.get('/api/search', handleSearch);

// Proxy image to prevent canvas CORS taint during color extraction
app.get('/api/proxy-image', async (req, res) => {
  const imageUrl = req.query.url;
  if (!imageUrl) {
    return res.status(400).send('Missing url parameter');
  }

  try {
    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) {
      return res.status(imageRes.status).send('Failed to fetch image');
    }

    const contentType = imageRes.headers.get('content-type') || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const arrayBuffer = await imageRes.arrayBuffer();
    return res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error('Error proxying image:', err);
    return res.status(500).send('Image proxy error');
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Aura Backend] Server is running on http://localhost:${PORT}`);
});
