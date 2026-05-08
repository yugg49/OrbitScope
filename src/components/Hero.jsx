import { motion } from 'framer-motion';
import { Radio, RefreshCw, Satellite } from 'lucide-react';
import { formatTime } from '../utils/date';

export default function Hero({ current, locationName, lastUpdated, onRefresh, refreshing }) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/50 bg-slate-950 px-6 py-8 text-white shadow-glow dark:border-white/10 md:px-8">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(14,165,233,0.28),transparent_38%,rgba(245,158,11,0.18)_72%,rgba(244,63,94,0.2))]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-orbit to-transparent" />
      <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-100">
            <Radio size={14} />
            Live telemetry refreshes every 15s
          </div>
          <h1 className="mt-5 font-display text-4xl font-bold tracking-normal md:text-6xl">
            International Space Station command view.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            Track the ISS in real time, monitor orbital speed, scan astronauts in space, and connect fresh news signals to mission analytics.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="button-primary bg-white text-slate-950 hover:bg-slate-200" onClick={() => onRefresh({ silent: false })}>
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              Refresh telemetry
            </button>
            <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-300">
              Last update: {lastUpdated ? formatTime(lastUpdated) : 'Connecting'}
            </div>
          </div>
        </div>
        <motion.div
          className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-slate-950">
              <Satellite size={28} />
            </div>
            <div>
              <p className="text-sm text-slate-300">Currently over</p>
              <p className="text-xl font-bold">{locationName}</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-slate-950/45 p-4">
              <p className="text-slate-400">Latitude</p>
              <p className="mt-1 font-display text-2xl font-bold">{current ? current.lat.toFixed(3) : '--'}</p>
            </div>
            <div className="rounded-2xl bg-slate-950/45 p-4">
              <p className="text-slate-400">Longitude</p>
              <p className="mt-1 font-display text-2xl font-bold">{current ? current.lon.toFixed(3) : '--'}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
