import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const initialDocuments = [
  {
    id: 'doc1',
    leadId: 'L1001',
    name: 'AadharCard.pdf',
    status: 'pending',
    remarks: '',
  },
  {
    id: 'doc2',
    leadId: 'L1002',
    name: 'SaleDeed.jpg',
    status: 'pending',
    remarks: '',
  },
];

export default function VerificationScreen() {
  const [documents, setDocuments] = useState(initialDocuments);

  const updateStatus = (docId, status, remarks = '') => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === docId ? { ...doc, status, remarks } : doc
      )
    );
    Alert.alert('Updated', `Document marked as ${status}.`);
  };

  const renderDocument = ({ item }) => {
    const { id, leadId, name, status, remarks } = item;
    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="document-outline" size={20} color="#555" />
          <Text style={styles.docName}>{name}</Text>
        </View>
        <Text style={styles.meta}>Lead ID: {leadId}</Text>
        <TextInput
          placeholder="Add remarks (if any)..."
          style={styles.input}
          value={remarks}
          onChangeText={(text) =>
            setDocuments(prev =>
              prev.map(doc =>
                doc.id === id ? { ...doc, remarks: text } : doc
              )
            )
          }
        />
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btn, styles.approveBtn]}
            onPress={() => updateStatus(id, 'approved', remarks)}
          >
            <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
            <Text style={styles.btnText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.rejectBtn]}
            onPress={() => updateStatus(id, 'rejected', remarks)}
          >
            <Ionicons name="close-circle-outline" size={18} color="#fff" />
            <Text style={styles.btnText}>Reject</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.statusText}>Status: {status.toUpperCase()}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Document Verification</Text>
      <FlatList
        data={documents}
        keyExtractor={(item) => item.id}
        renderItem={renderDocument}
        ListEmptyComponent={<Text style={styles.emptyText}>No documents to verify.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4', padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  docName: { fontSize: 16, marginLeft: 8, fontWeight: '500' },
  meta: { fontSize: 13, color: '#666', marginBottom: 6 },
  input: {
    backgroundColor: '#f9f9f9',
    padding: 8,
    borderRadius: 6,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  approveBtn: { backgroundColor: '#28a745' },
  rejectBtn: { backgroundColor: '#dc3545' },
  btnText: { color: '#fff', marginLeft: 6, fontWeight: '600' },
  statusText: {
    marginTop: 8,
    fontSize: 12,
    color: '#555',
    fontStyle: 'italic',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#888',
  },
});
