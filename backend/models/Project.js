const mongoose = require('mongoose');
// Project Schema
// This ties each project to a user via the user field.
// It also has a name, description, and timestamps for when the project was created and updated.
// The user field is a reference to the User model.
// The timestamps field is a boolean that specifies whether to add createdAt and updatedAt fields to the schema.    

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required']
  },
  description: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Optional due date for project completion
  dueDate: {
    type: Date,
    default: null,
  },
  
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
