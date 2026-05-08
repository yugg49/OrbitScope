import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, tone = 'orbit' }) {
  const tones = {
    orbit: 'text-orbit bg-orbit/10',
    ion: 'text-ion bg-ion/10',
    plasma: 'text-plasma bg-plasma/10',
    amber: 'text-amberstar bg-amberstar/10',
  };

  return (
    <motion.article whileHover={{ y: -4 }} className="glass-panel rounded-3xl p-5">
      <div className={`grid h-11 w-11 place-items-center rounded-2xl ${tones[tone]}`}>
        <Icon size={20} />
      </div>
      <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 font-display text-3xl font-bold">{value}</p>
    </motion.article>
  );
}
