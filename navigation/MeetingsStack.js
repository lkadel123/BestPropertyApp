import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AgendaScreen from '../Screens/AgendaScreen';
import MeetingModal from '../Screens/Meetings/MeetingModal';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator();

export default function MeetingsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AgendaScreen"
        component={AgendaScreen}
        options={({ navigation }) => ({
          title: 'Agenda',
          headerRight: () => (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => navigation.navigate('MeetingModal')}
            >
              <Text style={styles.addText}>➕ New Meeting</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="MeetingModal"
        component={MeetingModal}
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
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




