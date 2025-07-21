import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import * as Notifications from 'expo-notifications';

import { loadEvents, saveEvents } from '../utils/EventStorage';
import EventModal from '../Components/EventModal';

export default function EventScreen() {
  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);

  useEffect(() => {
    const load = async () => {
      const stored = await loadEvents();
      setEvents(stored);
    };
    load();
  }, []);

  useEffect(() => {
    saveEvents(events);
  }, [events]);

  const handleSaveEvent = async (eventData) => {
    if (eventData.reminder) {
      const trigger = new Date(eventData.date + 'T' + eventData.time);
      trigger.setMinutes(trigger.getMinutes() - 10); // 10 minutes before

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Upcoming Event',
          body: eventData.title,
        },
        trigger,
      });
    }

    setEvents((prev) => {
      const existing = prev.find((e) => e.id === eventData.id);
      if (existing) {
        return prev.map((e) => (e.id === eventData.id ? eventData : e));
      }
      return [eventData, ...prev];
    });
    setModalVisible(false);
    setEditingEventId(null);
  };

  const handleEdit = (id) => {
    setEditingEventId(id);
    setModalVisible(true);
  };

  const handleDelete = (id) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this event?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: () => setEvents((prev) => prev.filter((e) => e.id !== id)),
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.eventCard}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.details}>{moment(item.date).format('MMM DD, YYYY')} at {item.time}</Text>
      <Text style={styles.details}>📍 {item.location}</Text>
      <Text style={styles.details}>🔁 {item.recurrence || 'None'}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleEdit(item.id)}>
          <Ionicons name="create-outline" size={20} color="#2563eb" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📅 Events</Text>
      <FlatList
        data={events.sort((a, b) => new Date(a.date) - new Date(b.date))}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No events yet.</Text>}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <EventModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingEventId(null);
        }}
        onSave={handleSaveEvent}
        initialData={editingEventId ? events.find((e) => e.id === editingEventId) : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9fafb' },
  heading: { fontSize: 22, fontWeight: '600', marginBottom: 12 },
  empty: { textAlign: 'center', color: '#6b7280', fontStyle: 'italic' },
  eventCard: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: '500' },
  details: { fontSize: 13, color: '#4b5563' },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 16,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    backgroundColor: '#2563eb',
    borderRadius: 30,
    padding: 16,
    elevation: 5,
  },
});