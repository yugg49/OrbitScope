export default function SortDropdown({ value, onChange }) {
  return (
    <select className="control" value={value} onChange={(event) => onChange(event.target.value)} aria-label="Sort articles">
      <option value="date">Sort by date</option>
      <option value="source">Sort by source</option>
    </select>
  );
}
