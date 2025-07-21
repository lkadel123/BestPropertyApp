// /screens/Profile/AssignedProjectsCard.js

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// 🧪 Replace with API data later
const mockProjects = [
  {
    id: '1',
    name: 'Sunrise Residency',
    leads: 18,
    siteVisits: 5,
    status: 'Active',
  },
  {
    id: '2',
    name: 'Lakeview Villas',
    leads: 9,
    siteVisits: 3,
    status: 'Pending',
  },
  {
    id: '3',
    name: 'Cityscape Towers',
    leads: 24,
    siteVisits: 8,
    status: 'Active',
  },
  {
    id: '4',
    name: 'Royal Enclave',
    leads: 12,
    siteVisits: 4,
    status: 'Completed',
  },
];

const FILTERS = ['All', 'Active', 'Pending', 'Completed'];

const AssignedProjectsCard = () => {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filteredProjects =
    selectedFilter === 'All'
      ? mockProjects
      : mockProjects.filter((p) => p.status === selectedFilter);

  const handleNavigate = (project) => {
    navigation.navigate('ProjectDetails', { projectId: project.id });
  };

  const renderProjectItem = ({ item }) => (
    <TouchableOpacity
      style={styles.projectCard}
      onPress={() => handleNavigate(item)}
    >
      <View style={styles.left}>
        <Text style={styles.projectName}>{item.name}</Text>
        <Text style={styles.detailText}>Leads: {item.leads}</Text>
        <Text style={styles.detailText}>Site Visits: {item.siteVisits}</Text>
      </View>
      <View style={styles.right}>
        <MaterialCommunityIcons
          name={
            item.status === 'Active'
              ? 'check-circle-outline'
              : item.status === 'Completed'
              ? 'check-bold'
              : 'clock-outline'
          }
          size={24}
          color={
            item.status === 'Active'
              ? '#4CAF50'
              : item.status === 'Completed'
              ? '#3498DB'
              : '#FFC107'
          }
        />
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <Text style={styles.title}>📌 Assigned Projects</Text>

      {/* Filter */}
      <View style={styles.filterRow}>
        {FILTERS.map((filter) => (
          <Pressable
            key={filter}
            onPress={() => setSelectedFilter(filter)}
            style={[
              styles.filterBtn,
              selectedFilter === filter && styles.activeFilterBtn,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.activeFilterText,
              ]}
            >
              {filter}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredProjects}
        keyExtractor={(item) => item.id}
        renderItem={renderProjectItem}
        scrollEnabled={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No projects in this category.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 10,
    flexWrap: 'wrap',
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeFilterBtn: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  filterText: {
    fontSize: 13,
    color: '#555',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: '600',
  },
  projectCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  left: {
    flex: 1,
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  projectName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#2C3E50',
  },
  detailText: {
    fontSize: 14,
    color: '#555',
  },
  statusText: {
    fontSize: 13,
    marginTop: 4,
    color: '#666',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});

export default AssignedProjectsCard;
