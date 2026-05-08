import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { DashboardProvider } from './context/DashboardContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import AppShell from './components/AppShell.jsx';
import OfflineBanner from './components/OfflineBanner.jsx';
import ChatbotWindow from './chatbot/ChatbotWindow.jsx';
import './styles.css';
import 'leaflet/dist/leaflet.css';

const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const NewsPage = lazy(() => import('./pages/NewsPage.jsx'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage.jsx'));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <DashboardProvider>
          <BrowserRouter>
            <AppShell>
              <Suspense fallback={<div className="p-6 text-sm text-slate-500">Loading mission console...</div>}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/news" element={<NewsPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                </Routes>
              </Suspense>
            </AppShell>
            <ChatbotWindow />
            <OfflineBanner />
            <Toaster position="top-right" toastOptions={{ className: 'toast-shell' }} />
          </BrowserRouter>
        </DashboardProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
