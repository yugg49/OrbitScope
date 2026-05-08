import { useEffect, useMemo } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet';
import ISSPath from './ISSPath';

function FlyToCurrent({ current }) {
  const map = useMap();
  useEffect(() => {
    if (current) map.flyTo([current.lat, current.lon], map.getZoom(), { duration: 1.1 });
  }, [current, map]);
  return null;
}

export default function ISSMap({ current, positions, locationName }) {
  const icon = useMemo(
    () =>
      L.divIcon({
        html: '<div class="iss-marker" aria-label="ISS marker"></div>',
        className: '',
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      }),
    [],
  );

  const center = current ? [current.lat, current.lon] : [0, 0];

  return (
    <section className="glass-panel overflow-hidden rounded-3xl p-3">
      <div className="h-[420px] overflow-hidden rounded-2xl">
        <MapContainer center={center} zoom={3} minZoom={2} scrollWheelZoom className="z-0">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ISSPath positions={positions} />
          {current && (
            <Marker position={[current.lat, current.lon]} icon={icon}>
              <Tooltip direction="top">ISS over {locationName}</Tooltip>
              <Popup>
                <strong>International Space Station</strong>
                <br />
                {current.lat.toFixed(4)}, {current.lon.toFixed(4)}
                <br />
                {current.speed ? `${current.speed.toLocaleString()} km/h` : 'Speed calculating'}
              </Popup>
            </Marker>
          )}
          <FlyToCurrent current={current} />
        </MapContainer>
      </div>
    </section>
  );
}
