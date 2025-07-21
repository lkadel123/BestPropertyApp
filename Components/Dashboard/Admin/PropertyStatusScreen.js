import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

const mockProperties = [
  {
    id: '101',
    title: 'Dream Heights',
    location: 'Delhi',
    type: 'Apartment',
    status: 'published',
    postedBy: 'Amit Verma',
    date: '2025-06-24',
  },
  {
    id: '102',
    title: 'Lakeview Cottage',
    location: 'Mumbai',
    type: 'Villa',
    status: 'pending',
    postedBy: 'Priya Mehta',
    date: '2025-06-25',
  },
  {
    id: '103',
    title: 'Skyline Plaza',
    location: 'Bangalore',
    type: 'Commercial',
    status: 'rejected',
    postedBy: 'Rahul Desai',
    date: '2025-06-26',
  },
];

export default function PropertyStatusScreen() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setProperties(mockProperties);
      setLoading(false);
    }, 1000);
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setProperties((prev) =>
      prev.map((prop) =>
        prop.id === id ? { ...prop, status: newStatus } : prop
      )
    );
  };

  const renderProperty = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.meta}>{item.location} • {item.type} • Posted by: {item.postedBy}</Text>
      <Text style={styles.date}>Posted on: {item.date}</Text>

      <View style={styles.statusRow}>
        <Text style={[styles.status,
          item.status === 'published' ? styles.published :
          item.status === 'pending' ? styles.pending : styles.rejected]}
        >
          {item.status.toUpperCase()}
        </Text>

        {item.status === 'pending' && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.approve]}
              onPress={() => handleStatusChange(item.id, 'published')}
            >
              <Text style={styles.buttonText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.reject]}
              onPress={() => handleStatusChange(item.id, 'rejected')}
            >
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading properties...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🏢 Property Status</Text>
      <FlatList
        data={properties}
        keyExtractor={(item) => item.id}
        renderItem={renderProperty}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f9fc', padding: 16 },
  heading: { fontSize: 20, fontWeight: '700', color: '#222', marginBottom: 16 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2 },
  title: { fontSize: 16, fontWeight: '600', color: '#333' },
  meta: { fontSize: 13, color: '#555', marginTop: 4 },
  date: { fontSize: 12, color: '#777', marginTop: 2 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  status: { fontWeight: 'bold', fontSize: 12, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
  published: { backgroundColor: '#d4edda', color: '#155724' },
  pending: { backgroundColor: '#fff3cd', color: '#856404' },
  rejected: { backgroundColor: '#f8d7da', color: '#721c24' },
  actions: { flexDirection: 'row' },
  button: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6, marginLeft: 6 },
  approve: { backgroundColor: '#28a745' },
  reject: { backgroundColor: '#dc3545' },
  buttonText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
