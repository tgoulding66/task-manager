const express = require('express');
const router = express.Router();
const { createProject, getProjects, updateProject, deleteProject, getProjectById } = require('../controllers/projectController');
// This is a middleware that protects routes.
// It takes the request, response, and next function as arguments.
// It then checks if the authorization header is present and if it starts with 'Bearer '.
// If the authorization header is not present or does not start with 'Bearer ', it then returns a 401 status and a message.
// If the authorization header is present and starts with 'Bearer ', it then verifies the token.
// If the token is valid, it then sets the user in the request to the decoded token.    

const protect = require('../middleware/authMiddleware');

// This is a POST request that creates a new project.
// It takes the name and description from the request body.
// It also takes the user id from the request user.
// It then creates a new project with the name, description, and user id.
// It then returns the new project.

router.post('/', protect, createProject);

// This is a GET request that gets all projects for the logged-in user.
// It takes the user id from the request user.
// It then finds all the projects for the user.
// It then returns the projects.

router.get('/', protect, getProjects);

// This is a PUT request that updates a project.
// It takes the project id from the request params.
// It also takes the name and description from the request body.
// It then updates the project with the new name and description.
// It then returns the updated project.

router.put('/:id', protect, updateProject);

// This is a GET request that gets a project by id.
// It takes the project id from the request params.
// It then finds the project with the given id.
// It then returns the project.

router.get('/:id', protect, getProjectById);

// This is a DELETE request that deletes a project.
// It takes the project id from the request params.
// It then deletes the project with the given id.
// It then returns a message indicating that the project has been deleted.  

router.delete('/:id', protect, deleteProject);

module.exports = router;
