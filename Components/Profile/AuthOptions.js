// /components/Profile/AuthOptions.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';

import AuthActionItem from './AuthActionItem';
import { logoutUser, logoutAllSessions } from '../../Services/authService';

const STORAGE_KEY = 'USE_BIOMETRIC';

export default function AuthOptions() {
  const { logout } = useAuth();
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricSupported, setBiometricSupported] = useState(false);

  useEffect(() => {
    checkBiometricSupport();
    loadStoredBiometricSetting();
  }, []);

  const checkBiometricSupport = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    setBiometricSupported(hasHardware && isEnrolled);
  };

  const loadStoredBiometricSetting = async () => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    setBiometricEnabled(stored === 'true');
  };

  const toggleBiometric = async () => {
    if (!biometricSupported) {
      Alert.alert('Not supported', 'This device does not support biometric authentication.');
      return;
    }

    const auth = await LocalAuthentication.authenticateAsync({
      promptMessage: biometricEnabled
        ? 'Disable biometric login?'
        : 'Enable biometric login?',
    });

    if (auth.success) {
      const newValue = !biometricEnabled;
      setBiometricEnabled(newValue);
      await AsyncStorage.setItem(STORAGE_KEY, String(newValue));
      Alert.alert('Success', newValue ? 'Biometric login enabled' : 'Biometric login disabled');
    } else {
      Alert.alert('Authentication Failed', 'Unable to confirm your identity.');
    }
  };

const handleLogout = () => {
  Alert.alert('Confirm Logout', 'Are you sure you want to logout?', [
    { text: 'Cancel' },
    {
      text: 'Logout',
      onPress: async () => {
        await logout(); // 🔁 now using AuthContext logout
        console.log('Logged out');
      },
    },
  ]);
};

const handleLogoutAll = () => {
  Alert.alert('Logout All Devices', 'This will remove all active sessions.', [
    { text: 'Cancel' },
    {
      text: 'Confirm',
      onPress: async () => {
        // Optional: if your logoutAllSessions() clears server sessions
        await logout(); // local logout
        console.log('Logged out from all devices');
      },
    },
  ]);
};

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Redirect to password update screen.');
    // navigation.navigate('ChangePassword') or open modal
  };

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>🔐 Authentication & Security</Text>

      <AuthActionItem
        icon="key-outline"
        label="Change Password"
        onPress={handleChangePassword}
      />

      <AuthActionItem
        icon="finger-print-outline"
        label="Enable Biometric Login"
        rightElement={
          <Switch
            value={biometricEnabled}
            onValueChange={toggleBiometric}
            thumbColor={biometricEnabled ? '#0d6efd' : '#ccc'}
          />
        }
      />

      <AuthActionItem
        icon="log-out-outline"
        label="Logout"
        color="#ff3d00"
        onPress={handleLogout}
      />

      <AuthActionItem
        icon="exit-outline"
        label="Logout All Devices"
        color="#ff6f00"
        onPress={handleLogoutAll}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    marginTop: 8,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#222',
  },
});
