const Project = require('../models/Project');

// Create new project
// This is a POST request that creates a new project.
// It takes the name and description from the request body.
// It also takes the user id from the request user.
// It then creates a new project with the name, description, and user id.
// It then returns the new project.

const createProject = async (req, res) => {
  const { name, description } = req.body;

  try {
    const project = await Project.create({
      name,
      description,
      user: req.user.id  // user comes from JWT middleware
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create project', error: err.message });
  }
};

// Get all projects for the logged-in user
// This is a GET request that gets all the projects for the logged-in user.
// It takes the user id from the request user.
// It then finds all the projects for the user.
// It then returns the projects.

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch projects', error: err.message });
  }
};

// Get a project by id
// This is a GET request that gets a project by id.
// It takes the project id from the request params.
// It then finds the project with the given id.
// It then returns the project.

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
// This is a PUT request that updates a project.
// It takes the project id from the request params.
// It also takes the name and description from the request body.
// It then updates the project with the new name and description.
// It then returns the updated project.

const updateProject = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
  
    try {
      const project = await Project.findOne({ _id: id, user: req.user.id });
  
      if (!project) return res.status(404).json({ message: 'Project not found' });
  
      project.name = name || project.name;
      project.description = description || project.description;
  
      await project.save();
      res.status(200).json(project);
    } catch (err) {
      res.status(500).json({ message: 'Failed to update project', error: err.message });
    }
  };
  
  // Delete a project
  // This is a DELETE request that deletes a project.
  // It takes the project id from the request params.
  // It then deletes the project with the given id.
  // It then returns a message indicating that the project has been deleted.    

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
  
  module.exports = {
    createProject,
    getProjects,
    updateProject,
    deleteProject,
    getProjectById
  };
  
