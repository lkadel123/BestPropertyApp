import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';

const dummyVisits = [
  {
    id: '1',
    client: 'Rajiv Mehta',
    property: 'Sunshine Apartments',
    date: '2025-07-16',
    time: '15:00',
    status: 'Scheduled',
  },
  {
    id: '2',
    client: 'Priya Sharma',
    property: 'Palm Grove Villas',
    date: '2025-07-14',
    time: '11:00',
    status: 'Completed',
  },
];

export default function SiteVisitScreen() {
  const [visits, setVisits] = useState([]);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadVisits();
  }, []);

  const loadVisits = () => {
    setVisits(dummyVisits);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadVisits();
      setRefreshing(false);
    }, 800);
  };

  const handleMarkComplete = (id) => {
    setVisits(prev =>
      prev.map(visit =>
        visit.id === id ? { ...visit, status: 'Completed' } : visit
      )
    );
  };

  const filteredVisits = visits.filter(visit =>
    visit.client.toLowerCase().includes(search.toLowerCase()) ||
    visit.property.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.client}>{item.client}</Text>
        <Text style={styles.property}>Property: {item.property}</Text>
        <Text style={styles.datetime}>
          {moment(item.date).format('DD MMM')} at {item.time}
        </Text>
        <Text style={styles.status(item.status)}>
          {item.status}
        </Text>
      </View>
      {item.status !== 'Completed' && (
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => handleMarkComplete(item.id)}
        >
          <Ionicons name="checkmark-done" size={20} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search by client or property..."
        placeholderTextColor="#888"
        style={styles.search}
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredVisits}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.empty}>No visits found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  search: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    alignItems: 'center',
  },
  client: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  property: { fontSize: 14, color: '#444' },
  datetime: { fontSize: 13, color: '#666', marginTop: 4 },
  status: (status) => ({
    fontSize: 13,
    marginTop: 2,
    color: status === 'Completed' ? '#28a745' : '#ff9500',
    fontWeight: '600',
  }),
  doneButton: {
    backgroundColor: '#007bff',
    padding: 6,
    borderRadius: 20,
    marginLeft: 10,
  },
  empty: { textAlign: 'center', color: '#888', marginTop: 40 },
});
