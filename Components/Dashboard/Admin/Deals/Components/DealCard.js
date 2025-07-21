import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

// Props: deal, onPress, showActions (bool)
export default function DealCard({ deal, onPress, showActions = true }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress?.(deal)}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{deal.title}</Text>
        <Text
          style={[
            styles.status,
            deal.status === 'Closed' ? styles.closed : styles.inProgress,
          ]}
        >
          {deal.status}
        </Text>
      </View>

      <Text style={styles.subText}>👤 {deal.client}</Text>
      <Text style={styles.subText}>💰 ₹{deal.amount.toLocaleString()}</Text>
      <Text style={styles.subText}>📅 {deal.date}</Text>

      {/* Stage Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${deal.stage || 0}%` }]} />
      </View>

      {showActions && (
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => console.log('Edit Deal')}>
            <MaterialIcons name="edit" size={20} color="#2980b9" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Download Docs')}>
            <Ionicons name="download-outline" size={20} color="#27ae60" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('View Timeline')}>
            <Ionicons name="time-outline" size={20} color="#8e44ad" />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 14,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2c3e50',
  },
  status: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: '600',
    overflow: 'hidden',
  },
  closed: {
    backgroundColor: '#2ecc71',
    color: '#fff',
  },
  inProgress: {
    backgroundColor: '#f1c40f',
    color: '#000',
  },
  subText: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#3498db',
    borderRadius: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
});