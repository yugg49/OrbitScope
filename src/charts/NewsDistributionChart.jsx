import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#0ea5e9', '#f59e0b', '#22c55e', '#f43f5e', '#8b5cf6', '#14b8a6'];

export default function NewsDistributionChart({ articles, selectedSource, onSelectSource }) {
  const data = Object.values(
    articles.reduce((acc, article) => {
      acc[article.source] ||= { name: article.source, value: 0 };
      acc[article.source].value += 1;
      return acc;
    }, {}),
  );

  return (
    <section className="glass-panel rounded-3xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold">News distribution</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Grouped by source</p>
        </div>
        {selectedSource && (
          <button className="button-soft" onClick={() => onSelectSource('')}>
            Clear filter
          </button>
        )}
      </div>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} innerRadius={56} paddingAngle={3}>
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index % COLORS.length]}
                  stroke={selectedSource === entry.name ? '#ffffff' : 'transparent'}
                  strokeWidth={selectedSource === entry.name ? 3 : 0}
                  onClick={() => onSelectSource(entry.name)}
                  className="cursor-pointer"
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-2">
        {data.map((entry, index) => (
          <button
            key={entry.name}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              selectedSource === entry.name ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'bg-slate-900/5 text-slate-600 dark:bg-white/5 dark:text-slate-300'
            }`}
            onClick={() => onSelectSource(selectedSource === entry.name ? '' : entry.name)}
          >
            <span style={{ color: COLORS[index % COLORS.length] }}>●</span> {entry.name} ({entry.value})
          </button>
        ))}
      </div>
    </section>
  );
}
