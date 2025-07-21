import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';

const leadJourneyStages = [
  {
    id: '1',
    title: 'Contacted',
    description: 'Lead was contacted via phone or message.',
    icon: <Ionicons name="call" size={20} color="#3498db" />,
    timestamp: '2025-07-02 10:00 AM',
    status: 'done',
  },
  {
    id: '2',
    title: 'Site Visit Scheduled',
    description: 'Visit planned with lead for site inspection.',
    icon: <MaterialIcons name="event-available" size={20} color="#2ecc71" />,
    timestamp: '2025-07-02 01:00 PM',
    status: 'done',
  },
  {
    id: '3',
    title: 'Negotiation Started',
    description: 'Client shared feedback and pricing discussion initiated.',
    icon: <FontAwesome5 name="handshake" size={18} color="#f39c12" />,
    timestamp: '2025-07-02 04:00 PM',
    status: 'in-progress',
  },
  {
    id: '4',
    title: 'Deal Closed',
    description: 'Lead confirmed booking and paid initial amount.',
    icon: <MaterialIcons name="check-circle" size={20} color="#2c3e50" />,
    timestamp: '',
    status: 'pending',
  },
];

export default function LeadJourneyTimelineScreen() {
  const renderStage = ({ item }) => {
    const statusColor =
      item.status === 'done'
        ? '#2ecc71'
        : item.status === 'in-progress'
        ? '#f39c12'
        : '#bdc3c7';

    return (
      <View style={styles.stageRow}>
        <View style={[styles.dot, { backgroundColor: statusColor }]} />
        <View style={styles.stageContent}>
          <View style={styles.stageHeader}>
            {item.icon}
            <Text style={styles.stageTitle}>{item.title}</Text>
          </View>
          <Text style={styles.stageDesc}>{item.description}</Text>
          {item.timestamp !== '' && (
            <Text style={styles.stageTimestamp}>{item.timestamp}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={leadJourneyStages}
        keyExtractor={(item) => item.id}
        renderItem={renderStage}
        contentContainerStyle={styles.timeline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 16,
    textAlign: 'center',
  },
  timeline: {
    paddingBottom: 40,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 16,
    marginTop: 6,
  },
  stageContent: {
    flex: 1,
  },
  stageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  stageTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: '#333',
  },
  stageDesc: {
    fontSize: 14,
    color: '#666',
  },
  stageTimestamp: {
    marginTop: 4,
    fontSize: 12,
    color: '#999',
  },
});
