import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';

const MeetingCard = ({ meeting, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <FontAwesome5 name="building" size={16} color="#444" />
        <Text style={styles.propertyText}>{meeting.property}</Text>
      </View>

      <Text style={styles.title}>{meeting.title}</Text>

      <View style={styles.row}>
        <Feather name="clock" size={16} color="#666" />
        <Text style={styles.timeText}>{meeting.time}</Text>
      </View>

      <View style={styles.row}>
        <Ionicons name="people-outline" size={16} color="#666" />
        <Text style={styles.participantsText}>
          {meeting.participants.join(', ')}
        </Text>
      </View>

      <View style={styles.actionRow}>
        <Text style={styles.actionText}>View / Edit</Text>
        <Ionicons name="chevron-forward" size={18} color="#007AFF" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  propertyText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#444',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#111',
  },
  timeText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
  },
  participantsText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
  },
  actionRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    color: '#007AFF',
    marginRight: 4,
    fontWeight: '500',
  },
});

export default MeetingCard;
