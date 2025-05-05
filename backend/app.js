const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

// Routes
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Root
app.get('/', (req, res) => {
  res.send('Hello MERN World!');
});

module.exports = app;
