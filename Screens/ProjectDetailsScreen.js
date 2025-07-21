// /screens/Projects/ProjectDetailsScreen.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import ProjectOverviewTab from '../Components/Projects/ProjectOverviewTab';
import TeamTab from '../Components/Projects/TeamTab';
import LeadsTab from '../Components/Projects/LeadsTab';
import TasksTab from '../Components/Projects/TasksTab';

const Tab = createMaterialTopTabNavigator();

const ProjectDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { projectId } = route.params;

  const handleEditProject = () => {
    navigation.navigate('EditProject', { projectId });
  };

  const handleReassignTeam = () => {
    navigation.navigate('ReassignTeam', { projectId });
  };

  const handleFABPress = () => {
    navigation.navigate('QuickActionModal', { projectId }); // could be AddLead or AssignTask
  };

  return (
    <View style={styles.container}>
      {/* Header with Action Buttons */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.header}>📁 Project Details</Text>
          <Text style={styles.projectId}>ID: {projectId}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={handleEditProject} style={styles.iconBtn}>
            <MaterialIcons name="edit" size={20} color="#007BFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleReassignTeam} style={styles.iconBtn}>
            <MaterialIcons name="group-add" size={20} color="#007BFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <Tab.Navigator
          screenOptions={{
            tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
            tabBarIndicatorStyle: { backgroundColor: '#007BFF' },
            tabBarScrollEnabled: true,
          }}
        >
          <Tab.Screen name="Overview" children={() => <ProjectOverviewTab projectId={projectId} />} />
          <Tab.Screen name="Team" children={() => <TeamTab projectId={projectId} />} />
          <Tab.Screen name="Leads" children={() => <LeadsTab projectId={projectId} />} />
          <Tab.Screen name="Tasks" children={() => <TasksTab projectId={projectId} />} />
        </Tab.Navigator>
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity onPress={handleFABPress} style={styles.fab}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  projectId: {
    fontSize: 13,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconBtn: {
    padding: 6,
    backgroundColor: '#F0F4F8',
    borderRadius: 6,
  },
  tabContainer: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#007BFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});

export default ProjectDetailsScreen;
