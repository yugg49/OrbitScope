import { Polyline } from 'react-leaflet';

export default function ISSPath({ positions }) {
  const path = positions.slice(-15).map((point) => [point.lat, point.lon]);
  if (path.length < 2) return null;
  return <Polyline positions={path} pathOptions={{ color: '#0ea5e9', weight: 3, opacity: 0.85 }} />;
}
