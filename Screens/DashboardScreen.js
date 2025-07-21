import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRole } from '../context/RoleContext';

import AdminStack from '../navigation/AdminStack';
import ManagerDashboard from '../Components/Dashboard/ManagerDashboard';
import AgentStack from '../navigation/AgentStack';
import MarketingDashboard from '../Components/Dashboard/ManagerDashboard';
import CRMDashboard from '../Components/Dashboard/CRMDashboard';
import DocumentationDashboard from '../Components/Dashboard/DocumentationDashboard';
import LeadsStack from '../navigation/LeaderStack';
import { NotesProvider } from '../Components/Dashboard/Admin/Note/context/NotesContext';
import TelecallerStack from '../navigation/TelecallerStack';
import ManagerStack from '../navigation/ManagerStack';

export default function RoleBasedDashboard() {
  const { role } = useRole();

  const renderDashboard = () => {
    switch (role) {
      case 'admin':
        return <NotesProvider>
                  <AdminStack />
                </NotesProvider>;
      case 'Manager':
        return <ManagerDashboard />;
      case 'agent':
        return <AgentStack />;
      case 'telecaller':
        return <TelecallerStack/>;
      case 'marketing':
        return <ManagerStack />;
      case 'CRM Executive':
        return <CRMDashboard />;
      case 'Documentation':
        return <DocumentationDashboard />;
      case 'leader':
        return <LeadsStack />;
      default:
        return (
          <View style={styles.centered}>
            <Text>No dashboard available for this role: {role}</Text>
          </View>
        );
    }
  };

  return <View style={styles.container}>{renderDashboard()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
});

