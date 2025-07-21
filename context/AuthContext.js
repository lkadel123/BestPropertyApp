import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import Users from '../assets/Data/Users.json'; // Your mock user list
import { useRole } from './RoleContext'; // Your role context

export const AuthContext = createContext();

const STORAGE_KEYS = {
  useBiometric: 'USE_BIOMETRIC',
  userData: 'USER_DATA',
  sessionExpiry: 'SESSION_EXPIRES_AT',
  refreshToken: 'REFRESH_TOKEN',
};

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);

  const { setRole } = useRole();

  // ✅ Enable or disable biometric login
  const enableBiometric = async (enable) => {
    await AsyncStorage.setItem(STORAGE_KEYS.useBiometric, enable ? 'true' : 'false');
    setIsBiometricEnabled(enable);
  };

  // 🔄 Simulated refresh token function (mock)
  const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) throw new Error('No refresh token found');
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAccessToken = `refreshed-token-${Date.now()}`;
        const newExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
        resolve({ accessToken: newAccessToken, expiresAt: newExpiry });
      }, 300);
    });
  };

  // 🔐 Manual Login
  const login = async ({ email, password }) => {
    const matchedUser = Users.find(
      (u) => u.email === email && u.password === password
    );

    if (!matchedUser) {
      return { success: false, message: 'Invalid email or password' };
    }

    if (!matchedUser.role || matchedUser.role.toLowerCase() === 'guest') {
      return {
        success: false,
        message: 'Guest users are not allowed to log in. Please contact admin.',
      };
    }

    const accessToken = `mock-token-${matchedUser.id}`;
    const refreshToken = `mock-refresh-${matchedUser.id}`;
    const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour session

    const userData = {
      id: matchedUser.id,
      email: matchedUser.email,
      name: matchedUser.name,
      fullName: matchedUser.fullName || matchedUser.name,
      photo: matchedUser.profileImage || matchedUser.imageUrl || null,
      role: matchedUser.role,
      isVerified: matchedUser.isVerified ?? true,
      phone: matchedUser.phone || '',
      token: accessToken,
    };

    setUser(userData);
    setUserToken(accessToken);
    setRole(userData.role);

    await AsyncStorage.setItem(STORAGE_KEYS.userData, JSON.stringify(userData));
    await AsyncStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
    await AsyncStorage.setItem(STORAGE_KEYS.sessionExpiry, expiresAt.toString());

    return { success: true, user: userData };
  };

  // 🚪 Logout
  const logout = async () => {
    setUser(null);
    setUserToken(null);
    setRole(null);
    setIsBiometricEnabled(false);
    await AsyncStorage.clear();
  };

  // 🔁 Load Stored Auth (including biometric & token renewal)
  const loadStoredAuth = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.userData);
      const useBiometric = await AsyncStorage.getItem(STORAGE_KEYS.useBiometric);
      const sessionExpiry = await AsyncStorage.getItem(STORAGE_KEYS.sessionExpiry);
      const storedRefreshToken = await AsyncStorage.getItem(STORAGE_KEYS.refreshToken);

      if (!storedUser) return;

      const parsedUser = JSON.parse(storedUser);
      const { token, role } = parsedUser;

      if (!token || !role || role.toLowerCase() === 'guest') {
        await logout();
        return;
      }

      const now = Date.now();

      if (sessionExpiry && now > Number(sessionExpiry)) {
        if (storedRefreshToken) {
          try {
            const { accessToken, expiresAt } = await refreshAccessToken(storedRefreshToken);
            parsedUser.token = accessToken;
            setUser(parsedUser);
            setUserToken(accessToken);
            setRole(parsedUser.role);

            await AsyncStorage.setItem(STORAGE_KEYS.userData, JSON.stringify(parsedUser));
            await AsyncStorage.setItem(STORAGE_KEYS.sessionExpiry, expiresAt.toString());
          } catch (err) {
            console.warn('Refresh failed:', err.message);
            await logout();
            return;
          }
        } else {
          console.warn('No refresh token available');
          await logout();
          return;
        }
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
