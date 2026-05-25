import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Rehydrate from AsyncStorage on app start
  useEffect(() => {
    (async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem('auth_token'),
          AsyncStorage.getItem('user_data'),
        ]);
        if (storedToken) setToken(storedToken);
        if (storedUser) setUser(JSON.parse(storedUser)); console.log(storedUser)
      } catch (e) {
        // noop
      } finally {
        setInitializing(false);
      }
    })();
  }, []);

  // Call this after a successful login
  async function signIn(nextUser, nextToken) {
    // You already persist to AsyncStorage in LoginScreen; this just updates memory state
    setUser(nextUser || null);
    setToken(nextToken || null);
  }

  // Optional signOut helper if/when you want to centralize logout
  async function signOut({ clearEmail = false } = {}) {
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
      if (clearEmail) {
        await AsyncStorage.multiRemove(['last_email', 'remember_email']);
      }
    } catch {}
    setUser(null);
    setToken(null);
  }

  const value = useMemo(
    () => ({
      initializing,
      isAuthenticated: !!token,
      user,
      token,
      signIn,
      signOut,
      setUser, // expose if you need to update profile locally
    }),
    [initializing, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}