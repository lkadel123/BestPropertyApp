import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function CategoryButton({ label, isSelected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.button, isSelected && styles.selectedButton]}
      onPress={() => onPress?.(label)} // 💡 Safe call in case onPress is missing
    >
      <Text style={[styles.text, isSelected && styles.selectedText]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedButton: {
    backgroundColor: '#007bff',
  },
  text: {
    color: '#333',
    fontSize: 14,
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
