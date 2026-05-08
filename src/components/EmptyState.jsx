import { SearchX } from 'lucide-react';

export default function EmptyState({ title = 'Nothing to show', message = 'Try refreshing or adjusting your filters.' }) {
  return (
    <div className="glass-panel rounded-3xl p-8 text-center">
      <SearchX className="mx-auto text-slate-400" size={36} />
      <h3 className="mt-4 font-display text-xl font-bold">{title}</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
}
