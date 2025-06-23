import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function CardButton() {
  return (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.label}>Book Now</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 100,
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  label: {
    color: '#fff',
    fontWeight: '500',
  },
});
