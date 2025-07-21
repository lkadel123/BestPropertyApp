import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

// Optional: import getProjectById, updateProjectById
// import { getProjectById, updateProjectById } from '../../services/projectService';

const EditProjectScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { projectId } = route.params;

  const [form, setForm] = useState({
    title: '',
    description: '',
    phase: '',
    budget: '',
    startDate: new Date(),
    endDate: new Date(),
  });

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    // Fetch project data using projectId
    // Simulate mock data for now
    const mock = {
      title: 'Green Valley Heights',
      description: 'Premium 2/3BHK Residential Project',
      phase: 'Active',
      budget: '75,00,000',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-12-01'),
    };
    setForm(mock);
  }, [projectId]);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSave = async () => {
    try {
      // await updateProjectById(projectId, form);
      Alert.alert('✅ Success', 'Project updated successfully.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('❌ Error', 'Failed to update project.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>🏷 Project Title</Text>
      <TextInput
        style={styles.input}
        value={form.title}
        onChangeText={(val) => handleChange('title', val)}
      />

      <Text style={styles.label}>📝 Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={form.description}
        onChangeText={(val) => handleChange('description', val)}
        multiline
      />

      <Text style={styles.label}>📌 Phase</Text>
      <TextInput
        style={styles.input}
        value={form.phase}
        onChangeText={(val) => handleChange('phase', val)}
        placeholder="e.g. Active, Planning, Completed"
      />

      <Text style={styles.label}>💰 Budget</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={form.budget}
        onChangeText={(val) => handleChange('budget', val)}
      />

      <Text style={styles.label}>📅 Start Date</Text>
      <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.dateField}>
        <Ionicons name="calendar" size={18} color="#555" />
        <Text style={styles.dateText}>
          {form.startDate.toDateString()}
        </Text>
      </TouchableOpacity>
      {showStartPicker && (
        <DateTimePicker
          value={form.startDate}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {
            setShowStartPicker(false);
            if (selectedDate) handleChange('startDate', selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>📅 End Date</Text>
      <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.dateField}>
        <Ionicons name="calendar" size={18} color="#555" />
        <Text style={styles.dateText}>
          {form.endDate.toDateString()}
        </Text>
      </TouchableOpacity>
      {showEndPicker && (
        <DateTimePicker
          value={form.endDate}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {
            setShowEndPicker(false);
            if (selectedDate) handleChange('endDate', selectedDate);
          }}
        />
      )}

      <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
        <Text style={styles.saveText}>💾 Save Project</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  label: {
    marginTop: 14,
    marginBottom: 6,
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#F9FAFB',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  dateField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F0F4F7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dateText: {
    fontSize: 14,
    color: '#444',
  },
  saveBtn: {
    marginTop: 24,
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default EditProjectScreen;
