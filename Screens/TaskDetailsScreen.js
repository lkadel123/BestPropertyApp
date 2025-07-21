import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// Simulated mock task fetch function
const mockTask = {
  id: 't123',
  topic: 'Site Visit Follow-Up',
  detail: 'Call lead after site visit to gather feedback and next steps.',
  assignedTo: 'Rohit Mehra',
  status: 'Pending',
  dueDate: '2025-07-20',
  dueTime: '15:30',
  document: 'https://example.com/follow-up-form.pdf',
};

const TaskDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { taskId } = route.params;

  const [task, setTask] = useState(null);

  useEffect(() => {
    // Ideally fetch from service: getTaskById(taskId)
    setTask(mockTask);
  }, [taskId]);

  const toggleStatus = () => {
    const updatedStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    setTask({ ...task, status: updatedStatus });

    // Optionally update backend
    // updateTaskStatus(taskId, updatedStatus);
  };

  const openDocument = () => {
    if (task?.document) {
      Linking.openURL(task.document);
    } else {
      Alert.alert('No document attached');
    }
  };

  if (!task) return <Text style={styles.loading}>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>{task.topic}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>📝 Detail:</Text>
        <Text style={styles.value}>{task.detail}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>👤 Assigned To:</Text>
        <Text style={styles.value}>{task.assignedTo}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>📅 Due Date:</Text>
        <Text style={styles.value}>{task.dueDate}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>⏰ Time:</Text>
        <Text style={styles.value}>{task.dueTime}</Text>
      </View>

      {task.document && (
        <TouchableOpacity style={styles.docButton} onPress={openDocument}>
          <Ionicons name="document" size={18} color="#007BFF" />
          <Text style={styles.docText}>View Attached Document</Text>
        </TouchableOpacity>
      )}

      <View style={styles.section}>
        <Text style={styles.label}>✅ Status:</Text>
        <Text
          style={[
            styles.status,
            { color: task.status === 'Completed' ? '#28a745' : '#f39c12' },
          ]}
        >
          {task.status}
        </Text>
      </View>

      <TouchableOpacity style={styles.toggleButton} onPress={toggleStatus}>
        <MaterialIcons name="sync" size={18} color="#fff" />
        <Text style={styles.toggleText}>
          Mark as {task.status === 'Completed' ? 'Pending' : 'Completed'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  loading: {
    padding: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: '#2C3E50',
  },
  section: {
    marginBottom: 14,
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  value: {
    fontSize: 14,
    color: '#555',
  },
  status: {
    fontSize: 15,
    fontWeight: '700',
  },
  toggleButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    alignItems: 'center',
  },
  toggleText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  docButton: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  docText: {
    color: '#007BFF',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default TaskDetailsScreen;
