// src/Redux/reduxPersist.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const PERSISTED_STATE_KEY = 'kanbanBoardState';

export const saveStateMiddleware = (store) => (next) => async (action) => {
  next(action);
  
  // Save the state to AsyncStorage
  const state = store.getState();
  try {
    await AsyncStorage.setItem(PERSISTED_STATE_KEY, JSON.stringify(state.tasks));
  } catch (error) {
    console.error('Failed to save state:', error);
  }
};

export const loadState = async () => {
  try {
    const state = await AsyncStorage.getItem(PERSISTED_STATE_KEY);
    return state ? { tasks: JSON.parse(state) } : undefined;
  } catch (error) {
    console.error('Failed to load state:', error);
    return undefined;
  }
};
