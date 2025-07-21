import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';

const initialTasks = [
  {
    id: '1',
    title: 'Follow up with Rakesh (2 BHK Inquiry)',
    type: 'Lead',
    due: 'Today, 5:00 PM',
    status: 'Pending',
  },
  {
    id: '2',
    title: 'Site Visit at Green Residency',
    type: 'Visit',
    due: 'Today, 3:30 PM',
    status: 'Upcoming',
  },
  {
    id: '3',
    title: 'Upload floor plan for Aman S.',
    type: 'Upload',
    due: 'Tomorrow, 10:00 AM',
    status: 'Pending',
  },
];

const typeColors = {
  Lead: '#3498db',
  Visit: '#27ae60',
  Upload: '#9b59b6',
};

export default function ReceivedTasksScreen() {
  const [tasks, setTasks] = useState(initialTasks);

  const clearAllTasks = () => {
    Alert.alert('Clear All Tasks?', 'This will remove all received tasks.', [
      { text: 'Cancel' },
      {
        text: 'Clear',
        onPress: () => setTasks([]),
        style: 'destructive',
      },
    ]);
  };

  const renderTask = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <View
          style={[
            styles.badge,
            { backgroundColor: typeColors[item.type] || '#7f8c8d' },
          ]}
        >
          <Text style={styles.badgeText}>{item.type}</Text>
        </View>
        <Text
          style={[
            styles.status,
            {
              color:
                item.status === 'Pending'
                  ? '#e67e22'
                  : item.status === 'Upcoming'
                  ? '#27ae60'
                  : '#95a5a6',
            },
          ]}
        >
          {item.status}
        </Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.due}>🕒 {item.due}</Text>
    </View>
  );

  return (
    <View style={styles.container}>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.clearBtn} onPress={clearAllTasks}>
          <Feather name="trash-2" size={16} color="#e74c3c" />
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks assigned today.</Text>
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
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: 14,
  },
  actionsRow: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearText: {
    marginLeft: 6,
    color: '#e74c3c',
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 60,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  due: {
    fontSize: 13,
    color: '#7f8c8d',
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 14,
    marginTop: 40,
    fontStyle: 'italic',
  },
});
