import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

const stages = [
  { label: 'Lead Generated', icon: 'user-plus' },
  { label: 'Initial Contact', icon: 'phone' },
  { label: 'Site Visit', icon: 'building' },
  { label: 'Negotiation', icon: 'handshake' },
  { label: 'Booking Confirmed', icon: 'check-circle' },
  { label: 'Document Collection', icon: 'file-alt' },
  { label: 'Loan Processing', icon: 'money-check' },
  { label: 'Finalized', icon: 'flag-checkered' },
];

// Props: currentStageIndex (0-based), optional onStagePress
export default function PipelineView({ currentStageIndex = 0, onStagePress }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {stages.map((stage, index) => {
        const isCompleted = index < currentStageIndex;
        const isActive = index === currentStageIndex;

        return (
          <View key={index} style={styles.stageContainer}>
            {/* Connector Line */}
            {index !== 0 && (
              <View
                style={[
                  styles.line,
                  {
                    backgroundColor: isCompleted ? '#27ae60' : '#ccc',
                  },
                ]}
              />
            )}

            {/* Icon + Label */}
            <View style={styles.stageRow}>
              <View
                style={[
                  styles.circle,
                  isCompleted && styles.completed,
                  isActive && styles.active,
                ]}
              >
                <FontAwesome5
                  name={stage.icon}
                  size={16}
                  color={isCompleted || isActive ? '#fff' : '#888'}
                />
              </View>

              <Text
                style={[
                  styles.label,
                  isCompleted && styles.completedText,
                  isActive && styles.activeText,
                ]}
                onPress={() => onStagePress?.(stage, index)}
              >
                {stage.label}
              </Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  stageContainer: {
    alignItems: 'flex-start',
  },
  line: {
    height: 30,
    width: 2,
    marginLeft: 9,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  completed: {
    backgroundColor: '#27ae60',
  },
  active: {
    backgroundColor: '#2980b9',
  },
  label: {
    fontSize: 14,
    color: '#555',
  },
  completedText: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
  activeText: {
    color: '#2980b9',
    fontWeight: 'bold',
  },
});
