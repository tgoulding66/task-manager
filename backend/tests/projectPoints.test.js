const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const app = require('../app'); // ✅ Import ONLY app
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

let mongoServer;
let token;
let userId;
let projectId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);

  // ✅ Create test user
  const user = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: 'pass1234'
  });
  userId = user._id;

  // ✅ Use SAME secret as authMiddleware expects
  const secret = process.env.JWT_SECRET || 'testsecret'; // fallback for test env
  token = jwt.sign({ id: userId }, secret, { expiresIn: '1h' });

  // ✅ Create test project
  const project = await Project.create({
    name: 'Test Project',
    description: 'Test project description',
    user: userId
  });
  projectId = project._id;

  // ✅ Create test tasks
  await Task.create([
    { title: 'Task 1', points: 3, status: 'Done', project: projectId, user: userId },
    { title: 'Task 2', points: 5, status: 'To Do', project: projectId, user: userId },
    { title: 'Task 3', points: 8, status: 'Done', project: projectId, user: userId }
  ]);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('GET /api/projects/:id/points', () => {
  it('returns correct totalPoints and completedPoints', async () => {
    const res = await request(app)
      .get(`/api/projects/${projectId}/points`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.totalPoints).toBe(16); // 3 + 5 + 8
    expect(res.body.completedPoints).toBe(11); // 3 + 8
  });
});
