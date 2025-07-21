import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomNavigator from '../Components/CustomNavigaror';
import { useAuth } from '../context/AuthContext';
import tabNavigatorConfig from '../assets/Data/Tabconfig.json';

// Import all screens
import MeetingsStack from '../navigation/MeetingsStack';
import LeadStatusOverviewScreen from '../Components/Dashboard/Admin/LeadStatusOverviewScreen';
import AddListingScreen from '../Screens/AddListingScreen';
import UserManagementScreen from '../Components/Dashboard/Admin/UserManagementScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import PropertyReportScreen from '../Components/Dashboard/Admin/PropertyReportScreen';
import TaskScreen from '../Components/TaskScreen';
import EventScreen from '../Screens/EventScreen';
import NotificationsScreen from '../Screens/NotificationsScreen';
import ReportsScreen from '../Screens/ReportScreen';
import DealsDashboard from '../Components/Dashboard/Admin/DealManagement';
import AutoDialerScriptsScreen from '../Components/Dashboard/TelliCaller/AutoDialerScriptsScreen';
import FollowUpScreen from '../Screens/FollowUpScreen';
import SiteVisitScreen from '../Screens/SiteVisitScreen';
import PendingDocsScreen from '../Screens/PendingDocsScreen';
import UploadDocumentScreen from '../Screens/UploadDocumentScreen';
import VerificationScreen from '../Screens/VerificationScreen';
import NextCallSuggestionsScreen from '../Components/Dashboard/TelliCaller/NextCallSuggestionsScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { user } = useAuth();
  const role = user?.role || 'Agent';

  // ✅ Safe extraction of config
  const configForRole = tabNavigatorConfig?.[role];
  if (!configForRole || !Array.isArray(configForRole.tabs)) {
    console.warn(`❌ No valid tab config for role: ${role}`);
  }

  const tabs = configForRole?.tabs || [];
  const more = configForRole?.more || [];

  console.log(`🧩 Role: ${role}`);
  console.log(`🧩 Tabs:`, tabs);
  console.log(`🧩 More:`, more);

  // ✅ Screen map
  const screenComponents = {
    Agenda: MeetingsStack,
    Leads: LeadStatusOverviewScreen,
    AddProperty: AddListingScreen,
    Members: UserManagementScreen,
    More: ProfileScreen,

    // More screens
    PropertyReportScreen,
    TaskScreen,
    EventScreen,
    NotificationsScreen,
    ReportsScreen,
    DealManagementScreen: DealsDashboard,
    ProfileScreen,
    NextCallSuggestionsScreen,
    AutoDialerScriptsScreen,
    FollowUpScreen,
    SiteVisitScreen,
    PendingDocsScreen,
    UploadDocumentScreen,
    VerificationScreen,
  };

  console.log('📌 Registered screen names:', Object.keys(screenComponents));

  // ✅ Unique screen names from tabs + more
  const uniqueScreens = [...new Set([...tabs, ...more])].map(item => item.name);

  // ✅ Initial route validation
  const validInitial = tabs?.[0]?.name;
  const initialRoute = screenComponents[validInitial] ? validInitial : Object.keys(screenComponents)[0];

  if (!screenComponents[validInitial]) {
    console.warn(`❗ Initial route "${validInitial}" not found in screenComponents. Defaulting to "${initialRoute}"`);
  }

  // ✅ Final screen list
  const availableScreens = uniqueScreens.filter((screenName) => {
    const isValid = !!screenComponents[screenName];
    if (!isValid) {
      console.warn(`⚠️ Skipping undefined screen: ${screenName}`);
    }
    return isValid;
  });

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: true }}
      tabBar={(props) => <CustomNavigator {...props} />}
      initialRouteName={initialRoute}
    >
      {availableScreens.map((screenName) => (
        <Tab.Screen
          key={screenName}
          name={screenName}
          component={screenComponents[screenName]}
          options={{
            headerShown: screenName !== 'Agenda',
          }}
        />
      ))}
    </Tab.Navigator>
  );
}
