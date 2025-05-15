# Todo List API

## Overview
This project is a simple Todo List API built with Node.js and Express. It allows users to perform CRUD operations on todo items.

## Features
- Create a new todo
- Retrieve all todos
- Retrieve a todo by ID
- Update a todo
- Delete a todo

## Technologies Used
- Node.js
- Express
- MongoDB (or any other database of your choice)
- dotenv for environment variable management

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd todo-list-api
   ```
3. Install the dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory and add your environment variables.

## Usage
1. Start the server:
   ```
   npm start
   ```
2. The API will be available at `http://localhost:3000`.

## API Endpoints
- `POST /todos` - Create a new todo
- `GET /todos` - Retrieve all todos
- `GET /todos/:id` - Retrieve a todo by ID
- `PUT /todos/:id` - Update a todo
- `DELETE /todos/:id` - Delete a todo

## Example
To create a new todo, send a POST request to `/todos` with the following JSON body:
```json
{
  "title": "Sample Todo",
  "description": "This is a sample todo item.",
  "completed": false
}
```

## License
This project is licensed under the MIT License.