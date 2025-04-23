const Task = require('../models/Task');

// Create a task under a project
// This is a POST request that creates a new task under a project.
// It takes the title, description, status, and project id from the request body.
// It also takes the user id from the request user.
// It then creates a new task with the title, description, status, project id, and user id.
// It then returns the new task.

const createTask = async (req, res) => {
  const { title, description, status, projectId } = req.body;

  try {
    const task = await Task.create({
      title,
      description,
      status,
      project: projectId,
      user: req.user.id
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create task', error: err.message });
  }
};

// Get all tasks for a project
// This is a GET request that gets all tasks for a project.
// It takes the project id from the request params.
// It then gets all tasks for the project with the given id.
// It then returns the tasks.   

const getTasksByProject = async (req, res) => {
  const { projectId } = req.params;

  try {
    const tasks = await Task.find({ project: projectId, user: req.user.id });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: err.message });
  }
};

// This is a PUT request that updates a task.
// It takes the task id from the request params.
// It also takes the title, description, and status from the request body.
// It then updates the task with the new title, description, and status.
// It then returns the updated task.    

const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
  
    try {
      const task = await Task.findOne({ _id: id, user: req.user.id });
      if (!task) return res.status(404).json({ message: 'Task not found' });
  
      task.title = title || task.title;
      task.description = description || task.description;
      task.status = status || task.status;
  
      await task.save();
      res.status(200).json(task);
    } catch (err) {
      res.status(500).json({ message: 'Failed to update task', error: err.message });
    }
  };
  
    
  // This is a DELETE request that deletes a task.
  // It takes the task id from the request params.
  // It then deletes the task with the given id.
  // It then returns a message indicating that the task has been deleted.

  const deleteTask = async (req, res) => {
    const { id } = req.params;
  
    try {
      const task = await Task.findOneAndDelete({ _id: id, user: req.user.id });
      if (!task) return res.status(404).json({ message: 'Task not found' });
  
      res.status(200).json({ message: 'Task deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete task', error: err.message });
    }
  };
  
  module.exports = {
    createTask,
    getTasksByProject,
    updateTask,
    deleteTask
  };
  
