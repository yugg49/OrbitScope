import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useDashboard } from '../context/DashboardContext';
import { calculateSpeed } from '../utils/geo';
import { fetchAstronauts, fetchIssLocation, reverseGeocode } from '../services/issService';
import { useInterval } from './useInterval';

export function useISS() {
  const { iss, setIss } = useDashboard();
  const [refreshing, setRefreshing] = useState(false);
  const geocodeAbort = useRef(0);

  const refresh = useCallback(
    async ({ silent = false } = {}) => {
      try {
        if (!silent) setRefreshing(true);
        const [current, astronauts] = await Promise.all([fetchIssLocation(), fetchAstronauts()]);
        setIss((previous) => {
          const last = previous.positions.at(-1);
          const speed = calculateSpeed(last, current);
          const position = { ...current, speed };
          return {
            ...previous,
            current: position,
            astronauts,
            positions: [...previous.positions, position].slice(-30),
            speedHistory: [...previous.speedHistory, position].slice(-30),
            loading: false,
            error: null,
            lastUpdated: Date.now(),
          };
        });
        const requestId = Date.now();
        geocodeAbort.current = requestId;
        reverseGeocode(current.lat, current.lon).then((locationName) => {
          if (geocodeAbort.current === requestId) {
            setIss((previous) => ({ ...previous, locationName }));
          }
        });
      } catch (error) {
        setIss((previous) => ({ ...previous, loading: false, error: error.message }));
        if (!silent) toast.error(error.message);
      } finally {
        setRefreshing(false);
      }
    },
    [setIss],
  );

  useEffect(() => {
    refresh({ silent: true });
  }, [refresh]);

  useInterval(() => refresh({ silent: true }), 15000);

  return { ...iss, refreshing, refresh };
}
