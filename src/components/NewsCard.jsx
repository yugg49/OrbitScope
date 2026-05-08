import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDate } from '../utils/date';

export default function NewsCard({ article }) {
  return (
    <motion.article whileHover={{ y: -5 }} className="glass-panel flex h-full flex-col overflow-hidden rounded-3xl">
      <div className="aspect-[16/9] bg-slate-200 dark:bg-white/10">
        {article.image ? (
          <img src={article.image} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="grid h-full place-items-center bg-gradient-to-br from-slate-900 via-slate-700 to-orbit text-sm font-semibold text-white">
            OrbitScope News
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>{article.source}</span>
          <span>•</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
        <h3 className="mt-3 line-clamp-2 font-display text-xl font-bold">{article.title}</h3>
        <p className="mt-2 text-sm text-slate-500 line-clamp-3 dark:text-slate-400">{article.description}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="truncate text-xs text-slate-400">{article.author}</span>
          <a className="button-soft shrink-0" href={article.url} target="_blank" rel="noreferrer">
            Read More
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </motion.article>
  );
}
