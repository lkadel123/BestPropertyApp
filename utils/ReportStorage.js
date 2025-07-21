import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'myReports';

export const saveReports = async (reports) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch (error) {
    console.error('Error saving reports to storage:', error);
  }
};

export const loadReports = async () => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading reports from storage:', error);
    return [];
  }
};

export const clearReports = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing stored reports:', error);
  }
};
