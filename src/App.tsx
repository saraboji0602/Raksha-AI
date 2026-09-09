import React, { useState } from 'react';
import { AppProvider } from './store/useAppStore';
import { AppShell } from './components/layout/AppShell';
import { LoginScreen } from './components/auth/LoginScreen';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default to logged in for immediate demo, with option to toggle to login screen

  return (
    <AppProvider>
      {isAuthenticated ? (
        <AppShell />
      ) : (
        <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />
      )}
    </AppProvider>
  );
}

export default App;
