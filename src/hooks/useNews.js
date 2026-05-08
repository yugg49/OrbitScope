import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useDashboard } from '../context/DashboardContext';
import { fetchLatestNews } from '../services/newsService';
import { debounce } from '../utils/debounce';

export function useNews() {
  const { news, setNews } = useDashboard();
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const updateQuery = useMemo(() => debounce(setDebouncedQuery, 250), []);

  useEffect(() => {
    updateQuery(query);
  }, [query, updateQuery]);

  const refresh = useCallback(
    async ({ force = false } = {}) => {
      try {
        setNews((previous) => ({ ...previous, loading: true, error: null }));
        const result = await fetchLatestNews({ force });
        setNews({
          articles: result.articles,
          cached: result.cached,
          loading: false,
          error: null,
          lastUpdated: Date.now(),
        });
        if (force) toast.success('News refreshed');
      } catch (error) {
        setNews((previous) => ({ ...previous, loading: false, error: error.message }));
        toast.error(error.message);
      }
    },
    [setNews],
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filteredArticles = useMemo(() => {
    const lower = debouncedQuery.trim().toLowerCase();
    const filtered = lower
      ? news.articles.filter((article) =>
          [article.title, article.source, article.author, article.description].join(' ').toLowerCase().includes(lower),
        )
      : news.articles;
    return [...filtered].sort((a, b) => {
      if (sortBy === 'source') return a.source.localeCompare(b.source);
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    });
  }, [debouncedQuery, news.articles, sortBy]);

  return {
    ...news,
    query,
    setQuery,
    sortBy,
    setSortBy,
    filteredArticles,
    refresh,
  };
}
