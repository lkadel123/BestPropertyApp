// /screens/Projects/tabs/LeadsTab.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getLeadsByProject } from '../../Services/leadService';

const FILTERS = ['All', 'New', 'Follow-up', 'Converted'];

const LeadsTab = ({ projectId }) => {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, [projectId]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await getLeadsByProject(projectId);
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads =
    selectedFilter === 'All'
      ? leads
      : leads.filter((lead) => lead.status === selectedFilter);

  const handleCall = (phone) => {
    alert(`Call ${phone}`);
  };

  const handleMessage = (phone) => {
    alert(`Message ${phone}`);
  };

  const handleNavigateToLead = (leadId) => {
    navigation.navigate('LeadDetails', { leadId });
  };

  const renderLead = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleNavigateToLead(item.id)}
    >
      <View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.status}>Status: {item.status}</Text>
        <Text style={styles.phone}>📞 {item.phone}</Text>
        <Text style={styles.date}>⏱ {item.createdAt}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleCall(item.phone)} style={styles.iconBtn}>
          <Ionicons name="call" size={20} color="#007BFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleMessage(item.phone)} style={styles.iconBtn}>
          <MaterialIcons name="message" size={20} color="#007BFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📞 Leads for Project ID: {projectId}</Text>

      {/* Filter Row */}
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

      {/* List */}
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredLeads}
          keyExtractor={(item) => item.id}
          renderItem={renderLead}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No leads in this category.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 12,
    color: '#2C3E50',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
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
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  status: {
    fontSize: 14,
    color: '#777',
    marginBottom: 2,
  },
  phone: {
    fontSize: 13,
    color: '#555',
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  actions: {
    justifyContent: 'center',
    gap: 10,
  },
  iconBtn: {
    padding: 6,
    backgroundColor: '#E8F0FF',
    borderRadius: 8,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    marginTop: 20,
  },
});

export default LeadsTab;
