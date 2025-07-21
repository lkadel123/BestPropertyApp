// AppNavigator.js
import React, { useContext, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import { AuthContext } from './context/AuthContext';
import { useUser } from './context/UserContext';

import AuthStack from './navigation/AuthStack';
import RootNavigator from './navigation/RootNavigator';

export default function AppNavigator() {
  const { user, isAuthLoading } = useContext(AuthContext);
  const { setLoggedInUser } = useUser();

  // Sync user to UserContext when it changes
  useEffect(() => {
    setLoggedInUser(user ?? null);
  }, [user]);

  // Show loading indicator while checking auth
  if (isAuthLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  // Switch between Auth flow and Main App
  return user ? <RootNavigator /> : <AuthStack />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

