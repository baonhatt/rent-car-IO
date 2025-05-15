import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    completed: {
        type: Boolean,
        default: false
    },
    priority: {
        type:  String,
        default: 'low'
    }
}, {timestamps: true});


const TodoModel = mongoose.model('Todo', todoSchema);

export default TodoModel;

