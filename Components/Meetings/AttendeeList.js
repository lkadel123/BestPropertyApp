import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const statusIcons = {
  accepted: { icon: 'checkmark-circle', color: '#28a745' },
  declined: { icon: 'close-circle', color: '#dc3545' },
  pending: { icon: 'help-circle', color: '#ffc107' },
};

// Default attendees for preview/testing
const defaultAttendees = [
  { id: '1', name: 'Raj Mehta', role: 'Agent', status: 'accepted' },
  { id: '2', name: 'Meena Rao', role: 'Lead', status: 'pending' },
  { id: '3', name: 'You', role: 'Manager', status: 'declined' },
  { id: '4', name: 'Extra Person', role: 'Observer', status: 'accepted' },
];

const AttendeeList = ({ attendees = defaultAttendees }) => {
  const displayedAttendees = attendees.slice(0, 3); // Limit to 3

  return (
    <View style={styles.container}>
      {displayedAttendees.length === 0 ? (
        <Text style={styles.emptyText}>No attendees added.</Text>
      ) : (
        displayedAttendees.map((person) => {
          const status = statusIcons[person.status] || statusIcons.pending;

          return (
            <View key={person.id} style={styles.row}>
              <Ionicons name="person-circle-outline" size={24} color="#444" />
              <View style={styles.info}>
                <Text style={styles.name}>{person.name}</Text>
                <Text style={styles.role}>{person.role}</Text>
              </View>
              <Ionicons
                name={status.icon}
                size={20}
                color={status.color}
                style={styles.statusIcon}
              />
            </View>
          );
        })
      )}
      {attendees.length > 3 && (
        <Text style={styles.moreText}>+{attendees.length - 3} more</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  emptyText: {
    color: '#777',
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    color: '#222',
  },
  role: {
    fontSize: 13,
    color: '#666',
  },
  statusIcon: {
    marginLeft: 8,
  },
  moreText: {
    marginTop: 6,
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default AttendeeList;
