const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Project = require('../models/Project');
const { createProject, updateProject, deleteProject } = require('../controllers/projectController');

// Mock req/res
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Project Controller', () => {
  let mongoServer;
  let userId;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    userId = new mongoose.Types.ObjectId().toHexString();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Project.deleteMany({});
  });

  test('✅ createProject creates a project', async () => {
    const req = { user: { id: userId }, body: { name: 'Test Project', description: 'desc', dueDate: '2025-05-10' } };
    const res = mockResponse();
    await createProject(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    const savedProject = await Project.findOne({ name: 'Test Project' });
    expect(savedProject).not.toBeNull();
  });

  test('❌ createProject fails without name', async () => {
    const req = { user: { id: userId }, body: { description: 'desc' } }; // no name
    const res = mockResponse();
    await createProject(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
  });

  test('✅ updateProject updates project fields', async () => {
    const project = await Project.create({ name: 'Old Name', description: 'Old desc', dueDate: new Date('2025-01-01'), user: userId });
    const req = { params: { id: project._id }, user: { id: userId }, body: { name: 'New Name', description: 'New desc' } };
    const res = mockResponse();
    await updateProject(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    const updated = await Project.findById(project._id);
    expect(updated.name).toBe('New Name');
    expect(updated.description).toBe('New desc');
  });

  test('❌ updateProject fails for wrong user', async () => {
    const project = await Project.create({ name: 'Owned Project', user: userId });
    const wrongUserId = new mongoose.Types.ObjectId().toHexString();
    const req = { params: { id: project._id }, user: { id: wrongUserId }, body: { name: 'Hack Attempt' } };
    const res = mockResponse();
    await updateProject(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Project not found' }));
  });

  test('✅ deleteProject deletes project', async () => {
    const project = await Project.create({ name: 'Delete Me', user: userId });
    const req = { params: { id: project._id }, user: { id: userId } };
    const res = mockResponse();
    await deleteProject(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    const deleted = await Project.findById(project._id);
    expect(deleted).toBeNull();
  });

  test('❌ deleteProject fails for wrong user', async () => {
    const project = await Project.create({ name: 'Do not delete', user: userId });
    const wrongUserId = new mongoose.Types.ObjectId().toHexString();
    const req = { params: { id: project._id }, user: { id: wrongUserId } };
    const res = mockResponse();
    await deleteProject(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Project not found' }));
  });
});

