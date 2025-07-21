import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';

const getWeekDates = (baseDate = new Date()) => {
  const week = [];
  const start = new Date(baseDate);
  start.setDate(start.getDate() - start.getDay()); // Start of week (Sunday)

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    week.push(date);
  }
  return week;
};

const SheduleCalanderStrip = ({ selectedDate, onDateChange }) => {
  const weekDates = getWeekDates(selectedDate);

  const renderItem = ({ item }) => {
    const isSelected =
      item.toDateString() === selectedDate.toDateString();

    return (
      <TouchableOpacity
        style={[styles.dateItem, isSelected && styles.selectedDate]}
        onPress={() => onDateChange(item)}
      >
        <Text style={[styles.dayText, isSelected && styles.selectedText]}>
          {item.toLocaleDateString('en-US', { weekday: 'short' })}
        </Text>
        <Text style={[styles.dateText, isSelected && styles.selectedText]}>
          {item.getDate()}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={weekDates}
        renderItem={renderItem}
        keyExtractor={(item) => item.toISOString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingVertical: 10, backgroundColor: '#fff' },
  list: { paddingHorizontal: 8 },
  dateItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#f2f2f2',
  },
  selectedDate: {
    backgroundColor: '#007AFF',
  },
  dayText: {
    fontSize: 12,
    color: '#555',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedText: {
    color: '#fff',
  },
});

export default SheduleCalanderStrip;
