import AsyncStorage from '@react-native-async-storage/async-storage';

const MEETINGS_KEY = 'LOCAL_MEETINGS';

export const saveMeeting = async (newMeeting) => {
  try {
    const existing = await AsyncStorage.getItem(MEETINGS_KEY);
    const meetings = existing ? JSON.parse(existing) : [];
    meetings.push(newMeeting);
    await AsyncStorage.setItem(MEETINGS_KEY, JSON.stringify(meetings));
  } catch (error) {
    console.error('Error saving meeting:', error);
  }
};

export const getMeetings = async () => {
  try {
    const data = await AsyncStorage.getItem(MEETINGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error retrieving meetings:', error);
    return [];
  }
};

export const clearMeetings = async () => {
  try {
    await AsyncStorage.removeItem(MEETINGS_KEY);
  } catch (error) {
    console.error('Error clearing meetings:', error);
  }
};
