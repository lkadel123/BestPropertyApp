import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const mockInvites = [
  {
    id: '1',
    title: 'Client Zoom Call – Palm Heights',
    date: '2025-07-02T15:00:00',
    status: 'pending',
    property: 'Palm Heights',
    isToday: true,
  },
  {
    id: '2',
    title: 'Site Visit – Hilltop Greens',
    date: '2025-07-03T11:00:00',
    status: 'accepted',
    property: 'Hilltop Greens',
    isToday: false,
  },
];

export default function NotificationHub() {
  const [invites, setInvites] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Replace with real API call
    setInvites(mockInvites);
  }, []);

  const handleResponse = (id, response) => {
    setInvites(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status: response } : item
      )
    );
    Alert.alert(`Meeting ${response.charAt(0).toUpperCase() + response.slice(1)}`);
  };

  const renderItem = ({ item }) => {
    const statusColor = {
      accepted: '#28a745',
      declined: '#dc3545',
      pending: '#ffc107',
    }[item.status];

    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <FontAwesome5 name="building" size={16} color="#555" />
          <Text style={styles.propertyText}>{item.property}</Text>
        </View>

        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.date}>
          <Feather name="clock" />{' '}
          {new Date(item.date).toLocaleString()}
        </Text>

        <Text style={[styles.status, { color: statusColor }]}>
          {item.status.toUpperCase()}
        </Text>

        {item.status === 'pending' && (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#28a745' }]}
              onPress={() => handleResponse(item.id, 'accepted')}
            >
              <Text style={styles.btnText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#dc3545' }]}
              onPress={() => handleResponse(item.id, 'declined')}
            >
              <Text style={styles.btnText}>Decline</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.viewBtn}
          onPress={() => navigation.navigate('MeetingDetails', { meetingId: item.id })}
        >
          <Text style={styles.viewBtnText}>View Details</Text>
          <Ionicons name="chevron-forward" size={18} color="#007AFF" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🔔 Meeting Notifications</Text>
      <FlatList
        data={invites}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={<Text style={styles.empty}>No notifications yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  propertyText: { marginLeft: 6, fontSize: 15, color: '#444' },
  title: { fontSize: 16, fontWeight: '600', marginTop: 4 },
  date: { marginTop: 6, color: '#666' },
  status: { marginTop: 8, fontWeight: 'bold' },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  actionBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  btnText: { color: '#fff', fontWeight: '600' },
  viewBtn: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewBtnText: {
    color: '#007AFF',
    fontSize: 15,
    fontWeight: '500',
    marginRight: 4,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#999',
  },
});
