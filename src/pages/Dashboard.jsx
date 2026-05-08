import { Gauge, Newspaper, Orbit, UsersRound } from 'lucide-react';
import Hero from '../components/Hero';
import StatCard from '../components/StatCard';
import ISSInfoCard from '../components/ISSInfoCard';
import ISSMap from '../components/ISSMap';
import AstronautsPanel from '../components/AstronautsPanel';
import NewsGrid from '../components/NewsGrid';
import SearchBar from '../components/SearchBar';
import SortDropdown from '../components/SortDropdown';
import ISSSpeedChart from '../charts/ISSSpeedChart';
import NewsDistributionChart from '../charts/NewsDistributionChart';
import { useISS } from '../hooks/useISS';
import { useNews } from '../hooks/useNews';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useTheme } from '../context/ThemeContext';

export default function Dashboard() {
  const iss = useISS();
  const news = useNews();
  const { toggleTheme } = useTheme();
  useKeyboardShortcuts({ onRefresh: () => iss.refresh({ silent: false }), onTheme: toggleTheme });

  return (
    <div className="space-y-6">
      <Hero {...iss} />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Gauge} label="Orbital speed" value={iss.current?.speed ? `${iss.current.speed.toLocaleString()} km/h` : 'Calculating'} />
        <StatCard icon={Orbit} label="Tracked points" value={iss.positions.length} tone="amber" />
        <StatCard icon={UsersRound} label="People in space" value={iss.astronauts.count} tone="ion" />
        <StatCard icon={Newspaper} label="Loaded articles" value={news.articles.length} tone="plasma" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <ISSMap current={iss.current} positions={iss.positions} locationName={iss.locationName} />
        <div className="space-y-6">
          <ISSInfoCard current={iss.current} locationName={iss.locationName} trackedCount={iss.positions.length} error={iss.error} onRetry={() => iss.refresh({ silent: false })} />
          <AstronautsPanel astronauts={iss.astronauts} />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <ISSSpeedChart speedHistory={iss.speedHistory} />
        <NewsDistributionChart articles={news.articles} selectedSource="" onSelectSource={() => {}} />
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">Latest mission-adjacent news</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {news.cached ? 'Loaded from 15-minute cache' : 'Fresh feed'} · {news.error || '10 article feed'}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <SearchBar value={news.query} onChange={news.setQuery} />
            <SortDropdown value={news.sortBy} onChange={news.setSortBy} />
            <button className="button-soft" onClick={() => news.refresh({ force: true })}>
              Refresh
            </button>
          </div>
        </div>
        <NewsGrid articles={news.filteredArticles.slice(0, 6)} loading={news.loading} />
      </section>
    </div>
  );
}
