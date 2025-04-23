const express = require('express');
const router = express.Router();
const { createTask, getTasksByProject, updateTask, deleteTask } = require('../controllers/taskController');
// This is a middleware that protects routes.
// It takes the request, response, and next function as arguments.
// It then checks if the authorization header is present and if it starts with 'Bearer '.
// If the authorization header is not present or does not start with 'Bearer ', it then returns a 401 status and a message.
// If the authorization header is present and starts with 'Bearer ', it then verifies the token.
// If the token is valid, it then sets the user in the request to the decoded token.    

const protect = require('../middleware/authMiddleware');

// This is a POST request that creates a new task under a project.
// It takes the title, description, status, and project id from the request body.
// It also takes the user id from the request user.
// It then creates a new task with the title, description, status, project id, and user id.
// It then returns the new task.    

router.post('/', protect, createTask);

// This is a GET request that gets all tasks for a project. 
// It takes the project id from the request params.
// It then gets all tasks for the project with the given id.
// It then returns the tasks.

router.get('/:projectId', protect, getTasksByProject);

// This is a PUT request that updates a task.   
// It takes the task id from the request params.
// It also takes the title, description, and status from the request body.
// It then updates the task with the new title, description, and status.
// It then returns the updated task.

router.put('/:id', protect, updateTask);

// This is a DELETE request that deletes a task.
// It takes the task id from the request params.
// It then deletes the task with the given id.
// It then returns a message indicating that the task has been deleted.     

router.delete('/:id', protect, deleteTask); 

module.exports = router;
