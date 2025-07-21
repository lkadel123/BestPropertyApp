import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getTasksByProject } from '../../Services/taskService';
import moment from 'moment';

const statusColors = {
  Pending: '#FFC107',
  Completed: '#4CAF50',
  Overdue: '#FF5252',
};

const TasksTab = ({ projectId }) => {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasksByProject(projectId);
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskPress = (taskId) => {
    navigation.navigate('TaskDetails', { taskId });
  };

  const renderItem = ({ item }) => {
    const dueDateFormatted = moment(item.dueDate).format('MMM D, YYYY');
    const statusColor = statusColors[item.status] || '#888';

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleTaskPress(item.id)}
      >
        <View style={styles.cardLeft}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.meta}>🧑 Assigned to: {item.assignedTo}</Text>
          <Text style={styles.meta}>🗓️ Due: {dueDateFormatted}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📝 Tasks for Project ID: {projectId}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No tasks assigned to this project.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#2C3E50',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  cardLeft: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  meta: {
    fontSize: 13,
    color: '#555',
  },
  statusBadge: {
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    marginTop: 20,
  },
});

export default TasksTab;
