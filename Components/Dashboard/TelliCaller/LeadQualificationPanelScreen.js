import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';

const mockLeads = [
  { id: '1', name: 'Amit Sinha', phone: '+91 9876543210', source: 'Website Form' },
  { id: '2', name: 'Neha Kapoor', phone: '+91 9123456789', source: 'Facebook Ad' },
  { id: '3', name: 'Sandeep Yadav', phone: '+91 9988776655', source: 'Referral' },
];

const statuses = ['Contacted', 'Interested', 'Not Interested', 'Follow-up'];

export default function LeadQualificationPanelScreen() {
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [note, setNote] = useState('');
  const [confirmModal, setConfirmModal] = useState(false);

  const lead = mockLeads[currentIndex];

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleConfirmSave = () => {
    console.log('Saving Lead:', {
      leadId: lead.id,
      status: selectedStatus,
      note,
    });

    setConfirmModal(false);

    if (currentIndex < mockLeads.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedStatus('');
      setNote('');
    } else {
      Alert.alert('🎉 Done', 'All leads have been qualified.');
    }
  };

  const handleSave = () => {
    if (!selectedStatus) {
      Alert.alert('Please select a status.');
      return;
    }

    setConfirmModal(true);
  };

  const handleGoBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedStatus('');
      setNote('');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#2980b9" style={{ marginTop: 40 }} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Progress */}
      <Text style={styles.header}>🧾 Lead Qualification Panel</Text>
      <Text style={styles.subHeader}>
        Lead {currentIndex + 1} of {mockLeads.length}
      </Text>
      <View style={styles.progressBar}>
        <View
          style={[styles.progressFill, { width: `${((currentIndex + 1) / mockLeads.length) * 100}%` }]}
        />
      </View>

      {/* Lead Info */}
      <View style={styles.card}>
        <Text style={styles.leadName}>{lead.name}</Text>
        <Text style={styles.leadPhone}>{lead.phone}</Text>
        <Text style={styles.leadSource}>Source: {lead.source}</Text>
      </View>

      {/* Status Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔍 Select Status</Text>
        <View style={styles.statusGrid}>
          {statuses.map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusBtn,
                selectedStatus === status && styles.selectedBtn,
              ]}
              onPress={() => setSelectedStatus(status)}
            >
              <Text
                style={[
                  styles.statusText,
                  selectedStatus === status && styles.selectedText,
                ]}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Notes Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📝 Notes</Text>
        <TextInput
          placeholder="E.g. Interested in 2BHK, follow-up next week..."
          value={note}
          onChangeText={setNote}
          style={styles.noteInput}
          multiline
        />
      </View>

      {/* Navigation Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          onPress={handleGoBack}
          disabled={currentIndex === 0}
          style={[styles.backBtn, currentIndex === 0 && { opacity: 0.5 }]}
        >
          <Feather name="arrow-left" size={16} color="#34495e" />
          <Text style={styles.backBtnText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSave}
          style={[
            styles.saveBtn,
            !selectedStatus && { backgroundColor: '#bdc3c7' },
          ]}
          disabled={!selectedStatus}
        >
          <MaterialIcons name="save" size={18} color="#fff" />
          <Text style={styles.saveBtnText}>Save & Next</Text>
        </TouchableOpacity>
      </View>

      {/* Confirmation Modal */}
      <Modal
        transparent
        visible={confirmModal}
        animationType="fade"
        onRequestClose={() => setConfirmModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Save</Text>
            <Text style={styles.modalMsg}>
              Save status "{selectedStatus}" for {lead.name}?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setConfirmModal(false)}
                style={styles.modalCancel}
              >
                <Text style={{ color: '#555' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirmSave} style={styles.modalConfirm}>
                <Text style={{ color: '#fff' }}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2c3e50',
  },
  subHeader: {
    fontSize: 13,
    textAlign: 'center',
    color: '#7f8c8d',
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2980b9',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    elevation: 2,
    marginBottom: 16,
  },
  leadName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495e',
  },
  leadPhone: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  leadSource: {
    fontSize: 12,
    color: '#999',
  },
  section: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statusBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    backgroundColor: '#ecf0f1',
    marginRight: 10,
    marginBottom: 10,
  },
  selectedBtn: {
    backgroundColor: '#2980b9',
  },
  statusText: {
    color: '#34495e',
    fontWeight: '500',
  },
  selectedText: {
    color: '#fff',
  },
  noteInput: {
    marginTop: 6,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
    color: '#333',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  backBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backBtnText: {
    color: '#34495e',
    fontWeight: '500',
  },
  saveBtn: {
    backgroundColor: '#27ae60',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#00000055',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#2c3e50',
  },
  modalMsg: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  modalCancel: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  modalConfirm: {
    backgroundColor: '#27ae60',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
});
