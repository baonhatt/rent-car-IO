import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import redis from 'redis';
import passport from './config/auth.js';
import jwt from 'jsonwebtoken';
import session from 'express-session';
import UserService from './services/UserService.js';
import UserController from './controllers/UserController.js';
import TodoController from './controllers/todoController.js';
import TodoService from './services/TodoService.js';
import CarController from './controllers/carController.js';
import CarService from './services/carService.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(session({ secret: 'your-session-secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Authentication Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  const token = jwt.sign({ user: req.user }, process.env.JWT_SECRET);
  res.redirect(`http://localhost:5173/?token=${token}`);
});

// User Routes
const userService = new UserService();
const todoService = new TodoService();
const carService  = new CarService();
const userController = new UserController(userService);
const todoController = new TodoController(todoService)
const carController = new CarController(carService)
app.post('/register', userController.register.bind(userController));
app.post('/refresh-token', userController.refreshToken.bind(userController));
app.post('/logout', userController.logout.bind(userController));
app.post('/login', userController.login.bind(userController));
app.post('/all', userController.login.bind(userController));
app.post('/todos', todoController.createTodo.bind(todoController));
app.get('/todos', todoController.getTodos.bind(todoController));
app.get('/todos/:id', todoController.getTodoById.bind(todoController));
app.patch('/todos/:id', todoController.updateStatusTodo.bind(todoController));
app.delete('/todos/:id', todoController.deleteTodo.bind(todoController));
app.put('/todos/:id', todoController.updateTodo.bind(todoController));
app.get('/users', userController.getAllUsers.bind(userController));
app.post('/car', carController.createCar.bind(carController));
app.get('/cars', carController.getAllCars.bind(carController));
// Protected Routes

// Database connections
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});