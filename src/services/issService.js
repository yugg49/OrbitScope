import apiClient from './apiClient';

const ISS_ENDPOINTS = ['/api/iss', 'https://api.wheretheiss.at/v1/satellites/25544'];
const ASTROS_ENDPOINTS = ['/api/astros', 'http://api.open-notify.org/astros.json'];

async function fetchFirstWorking(endpoints, mapper) {
  let lastError;
  for (const endpoint of endpoints) {
    try {
      const response = await apiClient.get(endpoint);
      return mapper(response.data);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error('No endpoint available');
}

export async function fetchIssLocation() {
  return fetchFirstWorking(ISS_ENDPOINTS, (data) => {
    if (data.iss_position) {
      return {
        lat: Number(data.iss_position.latitude),
        lon: Number(data.iss_position.longitude),
        timestamp: data.timestamp,
        source: 'Open Notify',
      };
    }
    return {
      lat: Number(data.latitude),
      lon: Number(data.longitude),
      timestamp: Math.floor((data.timestamp || Date.now()) / (data.timestamp > 10000000000 ? 1000 : 1)),
      source: 'Where The ISS At',
    };
  });
}

export async function fetchAstronauts() {
  return fetchFirstWorking(ASTROS_ENDPOINTS, (data) => ({
    count: Number(data.number || data.people?.length || 0),
    people: (data.people || []).map((person) => ({
      name: person.name,
      craft: person.craft || 'Spacecraft',
    })),
  }));
}

export async function reverseGeocode(lat, lon) {
  try {
    const { data } = await apiClient.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        format: 'jsonv2',
        lat,
        lon,
        zoom: 4,
        addressdetails: 1,
      },
    });
    return (
      data.address?.city ||
      data.address?.state ||
      data.address?.country ||
      data.name ||
      data.display_name ||
      'Open ocean / remote region'
    );
  } catch {
    return 'Open ocean / remote region';
  }
}
