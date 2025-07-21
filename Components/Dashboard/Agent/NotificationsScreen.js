import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

const dummyNotifications = [
  {
    id: '1',
    type: 'Reminder',
    message: 'Follow-up with Aman P. about site visit tomorrow.',
    timestamp: '2025-07-03 09:30 AM',
    read: false,
  },
  {
    id: '2',
    type: 'Assigned Lead',
    message: 'You’ve been assigned lead: Neha S. - 2 BHK in Bandra.',
    timestamp: '2025-07-03 08:10 AM',
    read: false,
  },
  {
    id: '3',
    type: 'Meeting',
    message: 'Team meeting scheduled at 4 PM today.',
    timestamp: '2025-07-02 07:00 PM',
    read: true,
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(dummyNotifications);

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    Alert.alert('All notifications marked as read');
  };

  const clearAll = () => {
    Alert.alert('Clear All?', 'Are you sure you want to clear notifications?', [
      { text: 'Cancel' },
      {
        text: 'Clear',
        onPress: () => setNotifications([]),
        style: 'destructive',
      },
    ]);
  };

  const renderNotification = ({ item }) => (
    <View style={[styles.card, item.read ? styles.read : styles.unread]}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={
            item.type === 'Reminder'
              ? 'alarm-outline'
              : item.type === 'Assigned Lead'
              ? 'person-add-outline'
              : 'calendar-outline'
          }
          size={22}
          color={item.read ? '#bbb' : '#2980b9'}
        />
      </View>
      <View style={styles.content}>
        <Text style={[styles.message, item.read && styles.messageRead]}>
          {item.message}
        </Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>

      <View style={styles.actionsRow}>
        <TouchableOpacity onPress={markAllAsRead} style={styles.actionBtn}>
          <Feather name="check-circle" size={18} color="#27ae60" />
          <Text style={styles.actionText}>Mark All Read</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={clearAll} style={styles.actionBtn}>
          <Feather name="trash-2" size={18} color="#e74c3c" />
          <Text style={[styles.actionText, { color: '#e74c3c' }]}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No notifications available.</Text>
        }
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
    color: '#2c3e50',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#27ae60',
  },
  listContent: {
    paddingBottom: 60,
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: 'row',
    elevation: 2,
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  messageRead: {
    color: '#999',
    fontWeight: '400',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
  unread: {
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  read: {
    borderLeftWidth: 4,
    borderLeftColor: '#ccc',
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 14,
    marginTop: 50,
    fontStyle: 'italic',
  },
});
