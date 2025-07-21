import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons, Feather, FontAwesome } from '@expo/vector-icons';
import AttendeeList from '../../components/Meetings/AttendeeList';

const mockMeeting = {
  id: '1',
  title: 'Site Visit – Rosewood Residency',
  property: {
    name: 'Rosewood Residency',
    address: '123 Park Avenue, Bangalore',
  },
  datetime: '2025-07-02T11:00:00',
  location: {
    type: 'onsite', // or 'virtual'
    value: '123 Park Avenue, Bangalore',
    mapUrl: 'https://maps.google.com/?q=123+Park+Avenue',
  },
  attendees: [
    { id: '1', name: 'Raj Mehta', role: 'Agent', status: 'accepted' },
    { id: '2', name: 'Meena Rao', role: 'Lead', status: 'pending' },
    { id: '3', name: 'You', role: 'Manager', status: 'accepted' },
  ],
  notes: 'Showcase 2BHK layout. Bring brochure.',
  attachments: ['FloorPlan.pdf', 'PricingSheet.png'],
};

export default function MeetingDetailsScreen({ route }) {
  const meeting = mockMeeting; // Replace with real data using route.params.meetingId

  const openMap = () => {
    if (meeting.location.type === 'onsite') {
      Linking.openURL(meeting.location.mapUrl);
    }
  };

  const handleStartMeeting = () => {
    if (meeting.location.type === 'virtual') {
      Linking.openURL(meeting.location.value);
    } else {
      // Start internal notes/session view
      alert('Meeting started!');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{meeting.title}</Text>

      <View style={styles.section}>
        <Feather name="home" size={18} color="#333" />
        <Text style={styles.sectionText}>
          {meeting.property.name} – {meeting.property.address}
        </Text>
      </View>

      <View style={styles.section}>
        <Feather name="clock" size={18} color="#333" />
        <Text style={styles.sectionText}>
          {new Date(meeting.datetime).toLocaleString()}
        </Text>
      </View>

      <TouchableOpacity style={styles.section} onPress={openMap}>
        <Feather name="map-pin" size={18} color="#333" />
        <Text style={[styles.sectionText, { color: '#007AFF' }]}>
          {meeting.location.value}
        </Text>
      </TouchableOpacity>

      <Text style={styles.subHeader}>Attendees</Text>
      <AttendeeList attendees={meeting.attendees} />

      <Text style={styles.subHeader}>Notes</Text>
      <View style={styles.noteBox}>
        <Text style={styles.noteText}>{meeting.notes}</Text>
      </View>

      <Text style={styles.subHeader}>Attachments</Text>
      {meeting.attachments.map((file, index) => (
        <View key={index} style={styles.attachmentItem}>
          <FontAwesome name="file" size={16} color="#555" />
          <Text style={styles.attachmentText}>{file}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.startButton} onPress={handleStartMeeting}>
        <Ionicons name="play-circle" size={20} color="#fff" />
        <Text style={styles.startButtonText}>Start Meeting</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  section: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
  sectionText: { marginLeft: 8, fontSize: 16, color: '#444' },
  subHeader: { marginTop: 20, fontSize: 18, fontWeight: '600' },
  noteBox: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  noteText: { fontSize: 15, color: '#333' },
  attachmentItem: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  attachmentText: { marginLeft: 8, fontSize: 15, color: '#444' },
  startButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  startButtonText: { color: '#fff', fontSize: 16, marginLeft: 8 },
});
