import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '@/types/task';

interface TaskState {
  tasks: Task[];
}

const initialState: TaskState = {
  tasks: [],
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks(state, action: PayloadAction<Task[]>) {
      state.tasks = action.payload;
    },
    fetchTasks(state, action: PayloadAction<Task[]>) {
      state.tasks = action.payload;
    },
    addTask(state, action: PayloadAction<Task>) {
      state.tasks.push(action.payload);

    },
    updateTask(state, action: PayloadAction<Task>) {
      const taskToUpdate = state.tasks.find((task) => task._id === action.payload._id);
      if (taskToUpdate) {
      Object.assign(taskToUpdate, action.payload);
      }
    },
    deleteTask(state, action: PayloadAction<string>) {
      state.tasks = state.tasks.filter((task) => task._id !== action.payload);
    },
    updateToggleComplete(state, action: PayloadAction<{ _id: string; completed: boolean }>) {
      const taskToUpdate = state.tasks.find((task) => task._id === action.payload._id);
      if (taskToUpdate) {
        taskToUpdate.completed = action.payload.completed;
      }
    }
  },
});

export const { setTasks, addTask, updateTask, deleteTask, fetchTasks, updateToggleComplete } = taskSlice.actions;
export default taskSlice.reducer;