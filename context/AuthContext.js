import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRole } from './RoleContext';

export const AuthContext = createContext();

const STORAGE_KEYS = {
  useBiometric: 'USE_BIOMETRIC',
  userData: 'USER_DATA',
};

const LOGIN_URL = 'https://bestpropertiesmohali.com/api/User/adminlogin';
const STATIC_BEARER_TOKEN = '9j1h8hgjO0KUin2bhj58d97jiOh67f5h48hj78hg8vg5j63fo0h930';

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);

  const { setRole } = useRole();

  // Enable/disable biometric login
  const enableBiometric = async (enable) => {
    await AsyncStorage.setItem(STORAGE_KEYS.useBiometric, enable ? 'true' : 'false');
    setIsBiometricEnabled(enable);
  };

  // Login function using your real API
  const login = async ({ email, password }) => {
    try {
      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${STATIC_BEARER_TOKEN}`,
        },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();

      console.log('🔐 Login API Response:', json); // <-- logs full response

      if (!json.status || !json.data) {
        return { success: false, message: json.message || 'Login failed' };
      }

      const userData = {
        id: json.data.id,
        email: json.data.email,
        name: json.data.fullName,
        fullName: json.data.fullName,
        photo: null,
        role: json.data.role,
        isVerified: true,
        phone: json.data.phone || '',
        token: STATIC_BEARER_TOKEN,
      };

      setUser(userData);
      setUserToken(STATIC_BEARER_TOKEN);
      setRole(userData.role);

      await AsyncStorage.setItem(STORAGE_KEYS.userData, JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (err) {
      console.error('❌ Login error:', err);
      return { success: false, message: 'Something went wrong. Please try again.' };
    }
  };

  // Logout function
  const logout = async () => {
    setUser(null);
    setUserToken(null);
    setRole(null);
    setIsBiometricEnabled(false);
    await AsyncStorage.clear();
  };

  // Load stored auth & optionally authenticate with biometrics
  const loadStoredAuth = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.userData);
      const useBiometric = await AsyncStorage.getItem(STORAGE_KEYS.useBiometric);

      if (!storedUser) return;

      const parsedUser = JSON.parse(storedUser);

      if (!parsedUser.token || parsedUser.role.toLowerCase() === 'guest') {
        await logout();
        return;
      }

      if (useBiometric === 'true') {
        setIsBiometricEnabled(true);
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (hasHardware && isEnrolled) {
          const authResult = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Login with Biometrics',
            fallbackLabel: 'Use Passcode',
            disableDeviceFallback: false,
          });

          if (!authResult.success) {
            console.warn('Biometric authentication failed');
            await logout();
            return;
          }
        }
      }

      setUser(parsedUser);
      setUserToken(parsedUser.token);
      setRole(parsedUser.role);
    } catch (err) {
      console.error('Auth Load Error:', err);
      await logout();
    } finally {
      setIsAuthLoading(false);
    }
  };

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        userToken,
        login,
        logout,
        isAuthLoading,
        isLoggedIn,
        enableBiometric,
        isBiometricEnabled,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
