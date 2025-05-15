import mongoose from 'mongoose';
import TodoModel from '../models/todoModel.js';

class TodoService {
    async addTodo(title, description, completed = false, priority) {
        const newTodo = new TodoModel({ title, description, completed, priority });
        return await newTodo.save(); // Lưu vào MongoDB
    }

    async fetchTodos() {
        return await TodoModel.find(); // Lấy tất cả các todo từ MongoDB
    }

    async findTodoById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid ID format');
        }
        return await TodoModel.findById(id); // Tìm todo theo ID
    }

    async modifyTodo(id, updatedData) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid ID format');
        }
        return await TodoModel.findByIdAndUpdate(id, updatedData, { new: true }); // Cập nhật todo
    }

    async removeTodo(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid ID format');
        }
        return await TodoModel.findByIdAndDelete(id); // Xóa todo
    }
}

export default TodoService;