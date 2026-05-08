import apiClient from './apiClient';

export async function askDashboardAi({ question, context }) {
  const payload = { question, context };
  try {
    const { data } = await apiClient.post('/api/chat', payload);
    return data.answer || getLocalDashboardAnswer(question, context);
  } catch (serverError) {
    return getLocalDashboardAnswer(question, context, serverError.message);
  }
}

export function getLocalDashboardAnswer(question, context, providerMessage = '') {
  const lower = question.toLowerCase();
  const current = context?.iss?.current;
  const astronauts = context?.iss?.astronauts;
  const articles = context?.news || [];

  if (/\b(iss|lat|latitude|lon|longitude|location|locarion|where)\b/.test(lower) && current) {
    return `The ISS is currently over ${context.iss.locationName || 'an unresolved region'} at latitude ${Number(current.lat).toFixed(3)} and longitude ${Number(current.lon).toFixed(3)}.`;
  }

  if (/\b(speed|fast|km\/h|kmh)\b/.test(lower) && current) {
    return current.speed
      ? `The latest calculated ISS speed is ${Number(current.speed).toLocaleString()} km/h.`
      : 'The ISS speed is still being calculated from the latest tracked positions.';
  }

  if (/\b(astronaut|people|crew|space)\b/.test(lower) && astronauts) {
    const names = astronauts.people?.map((person) => `${person.name} (${person.craft})`).join(', ');
    return `The dashboard currently reports ${astronauts.count} people in space${names ? `: ${names}` : '.'}`;
  }

  if (/\b(news|article|headline|source|author)\b/.test(lower)) {
    if (!articles.length) return 'No news articles are currently loaded in the dashboard.';
    const topArticles = articles.slice(0, 3).map((article, index) => `${index + 1}. ${article.title} from ${article.source}`).join(' ');
    return `There are ${articles.length} loaded news articles. Top items: ${topArticles}`;
  }

  if (providerMessage) {
    return 'The AI provider is unavailable right now, but I can still answer questions from the loaded ISS tracker and news dashboard data.';
  }

  return 'I can only answer questions related to the ISS tracker and news dashboard.';
}

export function buildPrompt(question, context) {
  return `<s>[INST] You are OrbitScope AI. Answer ONLY from the dashboard data below.
If the user asks anything unrelated or unsupported by this data, answer exactly:
"I can only answer questions related to the ISS tracker and news dashboard."
Keep answers concise.

DASHBOARD DATA:
${JSON.stringify(context, null, 2)}

USER QUESTION:
${question} [/INST]`;
}
