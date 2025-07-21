import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';

// Dummy Data - Replace with real API or context
const dummyFollowUps = [
  { id: '1', name: 'Ramesh Sharma', phone: '9876543210', followUpDate: '2025-07-16', status: 'Pending' },
  { id: '2', name: 'Sunita Mehra', phone: '9876509876', followUpDate: '2025-07-15', status: 'Completed' },
];

export default function FollowUpScreen() {
  const [followUps, setFollowUps] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFollowUps();
  }, []);

  const loadFollowUps = () => {
    // Simulate API call
    setFollowUps(dummyFollowUps);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadFollowUps();
      setRefreshing(false);
    }, 1000);
  };

  const handleMarkDone = (id) => {
    setFollowUps(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status: 'Completed' } : item
      )
    );
  };

  const filteredFollowUps = followUps.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.phone}>{item.phone}</Text>
        <Text style={styles.date}>Follow-up: {moment(item.followUpDate).format('DD MMM YYYY')}</Text>
        <Text style={styles.status}>Status: {item.status}</Text>
      </View>
      {item.status !== 'Completed' && (
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => handleMarkDone(item.id)}
        >
          <Ionicons name="checkmark-circle" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search lead..."
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredFollowUps}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.empty}>No follow-ups found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f2f2f2' },
  searchInput: {
    height: 40,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  name: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  phone: { fontSize: 14, color: '#555' },
  date: { fontSize: 13, color: '#777', marginTop: 4 },
  status: { fontSize: 13, color: '#007bff', marginTop: 2 },
  doneButton: {
    backgroundColor: '#28a745',
    padding: 6,
    borderRadius: 50,
    marginLeft: 10,
  },
  empty: { textAlign: 'center', color: '#666', marginTop: 40 },
});
