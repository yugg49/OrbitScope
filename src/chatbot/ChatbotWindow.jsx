import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Download, MessageCircle, Send, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDashboard } from '../context/DashboardContext';
import { askDashboardAi } from '../services/aiService';
import { readJsonStorage, writeJsonStorage } from '../utils/cache';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

const STORAGE_KEY = 'orbitscope.chat.v1';
const REFUSAL = 'I can only answer questions related to the ISS tracker and news dashboard.';

function looksDashboardRelated(input) {
  return /\b(iss|space|astronaut|orbit|latitude|longitude|speed|location|news|article|source|author|dashboard|chart|map)\b/i.test(input);
}

export default function ChatbotWindow() {
  const { iss, news } = useDashboard();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState(() =>
    readJsonStorage(STORAGE_KEY, [
      {
        role: 'assistant',
        content: 'Ask me about the current ISS telemetry, astronauts, loaded news, or dashboard charts.',
      },
    ]),
  );
  const endRef = useRef(null);

  useEffect(() => {
    writeJsonStorage(STORAGE_KEY, messages.slice(-30));
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const context = useMemo(
    () => ({
      iss: {
        current: iss.current,
        locationName: iss.locationName,
        trackedPositions: iss.positions.length,
        astronauts: iss.astronauts,
        lastUpdated: iss.lastUpdated,
      },
      news: news.articles.map(({ title, source, author, publishedAt, description }) => ({
        title,
        source,
        author,
        publishedAt,
        description,
      })),
    }),
    [iss, news.articles],
  );

  async function sendMessage(event) {
    event?.preventDefault();
    const question = input.trim();
    if (!question || typing) return;
    setInput('');
    setMessages((current) => [...current, { role: 'user', content: question }].slice(-30));
    setTyping(true);

    try {
      let answer = REFUSAL;
      if (looksDashboardRelated(question)) {
        answer = await askDashboardAi({ question, context });
        if (!answer || /outside|general knowledge|internet/i.test(answer)) answer = REFUSAL;
      }
      let typed = '';
      const assistantMessage = { role: 'assistant', content: '' };
      setMessages((current) => [...current, assistantMessage].slice(-30));
      for (const char of answer) {
        typed += char;
        await new Promise((resolve) => setTimeout(resolve, 8));
        setMessages((current) => [...current.slice(0, -1), { role: 'assistant', content: typed }].slice(-30));
      }
    } catch (error) {
      toast.error(error.message);
      setMessages((current) => [...current, { role: 'assistant', content: 'AI service is unavailable. Dashboard data remains available.' }].slice(-30));
    } finally {
      setTyping(false);
    }
  }

  function clearChat() {
    const starter = [{ role: 'assistant', content: 'Chat cleared. I can answer from the current dashboard data.' }];
    setMessages(starter);
    writeJsonStorage(STORAGE_KEY, starter);
  }

  function exportChat() {
    const blob = new Blob([messages.map((m) => `${m.role}: ${m.content}`).join('\n\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'orbitscope-chat.txt';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        className="fixed bottom-24 right-4 z-50 grid h-14 w-14 place-items-center rounded-2xl bg-slate-950 text-white shadow-glow dark:bg-white dark:text-slate-950 lg:bottom-6"
        onClick={() => setOpen((value) => !value)}
        aria-label="Open OrbitScope AI"
      >
        {open ? <X /> : <MessageCircle />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.section
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            className="fixed bottom-40 right-4 z-50 flex h-[620px] max-h-[72vh] w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-white/50 bg-white/90 text-black shadow-panel backdrop-blur-2xl dark:border-white/10 dark:bg-white/95 lg:bottom-24"
          >
            <header className="flex items-center justify-between border-b border-slate-200/70 p-4 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-orbit/10 text-orbit">
                  <Bot />
                </div>
                <div>
                  <h2 className="font-display font-bold">OrbitScope AI</h2>
                  <p className="text-xs text-slate-600">Dashboard data only</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button className="button-soft h-9 w-9 p-0" onClick={exportChat} title="Export chat">
                  <Download size={16} />
                </button>
                <button className="button-soft h-9 w-9 p-0" onClick={clearChat} title="Clear chat">
                  <Trash2 size={16} />
                </button>
              </div>
            </header>
            <div className="flex-1 space-y-3 overflow-auto p-4">
              {messages.map((message, index) => (
                <ChatMessage key={`${message.role}-${index}`} message={message} />
              ))}
              {typing && <TypingIndicator />}
              <div ref={endRef} />
            </div>
            <form className="border-t border-slate-200/70 p-3 dark:border-white/10" onSubmit={sendMessage}>
              <div className="flex gap-2">
                <input
                  className="control flex-1 text-black placeholder:text-slate-400 dark:text-black"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about ISS or loaded news"
                  aria-label="Chat message"
                />
                <button className="button-primary px-3" type="submit" disabled={typing}>
                  <Send size={17} />
                </button>
              </div>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
