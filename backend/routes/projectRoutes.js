const express = require('express');
const router = express.Router();
const { createProject, getProjects, updateProject, deleteProject, getProjectById } = require('../controllers/projectController');
const { getProjectPoints } = require('../controllers/projectController');

// This is a middleware that protects routes.
const protect = require('../middleware/authMiddleware');

// This is a POST request that creates a new project.
router.post('/', protect, createProject);

// This is a GET request that gets all projects for the logged-in user.
router.get('/', protect, getProjects);

// This is a PUT request that updates a project.
router.put('/:id', protect, updateProject);

// This is a GET request that gets a project by id.
router.get('/:id', protect, getProjectById);

// This is a DELETE request that deletes a project.
router.delete('/:id', protect, deleteProject);

// This is a GET request that gets the points for a project.
router.get('/:id/points', protect, getProjectPoints);
    
module.exports = router;
