import { Link, NavLink } from 'react-router-dom';
import { Activity, BarChart3, Moon, Newspaper, Radio, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useClock } from '../hooks/useClock';
import { formatTime } from '../utils/date';

const navItems = [
  { to: '/', label: 'Mission', icon: Activity },
  { to: '/news', label: 'News', icon: Newspaper },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function AppShell({ children }) {
  const { theme, toggleTheme } = useTheme();
  const now = useClock();

  return (
    <div className="min-h-screen text-slate-950 dark:text-white">
      <aside className="fixed inset-x-3 bottom-3 z-40 rounded-2xl border border-white/40 bg-white/80 p-2 shadow-panel backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/85 lg:inset-y-4 lg:left-4 lg:right-auto lg:w-24">
        <div className="flex items-center justify-around lg:h-full lg:flex-col lg:justify-start lg:gap-6">
          <Link to="/" className="hidden lg:block" aria-label="OrbitScope home">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-white shadow-glow dark:bg-white dark:text-slate-950">
              <Radio size={22} />
            </div>
          </Link>
          <nav className="flex gap-2 lg:flex-col">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `group relative grid h-12 w-16 place-items-center rounded-xl text-xs font-semibold transition lg:w-14 ${
                      isActive
                        ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
                        : 'text-slate-500 hover:bg-slate-900/5 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white'
                    }`
                  }
                  title={item.label}
                >
                  <Icon size={20} />
                  <span className="sr-only">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
          <button className="button-soft h-12 w-12 p-0 lg:mt-auto" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-30 ml-0 border-b border-white/40 bg-white/55 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/45 lg:ml-28 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950 lg:hidden">
              <Radio size={20} />
            </div>
            <div>
              <p className="font-display text-lg font-bold">OrbitScope</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Real-time ISS and news intelligence</p>
            </div>
          </Link>
          <div className="hidden items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/60 px-4 py-2 text-sm font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 sm:flex">
            <span className="h-2 w-2 rounded-full bg-ion shadow-[0_0_14px_rgba(34,197,94,0.8)]" />
            {formatTime(now)}
          </div>
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mx-auto max-w-7xl px-4 pb-28 pt-6 lg:ml-28 lg:px-8"
      >
        {children}
      </motion.main>
    </div>
  );
}
