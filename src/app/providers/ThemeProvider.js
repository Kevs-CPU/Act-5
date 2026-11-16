import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkTheme, lightTheme } from '../../core/theme/themes';

const ThemeContext = createContext(null);
const THEME_STORAGE_KEY = '@labspace/theme-mode';

export function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState('light');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((savedMode) => {
        if (isMounted && (savedMode === 'light' || savedMode === 'dark')) {
          setThemeMode(savedMode);
        }
      })
      .catch(() => {
        // Keep the default light theme if local storage is unavailable.
      })
      .finally(() => {
        if (isMounted) setIsHydrated(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    AsyncStorage.setItem(THEME_STORAGE_KEY, themeMode).catch(() => {
      // The theme still works for the current session if persistence fails.
    });
  }, [themeMode, isHydrated]);

  const toggleTheme = useCallback(() => {
    setThemeMode((currentMode) => (currentMode === 'light' ? 'dark' : 'light'));
  }, []);

  const value = useMemo(
    () => ({
      themeMode,
      isDark: themeMode === 'dark',
      theme: themeMode === 'dark' ? darkTheme : lightTheme,
      toggleTheme,
      setThemeMode,
    }),
    [themeMode, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used inside ThemeProvider.');
  }
  return context;
}
