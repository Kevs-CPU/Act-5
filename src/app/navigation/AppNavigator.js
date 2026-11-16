import React from 'react';
import { View } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabNavigator from './MainTabNavigator';
import ActivityDetailScreen from '../screens/activity-detail/ActivityDetailScreen';
import { useAppTheme } from '../providers/ThemeProvider';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { theme, isDark } = useAppTheme();
  const baseTheme = isDark ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: theme.accent,
      background: theme.background,
      card: theme.surface,
      text: theme.text,
      border: theme.border,
      notification: theme.accent,
    },
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator detachInactiveScreens={false} screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.background }, animation: 'slide_from_right', animationDuration: 220, freezeOnBlur: false, gestureEnabled: true }}>
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen name="ActivityDetail" component={ActivityDetailScreen} options={{ animation: 'slide_from_right' }} />
      </Stack.Navigator>
    </NavigationContainer>
    </View>
  );
}
