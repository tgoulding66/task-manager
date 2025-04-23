const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Routes
// This is a POST request that registers a new user.
// It takes the name, email, and password from the request body.
// It then creates a new user with the name, email, and password.
// It then returns the new user.

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// This is a POST request that creates a new project.
// It takes the name and description from the request body.
// It also takes the user id from the request user.
// It then creates a new project with the name, description, and user id.
// It then returns the new project.

const projectRoutes = require('./routes/projectRoutes');
app.use('/api/projects', projectRoutes);

// This is a POST request that creates a new task under a project.
// It takes the title, description, status, and project id from the request body.
// It also takes the user id from the request user.
// It then creates a new task with the title, description, status, project id, and user id.
// It then returns the new task.  

const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);


// Root
app.get('/', (req, res) => {
  res.send('Hello MERN World!');
});

// Server
const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => console.error('MongoDB connection failed:', err));
