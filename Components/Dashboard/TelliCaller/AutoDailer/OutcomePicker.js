// OutcomePicker.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function OutcomePicker({ outcome, setOutcome }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>✅ Call Outcome</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={outcome}
          onValueChange={(value) => setOutcome(value)}
          style={styles.picker}
        >
          <Picker.Item label="-- Select Outcome --" value="" />
          <Picker.Item label="Interested" value="interested" />
          <Picker.Item label="Not Answered" value="not_answered" />
          <Picker.Item label="Follow-up Later" value="follow_up" />
          <Picker.Item label="Not Interested" value="not_interested" />
        </Picker>
      </View>
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    overflow: 'hidden',
  },
  picker: {
    height: 40,
    backgroundColor: '#f2f2f2',
  },
});
