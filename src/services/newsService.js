import apiClient from './apiClient';
import { cacheWithExpiry, getCachedValue } from '../utils/cache';

const NEWS_CACHE_KEY = 'orbitscope.news.v1';
const NEWS_TTL = 15 * 60 * 1000;

function normalizeNewsApiArticle(article, index) {
  return {
    id: article.url || `${article.title}-${index}`,
    title: article.title || 'Untitled story',
    source: article.source?.name || article.source || 'Unknown source',
    author: article.author || 'Editorial desk',
    publishedAt: article.publishedAt || article.dateTime || new Date().toISOString(),
    description: article.description || article.body || 'No summary available.',
    url: article.url || article.uri || '#',
    image: article.urlToImage || article.image || article.imageUrl || '',
    category: article.category || article.source?.name || 'General',
  };
}

export async function fetchLatestNews({ force = false } = {}) {
  if (!force) {
    const cached = getCachedValue(NEWS_CACHE_KEY);
    if (cached?.length) return { articles: cached, cached: true };
  }

  const key = import.meta.env.VITE_NEWS_API_KEY;
  const endpoint = key ? '/api/news' : '/api/news';
  const { data } = await apiClient.get(endpoint, {
    params: { q: 'space OR science OR technology', pageSize: 10 },
  });
  const rawArticles = data.articles || data.news?.results || data.results || [];
  const articles = rawArticles.slice(0, 10).map(normalizeNewsApiArticle);
  cacheWithExpiry(NEWS_CACHE_KEY, articles, NEWS_TTL);
  return { articles, cached: false };
}
