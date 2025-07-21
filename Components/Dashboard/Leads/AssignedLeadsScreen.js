import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Linking,
} from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';

const mockAssignedLeads = [
  {
    id: 'AL001',
    clientName: 'Ravi Kumar',
    agentName: 'Sneha Rathi',
    requirement: 'Commercial Office in Bangalore',
    phone: '9998887770',
    status: 'In Progress',
    assignedOn: '2025-06-25',
  },
  {
    id: 'AL002',
    clientName: 'Anjali Gupta',
    agentName: 'Rahul Meena',
    requirement: '1BHK for Rent in Indore',
    phone: '8887766655',
    status: 'Follow-Up',
    assignedOn: '2025-06-24',
  },
  {
    id: 'AL003',
    clientName: 'Michael Dsouza',
    agentName: 'Sneha Rathi',
    requirement: 'Farm House near Pune',
    phone: '7776665544',
    status: 'Closed',
    assignedOn: '2025-06-20',
  },
];

export default function AssignedLeadsScreen() {
  const [searchText, setSearchText] = useState('');

  const filteredLeads = mockAssignedLeads.filter(
    (lead) =>
      lead.clientName.toLowerCase().includes(searchText.toLowerCase()) ||
      lead.agentName.toLowerCase().includes(searchText.toLowerCase()) ||
      lead.requirement.toLowerCase().includes(searchText.toLowerCase())
  );

  const statusColor = (status) => {
    switch (status) {
      case 'In Progress':
        return '#3b82f6';
      case 'Follow-Up':
        return '#f59e0b';
      case 'Closed':
        return '#10b981';
      default:
        return '#9ca3af';
    }
  };

  const renderLead = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.clientName}>{item.clientName}</Text>
        <Text style={[styles.status, { color: statusColor(item.status) }]}>
          {item.status}
        </Text>
      </View>

      <Text style={styles.requirement}>{item.requirement}</Text>

      <Text style={styles.agentText}>
        <Feather name="user-check" size={14} color="#4b5563" /> Assigned to{' '}
        <Text style={{ fontWeight: '600' }}>{item.agentName}</Text>
      </Text>

      <View style={styles.metaRow}>
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => Linking.openURL(`tel:${item.phone}`)}
        >
          <Ionicons name="call-outline" size={18} color="#3b82f6" />
          <Text style={styles.callText}>{item.phone}</Text>
        </TouchableOpacity>

        <View style={styles.assignedDate}>
          <MaterialIcons name="event" size={16} color="#6b7280" />
          <Text style={styles.dateText}>{item.assignedOn}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by client, agent, or requirement"
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        data={filteredLeads}
        keyExtractor={(item) => item.id}
        renderItem={renderLead}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f3f4f6',
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 14,
    elevation: 1,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  status: {
    fontSize: 13,
    fontWeight: '600',
  },
  requirement: {
    fontSize: 14,
    color: '#374151',
    marginTop: 4,
    marginBottom: 6,
  },
  agentText: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  callText: {
    fontSize: 13,
    color: '#3b82f6',
    fontWeight: '500',
  },
  assignedDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 13,
    color: '#6b7280',
  },
});
