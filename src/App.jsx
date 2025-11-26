import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Intro from './pages/Intro';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Alarm from './pages/Alarm';
import Ritual from './pages/Ritual';
import Pledge from './pages/Pledge';
import { Records, Stats, Challenge, Settings } from './pages/OtherScreens';

const AppContent = () => {
  const { appState, userData } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Simple routing logic based on appState or URL
  // For now, we'll rely on React Router but we can sync with appState if needed

  useEffect(() => {
    // Initial redirection logic could go here
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Intro />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/pledge" element={<Pledge />} /> {/* Added route for Pledge */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/alarm" element={<Alarm />} />
      <Route path="/ritual" element={<Ritual />} />
      <Route path="/records" element={<Records />} />
      <Route path="/stats" element={<Stats />} />
      <Route path="/challenge" element={<Challenge />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;
