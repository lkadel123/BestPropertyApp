import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

const StepConfirmSave = ({ formData, onConfirm }) => {
  const {
    title,
    property,
    datetime,
    locationType,
    locationValue,
    attendees = [],
    notes,
    attachments = [],
  } = formData;

  const formattedDate = datetime
    ? new Date(datetime).toLocaleDateString()
    : '';
  const formattedTime = datetime
    ? new Date(datetime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>📄 Review Meeting Info</Text>

      <View style={styles.row}>
        <Feather name="file-text" size={16} color="#555" />
        <Text style={styles.label}>Title:</Text>
        <Text style={styles.value}>{title}</Text>
      </View>

      <View style={styles.row}>
        <Feather name="home" size={16} color="#555" />
        <Text style={styles.label}>Property:</Text>
        <Text style={styles.value}>{property}</Text>
      </View>

      <View style={styles.row}>
        <Feather name="calendar" size={16} color="#555" />
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{formattedDate}</Text>
      </View>

      <View style={styles.row}>
        <Feather name="clock" size={16} color="#555" />
        <Text style={styles.label}>Time:</Text>
        <Text style={styles.value}>{formattedTime}</Text>
      </View>

      <View style={styles.row}>
        <Ionicons name="location-outline" size={16} color="#555" />
        <Text style={styles.label}>Location:</Text>
        <Text style={styles.value}>
          {locationType === 'onsite' ? 'Onsite - ' : 'Virtual - '}
          {locationValue}
        </Text>
      </View>

      <Text style={styles.subTitle}>👥 Attendees</Text>
      {attendees.length > 0 ? (
        attendees.map((person) => (
          <Text key={person.id} style={styles.listItem}>
            • {person.name} ({person.role})
          </Text>
        ))
      ) : (
        <Text style={styles.empty}>No attendees selected</Text>
      )}

      <Text style={styles.subTitle}>📝 Notes</Text>
      <Text style={styles.notes}>{notes || 'None'}</Text>

      <Text style={styles.subTitle}>📎 Attachments</Text>
      {attachments.length > 0 ? (
        attachments.map((file, idx) => (
          <Text key={idx} style={styles.listItem}>
            • {file.name}
          </Text>
        ))
      ) : (
        <Text style={styles.empty}>No files uploaded</Text>
      )}

      <TouchableOpacity style={styles.saveBtn} onPress={onConfirm}>
        <Text style={styles.saveText}>✅ Confirm & Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 40 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 10,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  label: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '500',
    color: '#444',
  },
  value: {
    marginLeft: 6,
    fontSize: 15,
    color: '#333',
    flexShrink: 1,
  },
  subTitle: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  listItem: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
    marginLeft: 10,
  },
  notes: {
    marginTop: 4,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 6,
  },
  empty: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
    marginLeft: 10,
  },
  saveBtn: {
    marginTop: 30,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default StepConfirmSave;
