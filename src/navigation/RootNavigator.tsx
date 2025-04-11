import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import StoryScreen from '../screens/StoryScreen';
import FinancialDashboardScreen from '../screens/FinancialDashboardScreen';
import DecisionScreen from '../screens/DecisionScreen';
import EventScreen from '../screens/EventScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4f4f4',
        },
        headerTintColor: '#333',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Financial Journey' }} 
      />
      <Stack.Screen 
        name="Story" 
        component={StoryScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Dashboard" 
        component={FinancialDashboardScreen} 
        options={{ title: 'Your Finances' }} 
      />
      <Stack.Screen 
        name="Decision" 
        component={DecisionScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Event" 
        component={EventScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: 'Settings' }} 
      />
    </Stack.Navigator>
  );
};

export default RootNavigator; 