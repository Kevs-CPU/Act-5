import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './ThemeProvider';

export default function AppProviders({ children }) {
  return (
    <SafeAreaProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </SafeAreaProvider>
  );
}
