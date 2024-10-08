// src/Redux/taskSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  columns: [
    { id: 'column1', title: 'To do List', tasks: [], collapsed: true },
    { id: 'column2', title: 'Tasks in Progress', tasks: [], collapsed: true },
    { id: 'column3', title: 'Tasks Done', tasks: [], collapsed: true },
  ],
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setColumns: (state, action) => {
      state.columns = action.payload;
    },
    addTask: (state, action) => {
      const { columnId, task } = action.payload;
      const column = state.columns.find((col) => col.id === columnId);
      if (column) {
        column.tasks.push(task);
      }
    },
    deleteTask: (state, action) => {
      const { columnId, taskIndex } = action.payload;
      const column = state.columns.find((col) => col.id === columnId);
      if (column) {
        column.tasks.splice(taskIndex, 1);
      }
    },
    editTask: (state, action) => {
      const { columnId, taskIndex, updatedTask } = action.payload;
      const column = state.columns.find((col) => col.id === columnId);
      if (column) {
        column.tasks[taskIndex] = updatedTask;
      }
    },
    addComment: (state, action) => {
      const { columnId, taskIndex, comment } = action.payload;
      const column = state.columns.find((col) => col.id === columnId);
      if (column) {
        column.tasks[taskIndex].comments.push(comment);
      }
    },
    addAttachment: (state, action) => {
      const { columnId, taskIndex, attachment } = action.payload;
      const column = state.columns.find((col) => col.id === columnId);
      if (column) {
        column.tasks[taskIndex].attachments.push(attachment);
      }
    },
    removeAttachment: (state, action) => {
      const { columnId, taskIndex, attachmentIndex } = action.payload;
      const column = state.columns.find((col) => col.id === columnId);
      if (column) {
        column.tasks[taskIndex].attachments.splice(attachmentIndex, 1);
      }
    },
  },
});

export const { 
  setColumns, 
  addTask, 
  deleteTask, 
  editTask, 
  addComment, 
  addAttachment, 
  removeAttachment 
} = taskSlice.actions;

export default taskSlice.reducer;