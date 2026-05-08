import { Gauge, LocateFixed, MapPin, RadioTower } from 'lucide-react';

export default function ISSInfoCard({ current, locationName, trackedCount, error, onRetry }) {
  const rows = [
    { label: 'Latitude', value: current ? `${current.lat.toFixed(5)} deg` : '--', icon: LocateFixed },
    { label: 'Longitude', value: current ? `${current.lon.toFixed(5)} deg` : '--', icon: MapPin },
    { label: 'Speed', value: current?.speed ? `${current.speed.toLocaleString()} km/h` : 'Calculating', icon: Gauge },
    { label: 'Tracked positions', value: trackedCount, icon: RadioTower },
  ];

  return (
    <section className="glass-panel rounded-3xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold">ISS telemetry</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{locationName}</p>
        </div>
        {error && (
          <button className="button-soft" onClick={onRetry}>
            Retry
          </button>
        )}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <div key={row.label} className="rounded-2xl border border-slate-200/70 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
              <Icon size={18} className="text-orbit" />
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-400">{row.label}</p>
              <p className="mt-1 font-display text-xl font-bold">{row.value}</p>
            </div>
          );
        })}
      </div>
      {error && <p className="mt-4 rounded-2xl bg-plasma/10 p-3 text-sm text-plasma">{error}</p>}
    </section>
  );
}
