// NotificationsScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const mockNotifications = [
  {
    id: '1',
    title: 'Lead Assigned',
    message: 'A new lead has been assigned to you.',
    role: 'Sales Agent',
    timestamp: '2025-06-28 10:00 AM',
  },
  {
    id: '2',
    title: 'Reminder',
    message: 'Follow-up call due today.',
    role: 'Telecaller',
    timestamp: '2025-06-28 9:00 AM',
  },
];
export default function NotificationsScreen() {
  const [search, setSearch] = useState('');
  const [notifications, setNotifications] = useState(mockNotifications);
  const [sendToAll, setSendToAll] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [role, setRole] = useState('All');

  const handleSend = () => {
    if (!newMessage.trim()) return Alert.alert('Message cannot be empty');
    Alert.alert('✅ Notification Sent', `To: ${sendToAll ? 'All Users' : role}`);
    setNewMessage('');
  };

  const filtered = notifications.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search notifications..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.timestamp}>📤 {item.timestamp} | 👤 {item.role}</Text>
          </View>
        )}
      />

      <Text style={styles.subHeader}>📨 Send Notification</Text>
      <TextInput
        style={styles.input}
        placeholder="Type your message..."
        value={newMessage}
        onChangeText={setNewMessage}
      />
      <View style={styles.row}>
        <Text style={styles.label}>Send to All</Text>
        <Switch value={sendToAll} onValueChange={setSendToAll} />
      </View>

      {!sendToAll && (
        <TextInput
          style={styles.input}
          placeholder="Target Role (e.g. Agent, Admin)"
          value={role}
          onChangeText={setRole}
        />
      )}

      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Ionicons name="send" size={20} color="#fff" />
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    flex: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4a90e2',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  message: {
    color: '#333',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  sendButton: {
    backgroundColor: '#2980b9',
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
});