const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../index');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany();
});

describe('User Controller', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
      .expect(201);

    expect(res.body.user.name).toBe('Test User');
    expect(res.body.user.email).toBe('test@example.com');
    expect(res.body.token).toBeDefined();
  });

  it('should not register user with existing email', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    await User.create({
      name: 'Existing',
      email: 'existing@example.com',
      password: hashedPassword
    });

    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'New User',
        email: 'existing@example.com',
        password: 'password123'
      })
      .expect(400);

    expect(res.body.message).toMatch(/already exists/i);
  });

  it('should login a user with valid credentials', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    await User.create({
      name: 'Login User',
      email: 'login@example.com',
      password: hashedPassword
    });

    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'login@example.com',
        password: 'password123'
      })
      .expect(200);

    expect(res.body.user.name).toBe('Login User');
    expect(res.body.user.email).toBe('login@example.com');
    expect(res.body.token).toBeDefined();
  });

  it('should reject login with wrong password', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    await User.create({
      name: 'Wrong Pass',
      email: 'wrongpass@example.com',
      password: hashedPassword
    });

    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'wrongpass@example.com',
        password: 'wrongpassword'
      })
      .expect(401);

    expect(res.body.message).toMatch(/invalid credentials/i);
  });

  it('should reject login for non-existing user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'password123'
      })
      .expect(401);

    expect(res.body.message).toMatch(/invalid credentials/i);
  });
});
