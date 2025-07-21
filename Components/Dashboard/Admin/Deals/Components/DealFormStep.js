import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

export default function DealFormStep({
  title,
  fields = [],
  values = {},
  onChange = () => {},
  onNext = () => {},
  onPrevious = () => {},
  showNext = true,
  showPrevious = true,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.stepTitle}>{title}</Text>

      {(fields || []).map((field) => (
        <View key={field.key} style={styles.inputGroup}>
          <Text style={styles.label}>{field.label}</Text>
          <TextInput
            style={styles.input}
            placeholder={field.placeholder}
            value={values[field.key] || ''}
            onChangeText={(text) => onChange(field.key, text)}
            keyboardType={field.keyboardType || 'default'}
            secureTextEntry={field.secureTextEntry || false}
          />
        </View>
      ))}

      <View style={styles.buttonRow}>
        {showPrevious && (
          <TouchableOpacity style={styles.prevButton} onPress={onPrevious}>
            <Text style={styles.buttonText}>← Back</Text>
          </TouchableOpacity>
        )}
        {showNext && (
          <TouchableOpacity style={styles.nextButton} onPress={onNext}>
            <Text style={styles.buttonText}>Next →</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  prevButton: {
    padding: 12,
    backgroundColor: '#bdc3c7',
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  nextButton: {
    padding: 12,
    backgroundColor: '#3498db',
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

