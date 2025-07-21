import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
} from 'react-native';
import moment from 'moment';
import LeadCard from '../Components/Dashboard/Admin/LeadStatus/LeadCard';
import { useFocusEffect } from '@react-navigation/native';
import { getMeetings } from '../utils/meetingStorage';
import { getCalendarTasks } from '../utils/calendarStorage';
import { loadEvents } from '../utils/EventStorage';

export default function SimpleCalendar({ schedule = [] }) {
  const [meetings, setMeetings] = useState([]);
  const [localTasks, setLocalTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(moment());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventModalVisible, setEventModalVisible] = useState(false);

  const [selectedTask, setSelectedTask] = useState(null);
  const [taskModalVisible, setTaskModalVisible] = useState(false);

  const mergedSchedule = useMemo(() => {
    return [
      ...schedule,
      ...localTasks.map(task => ({
        ...task,
        date: task.dueDate,
        type: 'task',
      })),
      ...meetings.map(m => ({ ...m, type: 'meeting' })),
      ...events.map(e => ({
        ...e,
        type: 'event',
        date: e.date, // assumes event has a `date` field
      })),
    ];
  }, [schedule, localTasks, meetings, events]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const [meetingsData, tasksData, eventsData] = await Promise.all([
          getMeetings(),
          getCalendarTasks(),
          loadEvents(), // <-- fetch events
        ]);
        setMeetings(meetingsData || []);
        setLocalTasks(tasksData || []);
        setEvents(eventsData || []);
      };
      fetchData();
    }, [])
  );

  const renderDays = () => {
    const startOfMonth = currentDate.clone().startOf('month');
    const endOfMonth = currentDate.clone().endOf('month');
    const startOfWeek = startOfMonth.clone().startOf('week');
    const endOfWeek = endOfMonth.clone().endOf('week');

    const day = startOfWeek.clone().subtract(1, 'day');
    const calendar = [];

    while (day.isBefore(endOfWeek, 'day')) {
      calendar.push(
        Array(7)
          .fill(0)
          .map(() => day.add(1, 'day').clone())
      );
    }

    return calendar.map((week, i) => (
      <View key={i} style={styles.weekRow}>
        {week.map((dayItem, j) => {
          const isCurrentMonth = dayItem.month() === currentDate.month();
          const isToday = dayItem.isSame(moment(), 'day');
          const isSelected = dayItem.isSame(selectedDate, 'day');

          const itemsToday = mergedSchedule.filter(item =>
            moment(item.date).isSame(dayItem, 'day')
          );

          return (
            <TouchableOpacity
              key={j}
              style={[
                styles.dayContainer,
                !isCurrentMonth && styles.dayDisabled,
                isSelected && styles.selectedDay,
              ]}
              onPress={() => setSelectedDate(dayItem)}
            >
              <Text
                style={[
                  styles.dayText,
                  isToday && styles.todayText,
                  isSelected && styles.selectedDayText,
                ]}
              >
                {dayItem.date()}
              </Text>
              <View style={styles.dotsRow}>
                {itemsToday.map((item, k) => (
                  <View
                    key={k}
                    style={[
                      styles.dot,
                      item.type === 'event' && styles.eventDot,
                      item.type === 'task' && styles.taskDot,
                      item.type === 'meeting' && styles.meetingDot,
                    ]}
                  />
                ))}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    ));
  };

  const handlePrev = () => setCurrentDate(prev => prev.clone().subtract(1, 'month'));
  const handleNext = () => setCurrentDate(prev => prev.clone().add(1, 'month'));

  const selectedDayItems = useMemo(() => {
    return mergedSchedule.filter(item =>
      moment(item.date).isSame(selectedDate, 'day')
    );
  }, [mergedSchedule, selectedDate]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrev}>
          <Text style={styles.navButton}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.monthText}>{currentDate.format('MMMM YYYY')}</Text>
        <TouchableOpacity onPress={handleNext}>
          <Text style={styles.navButton}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekDays}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
          <Text key={i} style={styles.weekDay}>{day}</Text>
        ))}
      </View>

      {renderDays()}

      <View style={styles.detailListContainer}>
        <Text style={styles.detailTitle}>
          {selectedDayItems.length > 0
            ? `Items on ${selectedDate.format('MMMM D')}:`
            : `No items on ${selectedDate.format('MMMM D')}`}
        </Text>

        <FlatList
          data={selectedDayItems}
          keyExtractor={(item, index) => item.date + item.title + index}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                if (item.type === 'meeting') {
                  setSelectedMeeting(item);
                  setModalVisible(true);
                } else if (item.type === 'task') {
                  setSelectedTask(item);
                  setTaskModalVisible(true);
                } else if (item.type === 'event') {
                  setSelectedEvent(item);
                  setEventModalVisible(true);
                }
              }}
            >
              <View
                style={[
                  styles.detailItem,
                  item.type === 'event' && styles.eventItem,
                  item.type === 'task' && styles.taskItem,
                  item.type === 'meeting' && styles.meetingItem,
                ]}
              >
                <Text style={styles.detailType}>{item.type.toUpperCase()}</Text>
                <Text style={[styles.detailText, item.type === 'task' && { color: '#000' }]}>
                  {item.title}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      {selectedMeeting && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Meeting Attendees – {selectedMeeting.title}
              </Text>

              <FlatList
                data={selectedMeeting.attendees || []}
                keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                renderItem={({ item }) => (
                  <LeadCard
                    item={item}
                    handleLeadPress={() => { }}
                    handleCall={() => { }}
                    handleMeeting={(lead) => {
                      setModalVisible(false);
                      navigation.navigate('MeetingModal', { lead });
                    }}
                    variant="meetingModal"
                  />
                )}
              />

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {selectedTask && (
        <Modal
          visible={taskModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setTaskModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedTask.title}</Text>
              <Text style={styles.detailText}>📅 {moment(selectedTask.dueDate).format('MMM D, h:mm A')}</Text>
              <Text style={styles.detailText}>📝 {selectedTask.detail}</Text>
              <Text style={styles.detailText}>👤 Assigned to: {selectedTask.assignedTo}</Text>

              {selectedTask.assignedDate && (
                <Text style={styles.detailText}>
                  📌 Assigned on: {moment(selectedTask.assignedDate).format('MMM D, YYYY [at] h:mm A')}
                </Text>
              )}

              <TouchableOpacity
                onPress={() => {
                  const updated = {
                    ...selectedTask,
                    completed: !selectedTask.completed,
                    status: !selectedTask.completed ? 'completed' : 'pending',
                  };
                  const updatedAll = localTasks.map(t =>
                    t.id === selectedTask.id ? updated : t
                  );
                  setLocalTasks(updatedAll);
                  setSelectedTask(updated);
                }}
                style={styles.statusToggleBtn}
              >
                <Text style={styles.closeButtonText}>
                  Mark as {selectedTask.completed ? 'Pending ⏳' : 'Completed ✅'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setTaskModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {selectedEvent && (
  <Modal
    visible={eventModalVisible}
    transparent={true}
    animationType="slide"
    onRequestClose={() => setEventModalVisible(false)}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{selectedEvent.title}</Text>
        <Text style={styles.detailText}>📍 {selectedEvent.location}</Text>
        <Text style={styles.detailText}>
          🗓 {moment(selectedEvent.date).format('MMM D, YYYY [at] h:mm A')}
        </Text>
        <Text style={styles.detailText}>📝 {selectedEvent.description}</Text>

        <TouchableOpacity
          onPress={() => setEventModalVisible(false)}
          style={styles.closeButton}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 5 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  navButton: { fontSize: 24, paddingHorizontal: 10 },
  monthText: { fontSize: 20, fontWeight: 'bold' },
  weekDays: {
    flexDirection: 'row', justifyContent: 'space-around', marginVertical: 5,
  },
  weekDay: { width: 32, textAlign: 'center', fontWeight: '600' },
  weekRow: {
    flexDirection: 'row', justifyContent: 'space-around', marginBottom: 4,
  },
  dayContainer: {
    width: 40, height: 52, alignItems: 'center', justifyContent: 'center', borderRadius: 8,
  },
  selectedDay: { backgroundColor: '#E0F7FA' },
  dayText: { fontSize: 14 },
  selectedDayText: { fontWeight: 'bold', color: '#00796B' },
  dayDisabled: { opacity: 0.3 },
  todayText: {
    backgroundColor: '#2196F3', color: '#fff', borderRadius: 16, paddingHorizontal: 6,
  },
  dotsRow: {
    flexDirection: 'row', marginTop: 2, gap: 2, flexWrap: 'wrap',
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  eventDot: { backgroundColor: '#FF9800' },
  taskDot: { backgroundColor: '#4CAF50' },
  meetingDot: { backgroundColor: '#9C27B0' },
  detailListContainer: { marginTop: 12, paddingHorizontal: 4 },
  detailTitle: { fontWeight: 'bold', marginBottom: 4, fontSize: 16 },
  detailItem: { padding: 8, marginVertical: 4, borderRadius: 6 },
  eventItem: { backgroundColor: '#FFF3E0' },
  taskItem: { backgroundColor: '#E8F5E9' },
  meetingItem: { backgroundColor: '#F3E5F5' },
  detailType: { fontSize: 12, color: '#555', marginBottom: 2, fontWeight: '600' },
  detailText: { fontSize: 14 },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', paddingHorizontal: 10,
  },
  modalContent: {
    backgroundColor: 'white', borderRadius: 10, padding: 3, maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#2196F3', padding: 10, borderRadius: 6, alignItems: 'center', margin: 16,
  },
  closeButtonText: { color: 'white', fontWeight: 'bold' },
  statusToggleBtn: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 12,
  },
});



