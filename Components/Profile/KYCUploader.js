import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const role = 'Agent'; // Replace with user context or props

const requiredDocsByRole = {
  Buyer: ['Optional: ID Proof (for loan pre-approval)'],
  Seller: ['PAN Card', 'Aadhaar Card', 'Ownership Proof'],
  Agent: ['RERA ID', 'Firm Registration', 'GST Certificate'],
  Builder: ['Corporate KYC Document'],
};

const KYCUploader = () => {
  const [uploads, setUploads] = useState([]);
  const [status, setStatus] = useState('Pending');
  const [timestamp, setTimestamp] = useState(new Date().toISOString());
  const [rejectionReason, setRejectionReason] = useState(null);

  const pickDocument = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      const newFile = {
        uri: result.assets[0].uri,
        name: `KYC_${Date.now()}.jpg`,
      };
      setUploads([...uploads, newFile]);
      setStatus('Pending');
      setTimestamp(new Date().toISOString());
      Alert.alert('Upload Success', 'Document added for verification.');
    }
  };

  return (
    <View>
      <Text style={styles.heading}>📄 KYC Verification</Text>
      <Text style={styles.roleText}>Role: {role}</Text>

      <Text style={styles.subHeading}>Required Documents:</Text>
      {requiredDocsByRole[role].map((doc, index) => (
        <Text key={index} style={styles.docItem}>• {doc}</Text>
      ))}

      <TouchableOpacity style={styles.uploadBtn} onPress={pickDocument}>
        <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
        <Text style={styles.uploadText}>Upload Document</Text>
      </TouchableOpacity>

      <View style={styles.statusBox}>
        <Text>Status: 
          <Text style={{ color: status === 'Approved' ? 'green' : status === 'Rejected' ? 'red' : '#ff9900' }}>
            {' '}{status}
          </Text>
        </Text>
        <Text>Submitted on: {new Date(timestamp).toLocaleString()}</Text>
        {status === 'Rejected' && (
          <Text style={{ color: 'red' }}>Reason: {rejectionReason}</Text>
        )}
      </View>

      {uploads.map((file, idx) => (
        <Image
          key={idx}
          source={{ uri: file.uri }}
          style={styles.preview}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  roleText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 10,
  },
  subHeading: {
    fontWeight: '500',
    marginBottom: 6,
  },
  docItem: {
    fontSize: 14,
    color: '#333',
  },
  uploadBtn: {
    marginTop: 12,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    color: '#fff',
    fontWeight: '500',
  },
  statusBox: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
  },
  preview: {
    width: '100%',
    height: 120,
    marginTop: 10,
    borderRadius: 8,
  },
});

export default KYCUploader;
