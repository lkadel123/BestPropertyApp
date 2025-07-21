import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function TabButton({ label, onPress, active }) {
  return (
    <TouchableOpacity
      style={[styles.button, active && styles.active]}
      onPress={onPress}
    >
      <Text style={[styles.text, active && styles.activeText]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    margin: 5,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  active: {
    backgroundColor: '#4caf50',
  },
  text: {
    fontWeight: '600',
    color: '#333',
  },
  activeText: {
    color: '#fff',
  },
});
