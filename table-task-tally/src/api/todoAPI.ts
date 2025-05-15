import { Task } from "@/types/task";

const API_URL = 'http://localhost:3000/todos/';

export const fetchTodoList = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching todo list:', error);
        throw error;
    }
};

export const addTask = async (task: Omit<Task, '_id' | 'createdAt'>) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...task,
            priority: task.priority,
            createdAt: new Date().toISOString(),
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to add task');
    }

    return await response.json();
};

export const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!updates || Object.keys(updates).length === 0) {
        throw new Error('No updates provided');
    }

    const response = await fetch(`${API_URL}${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
    });

    if (!response.ok) {
        throw new Error('Failed to update task');
    }

    return await response.json();
};

export const toggleCompletion = async (id: string, completed: boolean) => {
    const response = await fetch(`${API_URL}${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed }),
    });

    if (!response.ok) {
        throw new Error('Failed to update task status');
    }

    return await response.json();
};

export const deleteTask = async (id: string) => {
    const response = await fetch(`${API_URL}${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Failed to delete task');
    }

    return id;
};