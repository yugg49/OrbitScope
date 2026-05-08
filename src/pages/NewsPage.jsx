import { RefreshCw } from 'lucide-react';
import NewsGrid from '../components/NewsGrid';
import SearchBar from '../components/SearchBar';
import SortDropdown from '../components/SortDropdown';
import { useNews } from '../hooks/useNews';

export default function NewsPage() {
  const news = useNews();

  return (
    <div className="space-y-5">
      <section className="glass-panel rounded-3xl p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold">News intelligence</h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Search, sort, and cache the latest science, space, and technology reports.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <SearchBar value={news.query} onChange={news.setQuery} />
            <SortDropdown value={news.sortBy} onChange={news.setSortBy} />
            <button className="button-primary" onClick={() => news.refresh({ force: true })}>
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>
        {news.error && <p className="mt-4 rounded-2xl bg-plasma/10 p-3 text-sm text-plasma">{news.error}</p>}
      </section>
      <NewsGrid articles={news.filteredArticles} loading={news.loading} />
    </div>
  );
}
