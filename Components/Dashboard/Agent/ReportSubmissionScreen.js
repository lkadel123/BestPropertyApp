import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function ReportSubmissionScreen() {
  const [visits, setVisits] = useState('');
  const [leadsFollowedUp, setLeadsFollowedUp] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!visits.trim() && !leadsFollowedUp.trim() && !notes.trim()) {
      Alert.alert('Incomplete', 'Please fill at least one field before submitting.');
      return;
    }

    // Simulate submission
    Alert.alert(
      'Report Submitted',
      `Visits: ${visits || 'N/A'}\nLeads Followed: ${leadsFollowedUp || 'N/A'}\nNotes: ${
        notes || 'None'
      }`
    );

    // Reset after submission
    setVisits('');
    setLeadsFollowedUp('');
    setNotes('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Properties Visited</Text>
        <View style={styles.inputRow}>
          <Ionicons name="location" size={20} color="#2980b9" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="e.g. Galaxy Towers, Horizon Phase 2"
            value={visits}
            onChangeText={setVisits}
            multiline
          />
        </View>

        <Text style={styles.label}>Leads Followed Up</Text>
        <View style={styles.inputRow}>
          <Feather name="users" size={20} color="#27ae60" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="e.g. Rajesh K., Priya S., Follow-up on pricing"
            value={leadsFollowedUp}
            onChangeText={setLeadsFollowedUp}
            multiline
          />
        </View>

        <Text style={styles.label}>Additional Notes</Text>
        <View style={styles.inputRow}>
          <MaterialIcons name="notes" size={20} color="#8e44ad" style={styles.icon} />
          <TextInput
            style={[styles.input, { minHeight: 80 }]}
            placeholder="Anything else worth noting?"
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Feather name="check-circle" size={20} color="#fff" />
          <Text style={styles.submitText}>Submit Report</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f4f6f8',
    flexGrow: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#2c3e50',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginTop: 16,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  icon: {
    marginRight: 8,
    marginTop: 4,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  submitBtn: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 8,
    fontSize: 15,
  },
});
