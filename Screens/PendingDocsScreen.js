import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const dummyDocs = [
  {
    id: 'L001',
    clientName: 'Anita Verma',
    property: 'Sunrise Heights',
    pendingItems: ['Aadhar Card', 'PAN Card'],
    status: 'Pending',
  },
  {
    id: 'L002',
    clientName: 'Ravi Kapoor',
    property: 'Green Valley Towers',
    pendingItems: ['Agreement Copy'],
    status: 'Pending',
  },
];

export default function PendingDocsScreen() {
  const [search, setSearch] = useState('');
  const [pendingDocs, setPendingDocs] = useState([]);

  useEffect(() => {
    setPendingDocs(dummyDocs);
  }, []);

  const handleMarkReceived = (id) => {
    Alert.alert(
      'Mark Documents Received',
      'Are you sure all documents have been received?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => {
            setPendingDocs((prev) =>
              prev.map((doc) =>
                doc.id === id ? { ...doc, status: 'Completed' } : doc
              )
            );
          },
        },
      ]
    );
  };

  const filteredDocs = pendingDocs.filter(
    (doc) =>
      doc.clientName.toLowerCase().includes(search.toLowerCase()) ||
      doc.property.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.clientName}>{item.clientName}</Text>
        <Text style={styles.property}>Property: {item.property}</Text>
        <Text style={styles.pendingLabel}>Pending Documents:</Text>
        {item.pendingItems.map((doc, idx) => (
          <Text key={idx} style={styles.docItem}>• {doc}</Text>
        ))}
        <Text style={[styles.status, item.status === 'Completed' && styles.statusDone]}>
          {item.status}
        </Text>
      </View>
      {item.status === 'Pending' && (
        <TouchableOpacity
          onPress={() => handleMarkReceived(item.id)}
          style={styles.receiveBtn}
        >
          <Ionicons name="checkmark-done" size={20} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search by client or property"
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
        placeholderTextColor="#888"
      />
      <FlatList
        data={filteredDocs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No pending documents.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f2f2f2' },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 14,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
  },
  clientName: { fontSize: 16, fontWeight: 'bold' },
  property: { fontSize: 14, color: '#444', marginTop: 2 },
  pendingLabel: { fontSize: 13, color: '#888', marginTop: 6 },
  docItem: { fontSize: 13, color: '#555' },
  status: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#ff9500',
  },
  statusDone: {
    color: '#28a745',
  },
  receiveBtn: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  empty: {
    marginTop: 50,
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
  },
});
