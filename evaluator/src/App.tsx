import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { useEffect, useState } from 'react';
// import { AuthProvider } from './contexts/AuthContext';
// import { DataProvider } from './contexts/DataContext';

import type { UserData } from "./types/types";
import { AuthenticatedUser } from './context/AuthenticatedUserContext';

import Layout1 from './components/layout/layout1';
import LoginView from './pages/login';
import Home from './pages/home';
import RatingView from './pages/rating';
import RatingQuestionnaire from './pages/rating-questionnaire';
import ResultsView from './pages/result';
import SettingsView from './pages/settings';
import RegisterView from './pages/register';

function App() {
  const [authenticatedUserData, setAuthenticatedUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const updateUserData = () => {
      const userDataString: (string | null) = localStorage.getItem('userData');
      setAuthenticatedUserData(userDataString ? JSON.parse(userDataString) : null);
    };

    // Initial load
    updateUserData();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'userData') {
        updateUserData();
      }
    };

    // Listen for custom events (for same-tab updates)
    const handleUserDataChange = () => {
      updateUserData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userDataChanged', handleUserDataChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userDataChanged', handleUserDataChange);
    };

  }, []);

  return (
    <Router>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthenticatedUser user={authenticatedUserData}>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route index element={<LoginView />} />
              <Route path="/" element={<Layout1 />}>
                <Route path="home" element={<Home />} />
                <Route path="rate" element={<RatingView />} />
                <Route path="rate-questionnaire" element={<RatingQuestionnaire />} />
                <Route path="results" element={<ResultsView />} />
                <Route path="settings" element={<SettingsView />} />
                <Route path='register' element={<RegisterView />} />
              </Route>
            </Routes>
          </div>
        </AuthenticatedUser>
      </ThemeProvider>
    </Router>
  )
}

export default App
