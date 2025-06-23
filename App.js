import React, { useContext } from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';

import AuthProvider,{ AuthContext } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

import AuthStack from './navigation/AuthStack';
import TabNavigator from './navigation/TabNavigator';

// Navigator that switches between Auth and App based on user login
function AppNavigator() {
  const { user } = useContext(AuthContext);
  const { theme } = useTheme(); // 'light' or 'dark'

  return (
    <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
      {user ? <TabNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}

// App root wrapped in Auth and Theme providers
export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </AuthProvider>
  );
}
