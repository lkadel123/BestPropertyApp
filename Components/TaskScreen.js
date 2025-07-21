import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
  Switch,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';

export default function TaskScreen() {
  const [tasks, setTasks] = useState([]);
  const [viewType, setViewType] = useState('received');
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    detail: '',
    dueDate: new Date(),
    dueTime: new Date(),
    assignedTo: '',
    document: null,
    completed: false,
    type: 'sent',
  });

  useEffect(() => {
    Notifications.requestPermissionsAsync();
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
    loadTasksFromStorage();
  }, []);

  const loadTasksFromStorage = async () => {
    try {
      const stored = await AsyncStorage.getItem('calendar_tasks');
      if (stored) setTasks(JSON.parse(stored));
    } catch (err) {
      console.error('Failed to load tasks', err);
    }
  };

  const saveTasksToStorage = async (updatedTasks) => {
    try {
      await AsyncStorage.setItem('calendar_tasks', JSON.stringify(updatedTasks));
    } catch (err) {
      console.error('Failed to save tasks', err);
    }
  };

  const determineStatus = (dueDate) => {
    const now = moment();
    const diff = moment(dueDate).diff(now, 'hours');
    if (diff <= 0) return 'completed';
    if (diff <= 6) return 'nearDeadline';
    if (diff <= 24) return 'recent';
    return 'pending';
  };

  const scheduleNotification = async (taskTitle, dateTime) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Task Reminder',
        body: `Reminder for: ${taskTitle}`,
        badge: 1,
      },
      trigger: new Date(dateTime),
    });
  };

  const handleAddTask = () => {
    if (!newTask.title || !newTask.detail || !newTask.assignedTo) {
      Alert.alert('Missing Info', 'Please fill all fields.');
      return;
    }

    const dueDateTime = new Date(
      newTask.dueDate.getFullYear(),
      newTask.dueDate.getMonth(),
      newTask.dueDate.getDate(),
      newTask.dueTime.getHours(),
      newTask.dueTime.getMinutes()
    );

const taskWithId = {
  ...newTask,
  dueDate: dueDateTime,
  assignedDate: new Date(), // ⬅️ Add assigned date here
  status: determineStatus(dueDateTime),
  id: Date.now().toString(),
};

    const updatedTasks = [...tasks, taskWithId];
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
    scheduleNotification(taskWithId.title, dueDateTime);

    setNewTask({
      title: '',
      detail: '',
      dueDate: new Date(),
      dueTime: new Date(),
      assignedTo: '',
      document: null,
      completed: false,
      type: 'sent',
    });
    setModalVisible(false);
  };

  const toggleTaskStatus = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed, status: task.completed ? 'pending' : 'completed' }
        : task
    );
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync();
    if (!result.canceled) {
      setNewTask(prev => ({ ...prev, document: result.assets[0] }));
    }
  };

  const filteredTasks = tasks.filter(
    task => task.type === viewType && task.status === selectedStatus
  );

  const renderTask = ({ item }) => (
    <View style={[styles.taskCard, item.completed && styles.completedTask]}>
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Switch
          value={item.completed}
          onValueChange={() => toggleTaskStatus(item.id)}
        />
      </View>
      <Text style={styles.metaText}>📝 {item.detail}</Text>
      <Text style={styles.metaText}>📅 {moment(item.dueDate).format('MMM D, h:mm A')}</Text>
      <Text style={styles.metaText}>👤 Assigned to: {item.assignedTo}</Text>
      {item.document && <Text style={styles.metaText}>📎 {item.document.name}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {['received', 'sent'].map(type => (
          <TouchableOpacity key={type} onPress={() => setViewType(type)}>
            <Text style={[styles.tabText, viewType === type && styles.activeTab]}>
              {type === 'received' ? '📥 Received' : '📤 Sent'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.filterRow}>
        {['pending', 'recent', 'nearDeadline', 'completed'].map(status => (
          <TouchableOpacity key={status} onPress={() => setSelectedStatus(status)}>
            <Text style={[styles.statusBtn, selectedStatus === status && styles.statusBtnActive]}>
              {status.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={item => item.id}
        renderItem={renderTask}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalWrapper}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>📝 New Task</Text>
            <TextInput
              placeholder="Task title"
              placeholderTextColor="#666"
              value={newTask.title}
              onChangeText={text => setNewTask(prev => ({ ...prev, title: text }))}
              style={styles.input}
            />
            <TextInput
              placeholder="Task Details"
              placeholderTextColor="#666"
              value={newTask.detail}
              onChangeText={text => setNewTask(prev => ({ ...prev, detail: text }))}
              style={[styles.input, { height: 60 }]}
              multiline
            />
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
              <Text>{moment(newTask.dueDate).format('YYYY-MM-DD')}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                mode="date"
                value={newTask.dueDate}
                onChange={(e, date) => {
                  setShowDatePicker(false);
                  if (date) setNewTask(prev => ({ ...prev, dueDate: date }));
                }}
              />
            )}
            <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.input}>
              <Text>{moment(newTask.dueTime).format('HH:mm')}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                mode="time"
                value={newTask.dueTime}
                onChange={(e, time) => {
                  setShowTimePicker(false);
                  if (time) setNewTask(prev => ({ ...prev, dueTime: time }));
                }}
              />
            )}
            <TextInput
              placeholder="Assigned To"
              placeholderTextColor="#666"
              value={newTask.assignedTo}
              onChangeText={text => setNewTask(prev => ({ ...prev, assignedTo: text }))}
              style={styles.input}
            />
            <TouchableOpacity style={styles.input} onPress={pickDocument}>
              <Text>{newTask.document ? newTask.document.name : '📎 Add Document'}</Text>
            </TouchableOpacity>
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={handleAddTask}>
                <Text style={styles.modalButton}>➕ Add</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButton}>❌ Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 10 },
  tabContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  tabText: { fontSize: 16, color: '#555' },
  activeTab: { fontWeight: 'bold', color: '#007bff' },
  filterRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  statusBtn: { padding: 6, fontSize: 12, color: '#666' },
  statusBtnActive: { color: '#007bff', fontWeight: 'bold' },
  taskCard: { backgroundColor: '#fff', padding: 12, marginVertical: 6, borderRadius: 10, elevation: 2 },
  completedTask: { backgroundColor: '#e0f2f1' },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  taskTitle: { fontSize: 16, fontWeight: '600' },
  metaText: { fontSize: 12, color: '#555', marginTop: 4 },
  addBtn: { position: 'absolute', right: 20, bottom: 100, backgroundColor: '#007bff', padding: 16, borderRadius: 32, elevation: 6 },
  modalWrapper: { flex: 1, backgroundColor: '#000000aa', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', padding: 20, width: '90%', borderRadius: 12 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 10, marginBottom: 10 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-around' },
  modalButton: { fontSize: 16, fontWeight: 'bold', color: '#007bff' },
});

