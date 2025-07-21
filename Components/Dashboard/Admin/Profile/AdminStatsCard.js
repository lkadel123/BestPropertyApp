import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const stats = [
  { icon: 'supervised-user-circle', label: 'Total Users', value: 124 },
  { icon: 'event-available', label: 'Active Sessions', value: 12 },
  { icon: 'report-problem', label: 'Reports Raised', value: 3 },
];

export default function AdminStatsCard() {
  return (
    <View>
      <Text style={styles.title}>System Stats</Text>
      <View style={styles.row}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.card}>
            <MaterialIcons name={stat.icon} size={28} color="#555" />
            <Text style={styles.label}>{stat.label}</Text>
            <Text style={styles.value}>{stat.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  card: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    elevation: 2,
  },
  label: { marginTop: 5, fontSize: 14, color: '#333' },
  value: { fontSize: 16, fontWeight: 'bold', color: '#000', marginTop: 4 },
});
