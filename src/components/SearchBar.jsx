import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
  return (
    <label className="relative block flex-1">
      <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        className="control w-full pl-10"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search loaded articles"
        aria-label="Search articles"
      />
    </label>
  );
}
