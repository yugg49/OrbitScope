export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 ${
          isUser
            ? 'bg-slate-100 text-black dark:bg-white'
            : 'bg-slate-900/5 text-black dark:bg-white/85'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
