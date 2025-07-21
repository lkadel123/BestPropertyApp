import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthContext } from '../context/AuthContext';
import TabNavigator from './TabNavigator';
import AuthStack from './AuthStack';

// Core Screens
import TaskScreen from '../Components/TaskScreen';
import ReportsScreen from '../Screens/ReportScreen';
import NotificationsScreen from '../Screens/NotificationsScreen';
import PropertyReportScreen from '../Components/Dashboard/Admin/PropertyReportScreen';
import DealsDashboard from '../Components/Dashboard/Admin/DealManagement';
import EventScreen from '../Screens/EventScreen';
import AdminProfileScreen from '../Components/Dashboard/Admin/Profile/AdminProfileScreen';

// 🆕 Project-related Screens
import ProjectDetailsScreen from '../Screens/ProjectDetailsScreen';
import TaskDetailsScreen from '../Screens/TaskDetailsScreen';
import EditProjectScreen from '../Components/Projects/EditProjectScreen';
import ReassignTeamScreen from '../Components/Projects/ReassignTeamScreen';
import QuickActionModal from '../Components/Projects/QuickActionModal';

// Modals
import AddLeadsModal from '../Components/Dashboard/Admin/LeadStatus/AddLeadsModel';
import AddUserScreen from '../Components/Dashboard/Admin/AddUserScreen';
import NoteModal from '../Screens/NoteModel';
import ReminderModal from '../Screens/ReminderModal';

const RootStack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) return <AuthStack />;

  return (
    <RootStack.Navigator screenOptions={{ headerShown: true }}>
      {/* 🔵 Main Tab Navigator */}
      <RootStack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />

      {/* 🔵 Core App Screens */}
      <RootStack.Screen name="TaskScreen" component={TaskScreen} />
      <RootStack.Screen name="ReportsScreen" component={ReportsScreen} />
      <RootStack.Screen name="EventScreen" component={EventScreen} />
      <RootStack.Screen name="NotificationsScreen" component={NotificationsScreen} />
      <RootStack.Screen name="PropertiesScreen" component={PropertyReportScreen} />
      <RootStack.Screen name="DealManagementScreen" component={DealsDashboard} />
      <RootStack.Screen name="ProfileScreen" component={AdminProfileScreen} />

      {/* 🆕 Project & Task Navigation */}
      <RootStack.Screen name="ProjectDetails" component={ProjectDetailsScreen} />
      <RootStack.Screen name="TaskDetails" component={TaskDetailsScreen} />
      <RootStack.Screen name="EditProject" component={EditProjectScreen} />
      <RootStack.Screen name="ReassignTeam" component={ReassignTeamScreen} />

      {/* 🟢 Modals */}
      <RootStack.Screen
        name="AddLeadsModal"
        component={AddLeadsModal}
        options={{ headerShown: false, presentation: 'modal' }}
      />

      <RootStack.Screen
        name="AddMemberModal"
        component={AddUserScreen}
        options={{
          title: 'Add New User',
          presentation: 'transparentModal',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        }}
      />

      <RootStack.Screen
        name="NoteModal"
        component={NoteModal}
        options={{
          headerShown: false,
          presentation: 'transparentModal',
        }}
      />

      <RootStack.Screen
        name="ReminderModal"
        component={ReminderModal}
        options={{
          headerShown: false,
          presentation: 'transparentModal',
        }}
      />

      <RootStack.Screen
        name="QuickActionModal"
        component={QuickActionModal}
        options={{
          presentation: 'modal',
          title: 'Quick Actions',
        }}
      />
    </RootStack.Navigator>
  );
}




