import { useMemo, useState } from 'react';
import ISSMap from '../components/ISSMap';
import NewsGrid from '../components/NewsGrid';
import ISSSpeedChart from '../charts/ISSSpeedChart';
import NewsDistributionChart from '../charts/NewsDistributionChart';
import { useISS } from '../hooks/useISS';
import { useNews } from '../hooks/useNews';

export default function AnalyticsPage() {
  const iss = useISS();
  const news = useNews();
  const [source, setSource] = useState('');
  const filtered = useMemo(
    () => (source ? news.articles.filter((article) => article.source === source) : news.articles),
    [news.articles, source],
  );

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-3xl p-6">
        <h1 className="font-display text-4xl font-bold">Analytics deck</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Real-time orbital speed, source distribution, and path visualization in one view.
        </p>
      </section>
      <div className="grid gap-6 xl:grid-cols-2">
        <ISSSpeedChart speedHistory={iss.speedHistory} />
        <NewsDistributionChart articles={news.articles} selectedSource={source} onSelectSource={setSource} />
      </div>
      <ISSMap current={iss.current} positions={iss.positions} locationName={iss.locationName} />
      <NewsGrid articles={filtered} loading={news.loading} />
    </div>
  );
}
