import { createReducer, createSlice } from "@reduxjs/toolkit";
import { fetchTasks, addTask, updateTask, deleteTask, toggleTaskCompletion } from "../taskStore";
import { Task } from "@/types/task";

interface TaskState {
    tasks: Task[];
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    error: string | null;
  }
  
const initialState: TaskState = {
    tasks: [],
    loading: 'idle',
    error: null,
  };
const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
      // Reducer để đồng bộ dữ liệu từ useQuery
      syncTasksFromQuery: (state, action) => {
        state.tasks = action.payload;
        state.loading = 'succeeded';
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder
        // Fetch tasks
        .addCase(fetchTasks.pending, (state) => {
          state.loading = 'pending';
          state.error = null;
        })
        .addCase(fetchTasks.fulfilled, (state, action) => {
          state.loading = 'succeeded';
          state.tasks = action.payload;
          state.error = null;
        })
        .addCase(fetchTasks.rejected, (state, action) => {
          state.loading = 'failed';
          state.error = action.error.message || 'Failed to fetch tasks';
        })
        .addCase(updateTask.pending, (state) => {
          state.loading = 'pending';
          state.error = null;
        })
        .addCase(updateTask.fulfilled, (state, action) => {
          state.loading = 'succeeded';
          const task = state.tasks.find((t) => t._id === action.payload.id);
          if (task) {
            Object.assign(task, action.payload.changes);
          }
          state.error = null;
        })
        .addCase(updateTask.rejected, (state, action) => {
          state.loading = 'failed';
          state.error = action.payload as string || 'Failed to update task';
        })
        // Delete task
        .addCase(deleteTask.pending, (state) => {
          state.loading = 'pending';
          state.error = null;
        })
        .addCase(deleteTask.fulfilled, (state, action) => {
          state.loading = 'succeeded';
          state.tasks = state.tasks.filter((task) => task._id !== action.payload);
          state.error = null;
        })
        .addCase(deleteTask.rejected, (state) => {
          state.loading = 'failed';
          state.error = 'Failed to delete task';
        })
        // Toggle completion
        .addCase(toggleTaskCompletion.pending, (state) => {
          state.loading = 'pending';
          state.error = null;
        })
        .addCase(toggleTaskCompletion.fulfilled, (state, action) => {
          state.loading = 'succeeded';
          const task = state.tasks.find((t) => t._id === action.payload.id);
          if (task) {
            task.completed = action.payload.completed;
          }
          state.error = null;
        })
        .addCase(toggleTaskCompletion.rejected, (state) => {
          state.loading = 'failed';
          state.error = 'Failed to toggle task status';
        });
    },
  });
  export const { syncTasksFromQuery, } = taskSlice.actions;
  export default taskSlice.reducer;
