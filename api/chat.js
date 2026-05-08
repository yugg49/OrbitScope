import axios from 'axios';

function buildPrompt(question, context) {
  return `<s>[INST] You are OrbitScope AI. Answer ONLY from the dashboard data below.
If the user asks anything unrelated or unsupported by this data, answer exactly:
"I can only answer questions related to the ISS tracker and news dashboard."
Keep answers concise.

DASHBOARD DATA:
${JSON.stringify(context, null, 2)}

USER QUESTION:
${question} [/INST]`;
}

export default async function handler(request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }
  if (request.method !== 'POST') {
    response.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const token = process.env.AI_TOKEN || process.env.VITE_AI_TOKEN;
  if (!token) {
    response.status(200).json({ answer: 'AI token is not configured. I can only answer after VITE_AI_TOKEN or AI_TOKEN is set.' });
    return;
  }

  try {
    const { question, context } = request.body || {};
    const { data } = await axios.post(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      {
        inputs: buildPrompt(question, context),
        parameters: { max_new_tokens: 220, temperature: 0.2, return_full_text: false },
      },
      { headers: { Authorization: `Bearer ${token}` }, timeout: 25000 },
    );
    const answer = Array.isArray(data) ? data[0]?.generated_text?.trim() : data.generated_text?.trim();
    response.status(200).json({ answer: answer || 'I can only answer questions related to the ISS tracker and news dashboard.' });
  } catch (error) {
    const providerError =
      typeof error.response?.data === 'string'
        ? 'AI provider returned a non-JSON response.'
        : error.response?.data?.error;
    response.status(502).json({ message: providerError || error.message || 'AI request failed' });
  }
}
