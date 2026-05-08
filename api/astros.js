import axios from 'axios';

export default async function handler(request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const { data } = await axios.get('http://api.open-notify.org/astros.json', { timeout: 10000 });
    response.status(200).json(data);
  } catch (error) {
    response.status(502).json({ message: error.message || 'Unable to fetch astronaut data' });
  }
}
