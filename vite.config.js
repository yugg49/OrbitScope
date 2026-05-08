import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

async function readProviderJson(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`AI provider returned a non-JSON response (${response.status}).`);
  }
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

function devApiPlugin(env) {
  return {
    name: 'orbitscope-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/iss', async (_req, res) => {
        try {
          const response = await fetch('http://api.open-notify.org/iss-now.json');
          sendJson(res, response.status, await response.json());
        } catch (error) {
          sendJson(res, 502, { message: error.message });
        }
      });

      server.middlewares.use('/api/astros', async (_req, res) => {
        try {
          const response = await fetch('http://api.open-notify.org/astros.json');
          sendJson(res, response.status, await response.json());
        } catch (error) {
          sendJson(res, 502, { message: error.message });
        }
      });

      server.middlewares.use('/api/news', async (req, res) => {
        const key = env.NEWS_API_KEY || env.VITE_NEWS_API_KEY;
        if (!key) {
          sendJson(res, 200, {
            articles: [
              {
                title: 'NASA shares new Earth-observation insights from orbit',
                source: { name: 'OrbitScope Sample' },
                author: 'Mission Desk',
                publishedAt: new Date().toISOString(),
                description: 'A sample article appears when no news API key is configured.',
                url: 'https://www.nasa.gov/',
                urlToImage: '',
              },
            ],
          });
          return;
        }
        try {
          const url = new URL(req.url, 'http://localhost');
          const response = await fetch(
            `https://newsapi.org/v2/everything?q=${encodeURIComponent(url.searchParams.get('q') || 'space OR science OR technology')}&pageSize=${url.searchParams.get('pageSize') || 10}&sortBy=publishedAt&language=en&apiKey=${key}`,
          );
          sendJson(res, response.status, await response.json());
        } catch (error) {
          sendJson(res, 502, { message: error.message });
        }
      });

      server.middlewares.use('/api/chat', async (req, res) => {
        const token = env.AI_TOKEN || env.VITE_AI_TOKEN;
        if (!token) {
          sendJson(res, 200, { answer: 'AI token is not configured. I can only answer after VITE_AI_TOKEN or AI_TOKEN is set.' });
          return;
        }
        try {
          const { question, context } = await readBody(req);
          const prompt = `<s>[INST] You are OrbitScope AI. Answer ONLY from the dashboard data below. If unrelated, answer exactly: "I can only answer questions related to the ISS tracker and news dashboard."\n\nDASHBOARD DATA:\n${JSON.stringify(context, null, 2)}\n\nUSER QUESTION:\n${question} [/INST]`;
          const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 220, temperature: 0.2, return_full_text: false } }),
          });
          const data = await readProviderJson(response);
          const answer = Array.isArray(data) ? data[0]?.generated_text?.trim() : data.generated_text?.trim();
          sendJson(res, response.status, { answer: answer || data.error || 'I can only answer questions related to the ISS tracker and news dashboard.' });
        } catch (error) {
          sendJson(res, 502, { message: error.message });
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), devApiPlugin(env)],
  server: {
    port: 5173,
  },
  build: {
    sourcemap: true,
  },
  };
});
