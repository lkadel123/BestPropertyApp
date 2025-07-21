import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function SiteVisitSchedulerScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const visits = [
    { id: '1', property: 'Skyview Towers', time: '10:30 AM', client: 'Ravi Sharma' },
    { id: '2', property: 'Green Acres', time: '1:00 PM', client: 'Anjali Mehta' },
    { id: '3', property: 'Ocean Breeze', time: '4:00 PM', client: 'Manoj Verma' },
  ];

  const onDateChange = (event, selected) => {
    setShowPicker(false);
    if (selected) {
      setSelectedDate(selected);
    }
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.dateSelector} onPress={() => setShowPicker(true)}>
        <MaterialIcons name="date-range" size={20} color="#333" />
        <Text style={styles.dateText}>{selectedDate.toDateString()}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <View style={styles.mapPlaceholder}>
        <Ionicons name="map-outline" size={60} color="#bbb" />
        <Text style={{ color: '#888' }}>Google Map View (Coming Soon)</Text>
      </View>

      <Text style={styles.subHeader}>Today's Visits</Text>
      <FlatList
        data={visits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.visitCard}>
            <Text style={styles.property}>{item.property}</Text>
            <Text style={styles.timeClient}>
              {item.time} • {item.client}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f6f8',
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
    color: '#2c3e50',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  dateText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  mapPlaceholder: {
    backgroundColor: '#eaeaea',
    height: 160,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  visitCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  property: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },
  timeClient: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
});
