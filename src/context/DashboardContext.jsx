import { createContext, useContext, useMemo, useState } from 'react';

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [iss, setIss] = useState({
    current: null,
    positions: [],
    speedHistory: [],
    locationName: 'Resolving...',
    astronauts: { count: 0, people: [] },
    loading: true,
    error: null,
    lastUpdated: null,
  });
  const [news, setNews] = useState({
    articles: [],
    loading: true,
    error: null,
    cached: false,
    lastUpdated: null,
  });

  const value = useMemo(() => ({ iss, setIss, news, setNews }), [iss, news]);
  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboard must be used inside DashboardProvider');
  return context;
}
