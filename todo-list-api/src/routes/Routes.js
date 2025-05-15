import express from 'express';
import CarController from '../controllers/carController.js';
import CarService from '../services/carService.js';
import TodoController from '../controllers/todoController.js';
import UserController from '../controllers/UserController.js';
import UserService from '../services/UserService.js';
import authMiddleware from '../middleware/authMiddleware.js';

const setRoutes = (app) => {
    const router = express.Router();
    const todoController = new TodoController();
    const userService = new UserService();
    const userController = new UserController(userService);
    const carService = new CarService();
    const carController = new CarController(carService);
    // Todo routes
    router.post('/todos', authMiddleware, todoController.createTodo.bind(todoController));
    router.get('/todos', authMiddleware, todoController.getTodos.bind(todoController));
    router.get('/todos/:id', authMiddleware, todoController.getTodoById.bind(todoController));
    router.put('/todos/:id', authMiddleware, todoController.updateTodo.bind(todoController));
    router.delete('/todos/:id', authMiddleware, todoController.deleteTodo.bind(todoController));
    router.patch('/todos/:id/completed', authMiddleware, todoController.updateTodo.bind(todoController));

    // Auth routes
    router.post('/register', userController.register.bind(userController));
    router.post('/login', userController.login.bind(userController));
    router.post('/refresh-token', userController.refreshToken.bind(userController));
    router.post('/logout', authMiddleware, userController.logout.bind(userController));
    // Car routes

    router.post('/car', authMiddleware, carController.createCar.bind(carController));
    router.get('/cars', authMiddleware, carController.getAllCars.bind(carController))
    app.use('/api', router);
};

export default setRoutes;