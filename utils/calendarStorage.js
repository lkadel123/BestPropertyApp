// /utils/calendarStorage.js

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'calendar_tasks';

/**
 * Save a new task to AsyncStorage
 * @param {Object} task - { title, date, type }
 */
export const addCalendarTask = async (task) => {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    const tasks = existing ? JSON.parse(existing) : [];
    tasks.push(task);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('❌ Error saving task:', error);
  }
};

/**
 * Get all calendar tasks
 * @returns {Array}
 */
export const getCalendarTasks = async () => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.error('❌ Error retrieving calendar tasks:', error);
    return [];
  }
};

/**
 * Clear all calendar tasks (use for testing/debugging)
 */
export const clearCalendarTasks = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log('🧹 Calendar tasks cleared');
  } catch (error) {
    console.error('❌ Error clearing tasks:', error);
  }
};

/**
 * Replace all tasks (bulk set)
 * @param {Array} tasks 
 */
export const setCalendarTasks = async (tasks) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('❌ Error setting calendar tasks:', error);
  }
};
