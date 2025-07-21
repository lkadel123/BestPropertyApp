import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'events_data';

export const saveEvents = async (events) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Error saving events to storage:', error);
  }
};

export const loadEvents = async () => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading events from storage:', error);
    return [];
  }
};

export const clearEvents = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing events from storage:', error);
  }
};
