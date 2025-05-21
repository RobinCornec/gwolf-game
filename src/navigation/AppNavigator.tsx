import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen, GameSetup, GameScore, GameRecap, History } from '../screens';
import { RootStackParamList } from '../types';
import { i18n } from '../localization';
import { theme } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Default header options to ensure consistency across screens
const defaultScreenOptions = {
  headerShown: true,
  headerStyle: {
    backgroundColor: theme.colors.primary,
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};

export function AppNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="SplashScreen"
      screenOptions={defaultScreenOptions}
    >
      <Stack.Screen 
        name="SplashScreen" 
        component={SplashScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="GameSetup" 
        component={GameSetup} 
        options={{ 
          title: i18n.t('newGame'),
        }} 
      />
      <Stack.Screen 
        name="GameScore" 
        component={GameScore} 
        options={{ 
          title: i18n.t('scores'),
        }} 
      />
      <Stack.Screen 
        name="GameRecap" 
        component={GameRecap} 
        options={{ 
          title: i18n.t('recap'),
        }} 
      />
      <Stack.Screen 
        name="History" 
        component={History} 
        options={{ 
          title: i18n.t('history'),
        }} 
      />
    </Stack.Navigator>
  );
}
