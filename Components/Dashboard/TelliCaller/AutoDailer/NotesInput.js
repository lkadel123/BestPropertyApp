// NotesInput.js
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function NotesInput({ note, setNote }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Notes</Text>
      <TextInput
        style={styles.input}
        placeholder="Type remarks or details..."
        value={note}
        onChangeText={setNote}
        multiline
      />
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
  input: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: '#333',
    textAlignVertical: 'top',
    backgroundColor: '#fdfdfd',
  },
});

