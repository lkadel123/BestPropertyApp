import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// Mock team data — replace with API integration later
const mockTeam = [
  {
    id: '1',
    name: 'Ravi Sharma',
    role: 'Sales Agent',
    phone: '9876543210',
    leads: 22,
    tasks: 3,
  },
  {
    id: '2',
    name: 'Priya Kapoor',
    role: 'Site Manager',
    phone: '9988776655',
    leads: 10,
    tasks: 1,
  },
  {
    id: '3',
    name: 'Amit Verma',
    role: 'Telecaller',
    phone: '9123456780',
    leads: 15,
    tasks: 2,
  },
];

const TeamTab = ({ projectId }) => {
  const handleCall = (phone) => {
    // For real apps, link to phone dialer:
    // Linking.openURL(`tel:${phone}`);
    alert(`Call ${phone}`);
  };

  const handleMessage = (phone) => {
    // For real apps, link to messaging:
    // Linking.openURL(`sms:${phone}`);
    alert(`Message ${phone}`);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.left}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.role}>{item.role}</Text>
        <Text style={styles.meta}>📈 Leads: {item.leads}</Text>
        <Text style={styles.meta}>📝 Tasks: {item.tasks}</Text>
      </View>

      <View style={styles.right}>
        <TouchableOpacity onPress={() => handleCall(item.phone)} style={styles.iconBtn}>
          <Ionicons name="call" size={20} color="#007BFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleMessage(item.phone)} style={styles.iconBtn}>
          <MaterialIcons name="message" size={20} color="#007BFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👥 Assigned Team for Project ID: {projectId}</Text>

      <FlatList
        data={mockTeam}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
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
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  left: {
    flex: 1,
  },
  right: {
    justifyContent: 'center',
    gap: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  role: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  meta: {
    fontSize: 13,
    color: '#444',
  },
  iconBtn: {
    padding: 6,
    backgroundColor: '#E8F0FF',
    borderRadius: 8,
    marginTop: 6,
    alignItems: 'center',
  },
});

export default TeamTab;
