import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

const CallScriptAccess = () => {
  return (
    <TouchableOpacity style={styles.container}>
      <Feather name="book-open" size={24} color="#333" />
      <Text style={styles.label}>Access Call Scripts</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});

export default CallScriptAccess;
