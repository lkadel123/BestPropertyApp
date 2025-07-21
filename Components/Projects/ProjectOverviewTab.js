import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProjectOverviewTab = ({ projectId }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Overview for Project ID: {projectId}</Text>
      <Text>📍 Location: Sector 80, Mohali</Text>
      <Text>🏗 Status: Active</Text>
      <Text>📆 Start Date: Jan 2024</Text>
      <Text>📊 Total Leads: 150</Text>
      <Text>🚀 Conversion Rate: 12%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 12,
  },
});

export default ProjectOverviewTab;
