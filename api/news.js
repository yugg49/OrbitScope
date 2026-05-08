import axios from 'axios';

const FALLBACK_ARTICLES = [
  {
    title: 'NASA shares new Earth-observation insights from orbit',
    source: { name: 'OrbitScope Sample' },
    author: 'Mission Desk',
    publishedAt: new Date().toISOString(),
    description: 'A sample article appears when no news API key is configured, keeping the dashboard usable during setup.',
    url: 'https://www.nasa.gov/',
    urlToImage: '',
  },
  {
    title: 'Space station research continues to inform future exploration',
    source: { name: 'OrbitScope Sample' },
    author: 'Science Desk',
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    description: 'Astronaut research aboard orbital laboratories supports long-duration mission planning and applied science.',
    url: 'https://www.nasa.gov/international-space-station/',
    urlToImage: '',
  },
];

export default async function handler(request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  const key = process.env.NEWS_API_KEY || process.env.VITE_NEWS_API_KEY;
  if (!key) {
    response.status(200).json({ articles: FALLBACK_ARTICLES });
    return;
  }

  try {
    const { q = 'space OR science OR technology', pageSize = 10 } = request.query;
    const { data } = await axios.get('https://newsapi.org/v2/everything', {
      timeout: 12000,
      params: {
        q,
        pageSize,
        sortBy: 'publishedAt',
        language: 'en',
        apiKey: key,
      },
    });
    response.status(200).json(data);
  } catch (error) {
    response.status(502).json({ message: error.response?.data?.message || error.message || 'Unable to fetch news' });
  }
}
