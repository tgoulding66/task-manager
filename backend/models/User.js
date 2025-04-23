const mongoose = require('mongoose');

// User Schema
// This is the schema for the user model.
// It has a name, email, and password.
// The name is a string and is required.
// The email is a string and is required and must be unique.
// The password is a string and is required.  
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please enter your password']
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
