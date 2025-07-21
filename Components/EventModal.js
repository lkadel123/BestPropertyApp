import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';

const EventModal = ({ visible, onClose, onSave, initialData }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [attendees, setAttendees] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setLocation(initialData.location || '');
      setAttendees(initialData.attendees || '');
      setDate(new Date(initialData.date || Date.now()));
      setTime(new Date(initialData.time || Date.now()));
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setLocation('');
    setAttendees('');
    setDate(new Date());
    setTime(new Date());
  };

  const handleSave = () => {
    const event = {
      id: initialData?.id || `EVT-${Date.now()}`,
      title,
      description,
      location,
      attendees,
      date: moment(date).format('YYYY-MM-DD'),
      time: moment(time).format('HH:mm'),
    };
    onSave(event);
    resetForm();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.header}>
          {initialData ? 'Edit Event' : 'Add New Event'}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Event Title"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#6b7280"
        />
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
          placeholderTextColor="#6b7280"
        />
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          placeholderTextColor="#6b7280"
        />
        <TextInput
          style={styles.input}
          placeholder="Attendees (comma-separated)"
          value={attendees}
          onChangeText={setAttendees}
          placeholderTextColor="#6b7280"
        />

        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.pickerBtn}
        >
          <Ionicons name="calendar-outline" size={20} color="#2563eb" />
          <Text style={styles.pickerText}>
            {moment(date).format('YYYY-MM-DD')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowTimePicker(true)}
          style={styles.pickerBtn}
        >
          <Ionicons name="time-outline" size={20} color="#2563eb" />
          <Text style={styles.pickerText}>
            {moment(time).format('hh:mm A')}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={(e, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}
        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            is24Hour={false}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(e, selectedTime) => {
              setShowTimePicker(false);
              if (selectedTime) setTime(selectedTime);
            }}
          />
        )}

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Ionicons name="save-outline" size={20} color="#fff" />
          <Text style={styles.saveText}>
            {initialData ? 'Update' : 'Save'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: '#ef4444' }]}
          onPress={() => {
            onClose();
            resetForm();
          }}
        >
          <Ionicons name="close-outline" size={20} color="#fff" />
          <Text style={styles.saveText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default EventModal;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9fafb',
    flex: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  pickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#e0f2fe',
    borderRadius: 8,
    marginBottom: 10,
  },
  pickerText: {
    marginLeft: 8,
    color: '#2563eb',
    fontSize: 15,
  },
  saveBtn: {
    flexDirection: 'row',
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
});
