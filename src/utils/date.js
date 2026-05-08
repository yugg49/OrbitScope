export function formatDate(value, options = {}) {
  if (!value) return 'Unknown';
  return new Intl.DateTimeFormat('en', {
    dateStyle: options.dateStyle || 'medium',
    timeStyle: options.timeStyle || 'short',
  }).format(new Date(value));
}

export function formatTime(value) {
  return new Intl.DateTimeFormat('en', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(value ? new Date(value) : new Date());
}
