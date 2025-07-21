import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

const mockLeads = [
  {
    id: 'L001',
    name: 'Amit Sharma',
    type: 'Buyer',
    requirement: '2 BHK Apartment in Mumbai',
    phone: '9876543210',
    timestamp: '2025-06-26 10:30 AM',
  },
  {
    id: 'L002',
    name: 'Sneha Rathi',
    type: 'Tenant',
    requirement: '1 BHK for Rent in Pune',
    phone: '9123456780',
    timestamp: '2025-06-26 11:15 AM',
  },
  {
    id: 'L003',
    name: 'John D’Souza',
    type: 'Buyer',
    requirement: 'Plot in Hyderabad',
    phone: '9988776655',
    timestamp: '2025-06-26 12:45 PM',
  },
];

export default function IncomingLeadsScreen() {
  const [searchText, setSearchText] = useState('');

  const filteredLeads = mockLeads.filter((lead) =>
    lead.name.toLowerCase().includes(searchText.toLowerCase()) ||
    lead.requirement.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderLead = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.type}>{item.type}</Text>
      </View>
      <Text style={styles.requirement}>{item.requirement}</Text>
      <View style={styles.meta}>
        <Feather name="phone" size={16} color="#555" />
        <Text style={styles.metaText}>{item.phone}</Text>
        <Ionicons name="time-outline" size={16} color="#555" style={{ marginLeft: 12 }} />
        <Text style={styles.metaText}>{item.timestamp}</Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Assign Lead</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search by name or requirement..."
        value={searchText}
        onChangeText={setSearchText}
        style={styles.searchInput}
      />

      <FlatList
        data={filteredLeads}
        keyExtractor={(item) => item.id}
        renderItem={renderLead}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  searchInput: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 15,
    elevation: 1,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  type: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6b7280',
  },
  requirement: {
    fontSize: 14,
    color: '#374151',
    marginTop: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  metaText: {
    fontSize: 13,
    marginLeft: 4,
    color: '#4b5563',
  },
  button: {
    marginTop: 12,
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
