// AdminStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminDashboard from '../Components/Dashboard/AdminDashboard';

import LeadStatusOverviewScreen from '../screens/admin/LeadStatusOverviewScreen';
import PerformanceReportsScreen from '../screens/admin/PerformanceReportsScreen';
import SettingsScreen from '../screens/admin/SettingsScreen';
import AuditLogsScreen from '../screens/admin/AuditLogsScreen';
import NotificationsScreen from '../screens/admin/NotificationsScreen';

const Stack = createNativeStackNavigator();

export default function AdminStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ title: 'Admin Dashboard' }} />
      <Stack.Screen name="UserManagement" component={UserManagementScreen} options={{ title: 'User Management' }} />
      <Stack.Screen name="LeadStatusOverview" component={LeadStatusOverviewScreen} options={{ title: 'Lead Status Overview' }} />
      <Stack.Screen name="PerformanceReports" component={PerformanceReportsScreen} options={{ title: 'Performance Reports' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      <Stack.Screen name="AuditLogs" component={AuditLogsScreen} options={{ title: 'Audit Logs' }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
    </Stack.Navigator>
  );
}