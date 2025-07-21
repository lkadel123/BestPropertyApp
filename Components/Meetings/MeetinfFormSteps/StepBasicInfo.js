import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const StepBasicInfo = ({ formData, updateForm }) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Left: Meeting Title */}
        <View style={styles.inputWrapperLeft}>
          <Text style={styles.label}>Meeting Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Site Visit"
            value={formData.title}
            onChangeText={(text) => updateForm('title', text)}
          />
        </View>

        {/* Right: Property Name */}
        <View style={styles.inputWrapperRight}>
          <Text style={styles.label}>Property Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Rosewood"
            value={formData.property}
            onChangeText={(text) => updateForm('property', text)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputWrapperLeft: {
    width: '49%',
  },
  inputWrapperRight: {
    width: '49%',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    backgroundColor: '#ffffff',
  },
});

export default StepBasicInfo;

