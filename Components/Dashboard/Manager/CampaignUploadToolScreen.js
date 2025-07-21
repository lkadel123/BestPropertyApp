import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { FontAwesome5 } from '@expo/vector-icons';

export default function CampaignUploadToolScreen() {
  const [file, setFile] = useState(null);

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        setFile(result);
        Alert.alert('File Selected', result.name);
        // TODO: Upload file to server or process locally
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'File selection failed');
    }
  };

  const handleUploadToServer = () => {
    if (!file) {
      Alert.alert('No File', 'Please select a file first');
      return;
    }

    // TODO: Send file to backend API
    Alert.alert('Upload Started', `Uploading ${file.name}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📤 Upload Campaign Leads</Text>

      <TouchableOpacity style={styles.uploadBtn} onPress={handleFileUpload}>
        <FontAwesome5 name="file-upload" size={20} color="#fff" />
        <Text style={styles.uploadText}>Choose CSV or Excel File</Text>
      </TouchableOpacity>

      {file && (
        <View style={styles.fileInfo}>
          <Text style={styles.fileName}>📎 {file.name}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.uploadBtn, { backgroundColor: '#27ae60' }]}
        onPress={handleUploadToServer}
      >
        <FontAwesome5 name="cloud-upload-alt" size={20} color="#fff" />
        <Text style={styles.uploadText}>Upload to Server</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fdfdfd',
    flex: 1,
    justifyContent: 'flex-start',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#2c3e50',
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2980b9',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
  },
  uploadText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '500',
  },
  fileInfo: {
    backgroundColor: '#ecf0f1',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  fileName: {
    color: '#34495e',
    fontWeight: '600',
  },
});
