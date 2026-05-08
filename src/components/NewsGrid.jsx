import EmptyState from './EmptyState';
import NewsCard from './NewsCard';
import SkeletonCard from './SkeletonCard';

export default function NewsGrid({ articles, loading }) {
  if (loading) {
    return (
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} className="h-96" />
        ))}
      </div>
    );
  }

  if (!articles.length) return <EmptyState title="No articles match" message="Try another search or refresh the feed." />;

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {articles.map((article) => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>
  );
}
