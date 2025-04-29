const Task = require('../models/Task');

// Create a task
const createTask = async (req, res) => {
  const { title, description, status, projectId, dueDate, priority } = req.body;

  try {
    const task = await Task.create({
      title,
      description,
      status,
      dueDate,
      priority,
      project: projectId,
      user: req.user.id
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create task', error: err.message });
  }
};

// Get a task by id
const getTaskById = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findOne({ _id: id, user: req.user.id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (err) {
    console.error('Error fetching task by ID:', err);
    res.status(500).json({ message: 'Failed to fetch task', error: err.message });
  }
};


// Get tasks (optionally by project)
const getTasks = async (req, res) => {
  try {
    const { projectId } = req.query;

    const filter = { user: req.user.id };
    if (projectId) {
      filter.project = projectId;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: err.message });
  }
};

// Update a task
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, completed, priority, dueDate } = req.body;

  try {
    const task = await Task.findOne({ _id: id, user: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (completed !== undefined) task.completed = completed;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();
    res.status(200).json(task);
  } catch (err) {
    console.error('Update task error:', err); // <--- Bonus debug
    res.status(500).json({ message: 'Failed to update task', error: err.message });
  }
};


// Delete a task
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
  getTasks,
  updateTask,
  deleteTask,
  getTaskById,
};
