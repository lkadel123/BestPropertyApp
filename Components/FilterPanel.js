import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FilterPanel({ filters, setFilters }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const toggleModal = () => setModalVisible(!modalVisible);

  const applyFilters = () => {
    setFilters(localFilters);
    toggleModal();
  };

  const clearFilters = () => setLocalFilters({});

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.button} onPress={toggleModal}>
        <Ionicons name="filter" size={18} color="#007bff" />
        <Text style={styles.buttonText}>Filters</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Advanced Filters</Text>
          <TouchableOpacity onPress={toggleModal}>
            <Ionicons name="close" size={26} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalBody}>
          {/* Location */}
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter city, area"
            value={localFilters.location || ''}
            onChangeText={(text) =>
              setLocalFilters({ ...localFilters, location: text })
            }
          />

          {/* Property Type */}
          <Text style={styles.label}>Property Type</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Flat, Plot"
            value={localFilters.type || ''}
            onChangeText={(text) =>
              setLocalFilters({ ...localFilters, type: text })
            }
          />

          {/* Price Range */}
          <Text style={styles.label}>Price Range (₹)</Text>
          <View style={styles.rowInputs}>
            <TextInput
              style={styles.inputHalf}
              placeholder="Min"
              keyboardType="numeric"
              value={localFilters.minPrice || ''}
              onChangeText={(text) =>
                setLocalFilters({ ...localFilters, minPrice: text })
              }
            />
            <TextInput
              style={styles.inputHalf}
              placeholder="Max"
              keyboardType="numeric"
              value={localFilters.maxPrice || ''}
              onChangeText={(text) =>
                setLocalFilters({ ...localFilters, maxPrice: text })
              }
            />
          </View>

          {/* Verified Only */}
          <View style={styles.switchRow}>
            <Text style={styles.label}>Verified Only</Text>
            <Switch
              value={localFilters.verifiedOnly || false}
              onValueChange={(val) =>
                setLocalFilters({ ...localFilters, verifiedOnly: val })
              }
            />
          </View>
        </ScrollView>

        <View style={styles.footerBtns}>
          <TouchableOpacity style={styles.clearBtn} onPress={clearFilters}>
            <Text style={{ color: '#999' }}>Clear All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyBtn} onPress={applyFilters}>
            <Text style={{ color: '#fff' }}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e7f0ff',
    padding: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#007bff',
    marginLeft: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalBody: {
    padding: 16,
  },
  label: {
    marginTop: 12,
    marginBottom: 4,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputHalf: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  footerBtns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  clearBtn: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginRight: 8,
  },
  applyBtn: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
});