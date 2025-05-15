class TodoController {
    constructor(todoService) {
        this.todoService = todoService;
    }

    async createTodo(req, res) {
        try {
            const  { title, description, completed, priority} = req.body
            const todo = await this.todoService.addTodo(title, description, completed, priority);
            res.status(201).json(todo)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getTodos(req, res) {
        try {
            const todos = await this.todoService.fetchTodos();
            res.status(200).json(todos);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getTodoById(req, res) {
        try {
            const todoId = req.params.id;
            if (!todoId) {
                return res.status(400).json({ message: 'Todo ID is required' });
            }
            const todo = await this.todoService.findTodoById(todoId);
            if (!todo) {
                return res.status(404).json({ message: 'Todo not found' });
            }
            res.status(200).json(todo);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateTodo(req, res) {
        try {
            const updatedTodo = await this.todoService.modifyTodo(req.params.id, req.body);
            if (!updatedTodo) {
                return res.status(404).json({ message: 'Todo not found' });
            }
            res.status(200).json(updatedTodo);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteTodo(req, res) {
        try {
            const deletedTodo = await this.todoService.removeTodo(req.params.id);
            if (!deletedTodo) {
                return res.status(404).json({ message: 'Todo not found' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateStatusTodo(req, res) {
        try {
            const todoId = req.params.id;
            const {completed} = req.body;

            if(typeof completed !== 'boolean'){
                return res.status(400).json({message: 'Invalid type of completed status'})
            }
            
            const updatedTodo = await this.todoService.modifyTodo(todoId, {completed})
            if(!updatedTodo){
                return res.status(400).json({ message: 'Todo not found !'})
            }
            res.status(200).json(updatedTodo)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default TodoController;

