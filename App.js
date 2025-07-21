// App.js
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';

import { RoleProvider } from './context/RoleContext';
import AuthProvider from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import AppNavigator from './AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <RoleProvider>
          <AuthProvider>
            <UserProvider>
              <AppNavigator />
            </UserProvider>
          </AuthProvider>
        </RoleProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

