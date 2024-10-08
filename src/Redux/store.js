// src/Redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './taskSlice';
import { saveStateMiddleware, loadState } from './reduxPersist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';
import { setColumns } from './taskSlice';

const store = configureStore({
  reducer: {
    tasks: taskReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(saveStateMiddleware),
});

// Load the initial state from AsyncStorage
const loadInitialState = async () => {
  const initialState = await loadState();
  if (initialState) {
    store.dispatch(setColumns(initialState.tasks.columns));
  }
};

// Save state on app state change
const saveStateOnAppClose = async () => {
  const state = store.getState();
  await AsyncStorage.setItem('kanbanBoardState', JSON.stringify(state.tasks));
};

AppState.addEventListener('change', (nextAppState) => {
  if (nextAppState === 'background' || nextAppState === 'inactive') {
    saveStateOnAppClose();
  }
});

// Initial load
loadInitialState();

export { store };
