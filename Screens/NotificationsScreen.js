import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { Swipeable } from 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';

const dummyNotifications = [
  {
    id: '1',
    title: 'Meeting Scheduled',
    message: 'Team sync scheduled for 3 PM today.',
    type: 'meeting',
    date: moment().format('YYYY-MM-DD'),
    read: false,
    from: 'System',
  },
  {
    id: '2',
    title: 'Lead Assigned',
    message: 'You have a new lead assigned: Sanjay Kapoor.',
    type: 'lead',
    date: moment().subtract(1, 'day').format('YYYY-MM-DD'),
    read: false,
    from: 'Admin',
  },
  {
    id: '3',
    title: 'System Update',
    message: 'App version 2.1.0 is now live.',
    type: 'system',
    date: moment().subtract(2, 'days').format('YYYY-MM-DD'),
    read: true,
    from: 'System',
  },
];

const filterOptions = ['All', 'System', 'Meeting', 'Lead'];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [filter, setFilter] = useState('All');

  const toggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: !n.read } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filtered = notifications.filter((n) =>
    filter === 'All' ? true : n.type === filter.toLowerCase()
  );

  const grouped = filtered.reduce((acc, item) => {
    const key = moment(item.date).isSame(moment(), 'day')
      ? 'Today'
      : moment(item.date).isSame(moment().subtract(1, 'day'), 'day')
      ? 'Yesterday'
      : 'Earlier';

    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>🔔 Notifications</Text>
        <TouchableOpacity onPress={markAllAsRead}>
          <Text style={styles.markAll}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Row */}
      <View style={styles.filterRow}>
        {filterOptions.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[
              styles.filterBtn,
              filter === opt && styles.activeFilter,
            ]}
            onPress={() => setFilter(opt)}
          >
            <Text
              style={[
                styles.filterText,
                filter === opt && styles.activeFilterText,
              ]}
            >
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Grouped Notifications */}
      {Object.entries(grouped).map(([label, items]) => (
        <View key={label}>
          <Text style={styles.groupTitle}>{label}</Text>
          {items.map((n) => (
            <Swipeable
              key={n.id}
              renderRightActions={() => (
                <TouchableOpacity
                  onPress={() => deleteNotification(n.id)}
                  style={styles.deleteSwipe}
                >
                  <Ionicons name="trash" size={24} color="#fff" />
                </TouchableOpacity>
              )}
            >
              <TouchableOpacity
                style={[
                  styles.notificationCard,
                  !n.read && styles.unreadCard,
                ]}
                onPress={() => toggleRead(n.id)}
              >
                <View style={styles.row}>
                  <Ionicons
                    name={
                      n.type === 'system'
                        ? 'settings'
                        : n.type === 'meeting'
                        ? 'calendar'
                        : 'person'
                    }
                    size={20}
                    color={n.read ? '#888' : '#2563eb'}
                  />
                  <View style={styles.content}>
                    <Text style={styles.titleText}>{n.title}</Text>
                    <Text style={styles.messageText}>{n.message}</Text>
                    <Text style={styles.metaText}>From: {n.from}</Text>
                  </View>
                  <Ionicons
                    name={n.read ? 'mail-open' : 'mail-unread'}
                    size={18}
                    color={n.read ? '#6b7280' : '#10b981'}
                  />
                </View>
              </TouchableOpacity>
            </Swipeable>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f9fafb' },
  title: { fontSize: 22, fontWeight: 'bold' },
  markAll: {
    fontSize: 13,
    color: '#2563eb',
    marginTop: 4,
    textDecorationLine: 'underline',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    marginBottom: 8,
  },
  filterText: {
    fontSize: 13,
    color: '#444',
  },
  activeFilter: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  activeFilterText: {
    color: '#fff',
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 6,
    color: '#111827',
  },
  notificationCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  content: { flex: 1, marginLeft: 10 },
  titleText: {
    fontWeight: '600',
    fontSize: 15,
    color: '#1f2937',
  },
  messageText: {
    color: '#374151',
    fontSize: 13,
    marginTop: 2,
  },
  metaText: {
    color: '#6b7280',
    fontSize: 11,
    marginTop: 2,
  },
  deleteSwipe: {
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    borderRadius: 10,
    marginVertical: 4,
  },
});
