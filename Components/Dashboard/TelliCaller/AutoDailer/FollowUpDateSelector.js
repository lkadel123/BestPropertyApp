import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function FollowUpDateSelector({ date, setDate }) {
  const [showMode, setShowMode] = useState(null); // 'date' or 'time'

  const showPicker = (mode) => {
    setShowMode(mode);
  };

  const handleDateChange = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      setShowMode(null);
      return;
    }

    if (showMode === 'date') {
      // Store date, wait for time
      const newDate = selectedDate || date || new Date();
      const tempDate = new Date(newDate);
      tempDate.setHours(date?.getHours() || 9);
      tempDate.setMinutes(date?.getMinutes() || 0);
      setDate(tempDate);
      setShowMode('time'); // Show time picker next
    } else if (showMode === 'time') {
      // Merge time into current date
      const tempDate = new Date(date || new Date());
      tempDate.setHours(selectedDate.getHours());
      tempDate.setMinutes(selectedDate.getMinutes());
      setDate(tempDate);
      setShowMode(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Follow-up Date & Time</Text>
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => showPicker('date')}
      >
        <Text style={styles.datePickerText}>
          {date
            ? `${date.toLocaleDateString('en-IN')} - ${date.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
              })}`
            : 'Select Follow-up Date & Time'}
        </Text>
      </TouchableOpacity>

      {showMode && (
        <DateTimePicker
          value={date || new Date()}
          mode={showMode}
          display="default"
          minimumDate={new Date()}
          onChange={handleDateChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    elevation: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 6,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginTop: 4,
  },
  datePickerText: {
    fontSize: 14,
    color: '#333',
  },
});
