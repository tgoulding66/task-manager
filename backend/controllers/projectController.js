const Project = require('../models/Project');
const mongoose = require('mongoose');

// Create new project
const createProject = async (req, res) => {
  const { name, description, dueDate } = req.body;

  try {
    const project = await Project.create({
      name,
      description,
      user: req.user.id,  // user comes from JWT middleware
      dueDate: dueDate ? new Date(dueDate) : null,
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create project', error: err.message });
  }
};

// Get all projects for the logged-in user
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch projects', error: err.message });
  }
};

// Get a project by id
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch project' });
  }
};



// Update a project
const updateProject = async (req, res) => {
  const { id } = req.params;
  const { name, description, dueDate } = req.body;

  try {
    const project = await Project.findOne({ _id: id, user: req.user.id });

    if (!project) return res.status(404).json({ message: 'Project not found' });

    project.name = name || project.name;
    project.description = description || project.description;
    project.dueDate = dueDate ? new Date(dueDate) : null; 
    await project.save();
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update project', error: err.message });
  }
};
  
// Delete a project
const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findOneAndDelete({ _id: id, user: req.user.id });

    if (!project) return res.status(404).json({ message: 'Project not found' });

    res.status(200).json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete project', error: err.message });
  }
};
  
const Task = require('../models/Task');

// GET /api/projects/:id/points
const getProjectPoints = async (req, res) => {
  const { id } = req.params;

   try {
    const result = await Task.aggregate([
      { $match: { 
          project: new mongoose.Types.ObjectId(id), 
          user: new mongoose.Types.ObjectId(req.user.id)
        } 
      },
      {
        $group: {
          _id: null,
          totalPoints: { $sum: { $ifNull: ['$points', 0] } },
          completedPoints: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Done'] }, { $ifNull: ['$points', 0] }, 0]
            }
          }
        }
      }
    ]);

    const { totalPoints = 0, completedPoints = 0 } = result[0] || {};

    res.json({ projectId: id, totalPoints, completedPoints });
  } catch (err) {
    console.error('Error aggregating project points:', err);
    res.status(500).json({ message: 'Failed to aggregate project points' });
  }
};


module.exports = {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  getProjectById,
  getProjectPoints
};
  
