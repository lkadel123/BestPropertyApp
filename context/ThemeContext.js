import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

// Create the context
const ThemeContext = createContext();

// Provider component
export function ThemeProvider({ children }) {
  const systemTheme = useColorScheme(); // 'light' | 'dark'
  const [theme, setTheme] = useState(systemTheme || 'light');

  // Sync with system theme on first load or when it changes
  useEffect(() => {
    setTheme(systemTheme);
  }, [systemTheme]);

  // Toggle manually between light and dark
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to access theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
