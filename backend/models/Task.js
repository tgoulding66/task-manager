const mongoose = require('mongoose');

// Task Schema
// This ties each task to a project via the project field.
// It also has a title, description, status, and timestamps for when the task was created and updated.
// The user field is a reference to the User model.
// The timestamps field is a boolean that specifies whether to add createdAt and updatedAt fields to the schema.

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required']
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Done'],
    default: 'To Do'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dueDate: {
    type: Date,
  },
    priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  notes: {
    type: String,
    default: ''
  },
  subtasks: [
    {
      title: { type: String, required: true },
      completed: { type: Boolean, default: false },
    }
  ],
  type: {
    type: String,
    enum: ['New Feature', 'Enhancement', 'Bug'],
    default: 'New Feature'
  },
  points: {
    type: Number,
    default: 0
  },
    
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
