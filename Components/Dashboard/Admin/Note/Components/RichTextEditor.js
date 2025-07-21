import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const RichTextEditor = ({ value, onChange, label = 'Note Content', placeholder = 'Write your note here...' }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.editor}
        multiline
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        textAlignVertical="top"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontSize: 15,
    fontWeight: '500',
    color: '#444',
  },
  editor: {
    minHeight: 140,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 15,
    lineHeight: 22,
  },
});

export default RichTextEditor;
