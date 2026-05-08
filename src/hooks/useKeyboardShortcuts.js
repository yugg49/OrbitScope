import { useEffect } from 'react';

export function useKeyboardShortcuts({ onRefresh, onTheme }) {
  useEffect(() => {
    const handler = (event) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.key.toLowerCase() === 'r') onRefresh?.();
      if (event.key.toLowerCase() === 't') onTheme?.();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onRefresh, onTheme]);
}
