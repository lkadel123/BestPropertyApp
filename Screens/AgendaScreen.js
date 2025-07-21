import React, { useLayoutEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import SimpleCalendar from '../Components/Calender';
import { getMeetings } from '../utils/meetingStorage'; // Make sure this file exists

export default function AgendaScreen() {
  const [meetings, setMeetings] = useState([]);
  const navigation = useNavigation();

  // 🔄 Refresh meetings on screen focus
  useFocusEffect(
    React.useCallback(() => {
      const loadMeetings = async () => {
        const savedMeetings = await getMeetings();
        setMeetings(savedMeetings);
      };
      loadMeetings();
    }, [])
  );

  // ➕ Add meeting button in header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('MeetingModal')}
        >
          <Text style={styles.addText}>➕ New Meeting</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={{ flex: 1, paddingTop: 20 }}>
      <SimpleCalendar schedule={meetings} />
    </View>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    marginRight: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#007bff',
    borderRadius: 8,
  },
  addText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
});






