// ActionButtons.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Entypo, Ionicons } from '@expo/vector-icons';

export default function ActionButtons({
  onSkip,
  onSubmit,
  canSubmit = true,
}) {
  const handleSkip = () => {
    Alert.alert('Skip Lead?', 'Are you sure you want to skip this lead?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Skip', style: 'destructive', onPress: onSkip },
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Entypo name="cross" size={16} color="#e74c3c" />
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.nextButton, !canSubmit && styles.disabledButton]}
        onPress={onSubmit}
        disabled={!canSubmit}
      >
        <Ionicons name="checkmark-circle" size={18} color="#fff" />
        <Text style={styles.nextButtonText}>Save & Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    gap: 12,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fdecea',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderColor: '#e74c3c',
    borderWidth: 1,
  },
  skipText: {
    color: '#e74c3c',
    fontWeight: '600',
    marginLeft: 6,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2980b9',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
});