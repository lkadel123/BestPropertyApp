import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';

export default function UploadDocumentScreen() {
  const [leadId, setLeadId] = useState('');
  const [documents, setDocuments] = useState([]);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (result?.assets) {
        const pickedDocs = result.assets.map((file) => ({
          name: file.name,
          uri: file.uri,
          type: file.mimeType || 'application/octet-stream',
        }));
        setDocuments((prev) => [...prev, ...pickedDocs]);
      }
    } catch (err) {
      console.error('Document pick error:', err);
    }
  };

  const removeDocument = (index) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (!leadId || documents.length === 0) {
      Alert.alert('Missing Info', 'Please enter Lead ID and select documents.');
      return;
    }

    // Simulate upload / save to API
    Alert.alert('Success', `Uploaded ${documents.length} documents for Lead ${leadId}.`);
    setLeadId('');
    setDocuments([]);
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.docItem}>
      <Ionicons name="document-outline" size={18} color="#444" />
      <Text style={styles.docName}>{item.name}</Text>
      <TouchableOpacity onPress={() => removeDocument(index)}>
        <Ionicons name="close-circle" size={20} color="#ff3b30" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Documents</Text>
      <TextInput
        placeholder="Enter Lead ID"
        value={leadId}
        onChangeText={setLeadId}
        style={styles.input}
        placeholderTextColor="#999"
      />

      <TouchableOpacity onPress={pickDocument} style={styles.uploadBtn}>
        <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
        <Text style={styles.uploadText}>Select Document(s)</Text>
      </TouchableOpacity>

      <FlatList
        data={documents}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No documents selected.</Text>}
        style={styles.list}
      />

      <TouchableOpacity onPress={handleUpload} style={styles.submitBtn}>
        <Text style={styles.submitText}>Upload</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  uploadBtn: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  list: {
    marginTop: 16,
    maxHeight: 200,
  },
  docItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  docName: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    fontSize: 14,
    color: '#444',
  },
  submitBtn: {
    marginTop: 24,
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 14,
    marginTop: 16,
  },
});
