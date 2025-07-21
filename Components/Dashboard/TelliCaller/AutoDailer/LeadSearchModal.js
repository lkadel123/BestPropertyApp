// LeadSearchModal.js
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LeadSearchModal({
  visible,
  onClose,
  searchQuery,
  setSearchQuery,
  leads,
  onSelect,
}) {
  const filteredLeads = leads.filter((lead) =>
    lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.phone?.replace(/\D/g, '').includes(searchQuery.replace(/\D/g, ''))
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.leadItem}
      onPress={() => {
        onSelect(item); // Pass entire lead object
        onClose();
      }}
    >
      <Text style={styles.leadItemText}>{item.name || 'Unknown'}</Text>
      <Text style={styles.leadItemSubText}>{item.phone || 'N/A'}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>Select Lead</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#e74c3c" />
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or phone..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* Lead List */}
          <FlatList
            data={filteredLeads}
            keyExtractor={(item) => item.id?.toString()}
            renderItem={renderItem}
            style={styles.leadList}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 12,
    padding: 16,
    maxHeight: '80%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  leadList: {
    maxHeight: 300,
  },
  leadItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  leadItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  leadItemSubText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});
