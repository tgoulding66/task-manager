const express = require('express');
const router = express.Router();
const { createTask, getTasks, getTaskById, updateTask, deleteTask } = require('../controllers/taskController');
const protect = require('../middleware/authMiddleware');

// Create a new task
router.post('/', protect, createTask);

// Get tasks by project (via query param ?projectId=xxx)
router.get('/', protect, getTasks);

// Get single task by ID
router.get('/:id', protect, getTaskById);

// Update task by ID
router.put('/:id', protect, updateTask);

// Delete task by ID
router.delete('/:id', protect, deleteTask);

module.exports = router;
