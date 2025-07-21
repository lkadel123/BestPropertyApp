// ScriptSection.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function ScriptSection({ script }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📜 Call Script</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Text style={styles.scriptText}>
          {script || 'No script available for this lead.'}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    elevation: 1,
    marginBottom: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 6,
  },
  scriptText: {
    fontSize: 14,
    color: '#444',
    fontFamily: 'monospace',
    lineHeight: 20,
  },
});
