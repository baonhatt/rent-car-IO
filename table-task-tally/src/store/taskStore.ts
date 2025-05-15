import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  fetchTodoList,
  addTask as apiAddTask,
  deleteTask as apiDeleteTask,
  updateTask as apiUpdateTask,
  toggleCompletion,
} from '../api/todoAPI';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}




// Hàm ánh xạ dữ liệu API sang Task
const mapApiTaskToTask = (task: any): Task => ({
  ...task,
  id: task._id,
  createdAt: new Date(task.createdAt),
});

// Async thunks
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  try {
    const tasks = await fetchTodoList(); // fetchTodoList trả về mảng task
    return tasks.map(mapApiTaskToTask);
  } catch (err) {
    throw new Error('Failed to fetch tasks');
  }
});

export const addTask = createAsyncThunk(
  'tasks/addTask',
  async (task: Omit<Task, '_id' | 'createdAt'>, { rejectWithValue }) => {
    try {
      const response = await apiAddTask({
        ...task,
        completed: task.completed,
      });
      // Sử dụng dữ liệu từ server response
      return mapApiTaskToTask(response.data);
    } catch (err) {
      return rejectWithValue('Failed to add task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, changes }: { id: string; changes: Partial<Task> }, { rejectWithValue }) => {
    try {
      await apiUpdateTask(id, changes);
      return { id, changes };
    } catch (err) {
      return rejectWithValue('Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiDeleteTask(id);
      return id;
    } catch (err) {
      return rejectWithValue('Failed to delete task');
    }
  }
);

export const toggleTaskCompletion = createAsyncThunk(
  'tasks/toggleCompletion',
  async ({ id, completed }: { id: string; completed: boolean }, { rejectWithValue }) => {
    try {
      await toggleCompletion(id, completed);
      return { id, completed };
    } catch (err) {
      return rejectWithValue('Failed to toggle task status');
    }
  }
);



