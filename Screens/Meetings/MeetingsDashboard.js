import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function MeetingsDashboard() {
  const navigation = useNavigation();
  const [meetings, setMeetings] = useState([]);

  const handleSaveMeeting = (data) => {
    setMeetings((prev) => [...prev, data]);
  };

  // Step 1: Listen to returned meeting data using route params
  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        if (navigation.getState().routes) {
          const currentRoute = navigation.getState().routes.find(
            (r) => r.name === 'MeetingsDashboard'
          );
          const lastMeeting = currentRoute?.params?.newMeeting;
          if (lastMeeting) {
            handleSaveMeeting(lastMeeting);
            // Clear the param
            navigation.setParams({ newMeeting: undefined });
          }
        }
      });

      return unsubscribe;
    }, [navigation])
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate('MeetingModal')}
      >
        <Text style={styles.addText}>➕ New Meeting</Text>
      </TouchableOpacity>

      {meetings.length === 0 ? (
        <Text style={styles.empty}>No meetings scheduled.</Text>
      ) : (
        <FlatList
          data={meetings}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.meetingCard}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subText}>{item.property}</Text>
              <Text style={styles.subText}>
                {new Date(item.datetime).toLocaleString()}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  addBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  addText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  empty: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  meetingCard: {
    backgroundColor: '#f8f8f8',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  subText: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
});

