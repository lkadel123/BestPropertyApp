import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';

const mockFollowUps = [
  {
    id: 'F001',
    clientName: 'Ramesh Iyer',
    agentName: 'Sneha Rathi',
    phone: '9876543210',
    requirement: '3BHK Flat in Pune',
    followUpDate: '2025-06-28',
    followUpTime: '11:00 AM',
    status: 'Pending',
    note: 'Client requested site visit confirmation.',
  },
  {
    id: 'F002',
    clientName: 'Ankita Shah',
    agentName: 'Rahul Meena',
    phone: '9988776655',
    requirement: '2BHK for Rent in Ahmedabad',
    followUpDate: '2025-06-27',
    followUpTime: '4:00 PM',
    status: 'Pending',
    note: 'Interested but needs EMI option details.',
  },
  {
    id: 'F003',
    clientName: 'Neeraj Rana',
    agentName: 'Sneha Rathi',
    phone: '9123456780',
    requirement: 'Plot near Dehradun',
    followUpDate: '2025-06-26',
    followUpTime: '2:30 PM',
    status: 'Done',
    note: 'Follow-up completed. Awaiting decision.',
  },
];

export default function FollowUpScreen() {
  const [searchText, setSearchText] = useState('');

  const filteredFollowUps = mockFollowUps.filter(
    (f) =>
      f.clientName.toLowerCase().includes(searchText.toLowerCase()) ||
      f.requirement.toLowerCase().includes(searchText.toLowerCase()) ||
      f.agentName.toLowerCase().includes(searchText.toLowerCase())
  );

  const statusColor = (status) => {
    switch (status) {
      case 'Pending':
        return '#f59e0b';
      case 'Done':
        return '#10b981';
      default:
        return '#9ca3af';
    }
  };

  const renderFollowUp = ({ item }) => (
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

      <Text style={styles.note}>
        <Feather name="edit-3" size={14} /> {item.note}
      </Text>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="calendar-outline" size={16} color="#6b7280" />
          <Text style={styles.metaText}>{item.followUpDate}</Text>
        </View>
        <View style={styles.metaItem}>
          <MaterialIcons name="access-time" size={16} color="#6b7280" />
          <Text style={styles.metaText}>{item.followUpTime}</Text>
        </View>
      </View>

      {item.status === 'Pending' && (
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Mark as Done</Text>
        </TouchableOpacity>
      )}
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
        data={filteredFollowUps}
        keyExtractor={(item) => item.id}
        renderItem={renderFollowUp}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
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
  },
  agentText: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 6,
  },
  note: {
    fontSize: 13,
    color: '#4b5563',
    marginTop: 6,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: '#6b7280',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#10b981',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
