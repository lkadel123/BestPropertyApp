// /screens/Profile/RoleBasedProfileScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRole } from '../context/RoleContext';

import AgentProfileScreen from '../Components/Dashboard/Agent/AgentProfileScreen';
import TelecallerProfileScreen from '../Components/Dashboard/TelliCaller/TelecallerProfileScreen';
import AdminProfileScreen from '../Components/Dashboard/Admin/Profile/AdminProfileScreen'; 
import ManagerProfileScreen from '../Components/Dashboard/Manager/ManagerProfileScreen';

export default function RoleBasedProfileScreen() {
  const { role } = useRole();

  const renderProfile = () => {
    switch (role) {
      case 'agent':
        return <AgentProfileScreen />;
      case 'telecaller':
        return <TelecallerProfileScreen />;
      case 'admin':
        return <AdminProfileScreen />; 
      case 'manager':
        return <ManagerProfileScreen />; 
      default:
        return (
          <View style={styles.centered}>
            <Text>No profile screen available for this role: {role}</Text>
          </View>
        );
    }
  };

  return <View style={styles.container}>{renderProfile()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
