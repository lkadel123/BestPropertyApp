import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsScreen from '../Screens/SettingsScreen';
import AccountScreen from '../Screens/AccountScreen';
import PrivacySecurityScreen from '../Screens/PrivacySecurityScreen';
import AboutScreen from '../Screens/AboutScreen';

const Stack = createNativeStackNavigator();

export default function SettingsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Settings Main"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Account"
        component={AccountScreen}
        options={{ title: 'Account Settings' }}
      />
      <Stack.Screen
        name="PrivacySecurity"
        component={PrivacySecurityScreen}
        options={{ title: 'Privacy & Security' }}
      />

      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{ title: 'About App' }}
      />
    </Stack.Navigator>

    
  );
}

