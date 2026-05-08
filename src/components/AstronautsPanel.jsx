import { UserRoundCheck } from 'lucide-react';

export default function AstronautsPanel({ astronauts }) {
  return (
    <section className="glass-panel rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold">People in space</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Currently reported crew</p>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-ion/10 text-ion">
          <UserRoundCheck />
        </div>
      </div>
      <p className="mt-5 font-display text-5xl font-bold">{astronauts.count}</p>
      <div className="mt-5 max-h-64 space-y-2 overflow-auto pr-1">
        {astronauts.people.map((person) => (
          <div key={`${person.name}-${person.craft}`} className="flex items-center justify-between rounded-2xl bg-slate-900/5 px-3 py-2 text-sm dark:bg-white/5">
            <span className="font-semibold">{person.name}</span>
            <span className="text-slate-500 dark:text-slate-400">{person.craft}</span>
          </div>
        ))}
        {!astronauts.people.length && <p className="text-sm text-slate-500 dark:text-slate-400">Crew manifest loading...</p>}
      </div>
    </section>
  );
}
