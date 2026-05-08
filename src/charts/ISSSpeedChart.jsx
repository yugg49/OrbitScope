import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatTime } from '../utils/date';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

export default function ISSSpeedChart({ speedHistory }) {
  const data = {
    labels: speedHistory.map((point) => formatTime(point.timestamp * 1000)),
    datasets: [
      {
        label: 'ISS speed km/h',
        data: speedHistory.map((point) => point.speed || 0),
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.16)',
        fill: true,
        tension: 0.42,
        pointRadius: 3,
      },
    ],
  };

  return (
    <section className="glass-panel rounded-3xl p-5">
      <h2 className="font-display text-xl font-bold">ISS speed trend</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Last 30 measurements</p>
      <div className="mt-4 h-72">
        <Line
          data={data}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
            scales: {
              x: { grid: { display: false }, ticks: { maxTicksLimit: 6 } },
              y: { beginAtZero: true, ticks: { callback: (value) => `${Number(value).toLocaleString()}` } },
            },
          }}
        />
      </div>
    </section>
  );
}
