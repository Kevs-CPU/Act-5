import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/home/HomeScreen';
import ActivitiesScreen from '../screens/activities/ActivitiesScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import { useAppTheme } from '../providers/ThemeProvider';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const { theme } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.muted,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopColor: theme.border,
          height: 62,
          paddingTop: 6,
          paddingBottom: 5,
          elevation: 0,
        },
        tabBarLabelStyle: { fontSize: 9, fontWeight: '800', marginTop: 1 },
        tabBarIcon: ({ color, size, focused }) => {
          const iconMap = {
            Home: focused ? 'home' : 'home-outline',
            Activities: focused ? 'briefcase' : 'briefcase-outline',
            Settings: focused ? 'settings' : 'settings-outline',
          };
          return <Ionicons name={iconMap[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Activities" component={ActivitiesScreen} options={{ tabBarLabel: 'My Work' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: 'Settings' }} />
    </Tab.Navigator>
  );
}
