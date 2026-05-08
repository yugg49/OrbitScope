export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 rounded-2xl bg-slate-900/5 px-3 py-2 dark:bg-white/10">
      {[0, 1, 2].map((item) => (
        <span key={item} className="h-2 w-2 animate-bounce rounded-full bg-orbit" style={{ animationDelay: `${item * 100}ms` }} />
      ))}
    </div>
  );
}
