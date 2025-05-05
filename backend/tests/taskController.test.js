const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Task = require('../models/Task');
const Project = require('../models/Project');
const { createTask, updateTask, deleteTask } = require('../controllers/taskController');

// Mock req/res
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Task Controller', () => {
  let mongoServer;
  let userId, projectId;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    userId = new mongoose.Types.ObjectId().toHexString();
    const project = await Project.create({ name: 'Test Project', user: userId });
    projectId = project._id;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Task.deleteMany({});
  });

  test('✅ createTask creates a task', async () => {
    const req = {
      user: { id: userId },
      body: { title: 'New Task', description: 'desc', status: 'To Do', projectId }
    };
    const res = mockResponse();
    await createTask(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    const savedTask = await Task.findOne({ title: 'New Task' });
    expect(savedTask).not.toBeNull();
  });

  test('❌ createTask fails without title', async () => {
    const req = { user: { id: userId }, body: { projectId } };
    const res = mockResponse();
    await createTask(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
  });

  test('✅ updateTask updates task fields', async () => {
    const task = await Task.create({ title: 'Old Task', status: 'To Do', project: projectId, user: userId });
    const req = {
      params: { id: task._id },
      user: { id: userId },
      body: { title: 'Updated Task', status: 'Done' }
    };
    const res = mockResponse();
    await updateTask(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    const updated = await Task.findById(task._id);
    expect(updated.title).toBe('Updated Task');
    expect(updated.status).toBe('Done');
  });

  test('❌ updateTask fails for wrong user', async () => {
    const task = await Task.create({ title: 'Owned Task', status: 'To Do', project: projectId, user: userId });
    const wrongUserId = new mongoose.Types.ObjectId().toHexString();
    const req = { params: { id: task._id }, user: { id: wrongUserId }, body: { title: 'Hack Attempt' } };
    const res = mockResponse();
    await updateTask(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Task not found' }));
  });

  test('✅ deleteTask deletes task', async () => {
    const task = await Task.create({ title: 'Delete Me', project: projectId, user: userId });
    const req = { params: { id: task._id }, user: { id: userId } };
    const res = mockResponse();
    await deleteTask(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    const deleted = await Task.findById(task._id);
    expect(deleted).toBeNull();
  });

  test('❌ deleteTask fails for wrong user', async () => {
    const task = await Task.create({ title: 'Protected Task', project: projectId, user: userId });
    const wrongUserId = new mongoose.Types.ObjectId().toHexString();
    const req = { params: { id: task._id }, user: { id: wrongUserId } };
    const res = mockResponse();
    await deleteTask(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Task not found' }));
  });
});

