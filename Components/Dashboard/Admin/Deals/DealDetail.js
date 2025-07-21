// DealDetail.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

const dummyDeal = {
  id: 'D001',
  title: 'Deal with Mr. Sharma',
  client: 'Mr. Sharma',
  property: 'Luxury Villa, Sector 76',
  value: '₹1.2 Cr',
  status: 'Negotiation',
  progress: [
    'Lead Contacted',
    'Site Visited',
    'Negotiation',
    'Document Collection',
    'Finalized'
  ],
};

export default function DealDetail() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>📄 Deal Detail</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Client:</Text>
        <Text style={styles.value}>{dummyDeal.client}</Text>

        <Text style={styles.label}>Property:</Text>
        <Text style={styles.value}>{dummyDeal.property}</Text>

        <Text style={styles.label}>Deal Value:</Text>
        <Text style={styles.value}>{dummyDeal.value}</Text>

        <Text style={styles.label}>Status:</Text>
        <Text style={[styles.value, { color: '#f39c12' }]}>{dummyDeal.status}</Text>
      </View>

      {/* 📎 Documents */}
      <View style={styles.docsSection}>
        <Text style={styles.sectionHeader}>📎 Deal Documents</Text>

        <View style={styles.docRow}>
          <TouchableOpacity style={styles.docButton}>
            <FontAwesome5 name="file-download" size={16} color="#2c3e50" />
            <Text style={styles.docText}>PAN.pdf</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.docButton}>
            <FontAwesome5 name="file-download" size={16} color="#2c3e50" />
            <Text style={styles.docText}>Aadhar.jpg</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => Alert.alert('Upload', 'File picker opened')}
        >
          <Ionicons name="cloud-upload" size={18} color="#fff" />
          <Text style={styles.uploadText}>Upload Document</Text>
        </TouchableOpacity>
      </View>

      {/* 🛤️ Timeline */}
      <View style={styles.timelineSection}>
        <Text style={styles.sectionHeader}>🛤️ Deal Progress</Text>
        {dummyDeal.progress.map((stage, index) => (
          <View key={index} style={styles.timelineItem}>
            <View style={styles.circle} />
            <Text style={styles.timelineText}>{stage}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fdfdfd',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  value: {
    fontSize: 15,
    marginBottom: 8,
    color: '#34495e',
  },
  docsSection: {
    backgroundColor: '#f7f9fa',
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#34495e',
  },
  docRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  docButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
    borderRadius: 6,
    width: '48%',
  },
  docText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#2c3e50',
  },
  uploadButton: {
    marginTop: 12,
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  timelineSection: {
    marginTop: 24,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2980b9',
    marginRight: 10,
  },
  timelineText: {
    fontSize: 14,
    color: '#2c3e50',
  },
});