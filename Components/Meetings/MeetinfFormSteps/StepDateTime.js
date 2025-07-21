import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';

const StepDateTime = ({ formData, updateForm }) => {
  const [showPicker, setShowPicker] = useState({ mode: null, visible: false });

  const currentDateTime = formData.datetime ? new Date(formData.datetime) : new Date();

  const handleChange = (event, selected) => {
    if (Platform.OS !== 'ios') setShowPicker({ mode: null, visible: false });

    if (selected) {
      const prev = new Date(formData.datetime || new Date());
      const updated =
        showPicker.mode === 'date'
          ? new Date(selected.setHours(prev.getHours(), prev.getMinutes()))
          : new Date(prev.setHours(selected.getHours(), selected.getMinutes()));

      updateForm('datetime', updated.toISOString());
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Date Picker */}
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            style={styles.selector}
            onPress={() => setShowPicker({ mode: 'date', visible: true })}
          >
            <Feather name="calendar" size={18} color="#555" />
            <Text style={styles.selectorText}>
              {currentDateTime.toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Time Picker */}
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Time</Text>
          <TouchableOpacity
            style={styles.selector}
            onPress={() => setShowPicker({ mode: 'time', visible: true })}
          >
            <Feather name="clock" size={18} color="#555" />
            <Text style={styles.selectorText}>
              {currentDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {showPicker.visible && (
        <DateTimePicker
          mode={showPicker.mode}
          value={currentDateTime}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  halfWidth: {
    width: '49%',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  selectorText: {
    fontSize: 13,
    marginLeft: 10,
    color: '#1f2937',
  },
});

export default StepDateTime;

