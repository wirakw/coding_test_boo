const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const { connect, close, clearDatabase } = require('./setup');

describe('User API Tests', () => {
  // Connect to a new in-memory database before running any tests
  beforeAll(async () => {
    await connect();
  });

  // Clear all test data after every test
  afterEach(async () => {
    await clearDatabase();
  });

  // Close database connection after all tests
  afterAll(async () => {
    await close();
  });

  describe('POST /api/user', () => {
    it('should create a new user with name and image', async () => {
      const newUser = {
        name: 'John Doe',
        image: 'https://example.com/avatar.jpg'
      };

      const response = await request(app)
        .post('/api/user')
        .send(newUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.name).toBe(newUser.name);
      expect(response.body.data.image).toBe(newUser.image);
    });

    it('should create a user with default avatar when image is not provided', async () => {
      const newUser = {
        name: 'Jane Smith'
      };

      const response = await request(app)
        .post('/api/user')
        .send(newUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(newUser.name);
      expect(response.body.data.image).toContain('ui-avatars.com');
    });

    it('should return 400 error when name is missing', async () => {
      const response = await request(app)
        .post('/api/user')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Name is required');
    });
  });

  describe('GET /api/user', () => {
    it('should return all users', async () => {
      // Create test users
      await User.create([
        { name: 'User 1', image: 'https://example.com/1.jpg' },
        { name: 'User 2', image: 'https://example.com/2.jpg' }
      ]);

      const response = await request(app)
        .get('/api/user')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.users).toHaveLength(2);
      expect(response.body.data.count).toBe(2);
    });

    it('should return empty array when no users exist', async () => {
      const response = await request(app)
        .get('/api/user')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.users).toHaveLength(0);
      expect(response.body.data.count).toBe(0);
    });
  });

  describe('GET /api/user/:id', () => {
    it('should return a user by id', async () => {
      const user = await User.create({
        name: 'user test',
        image: 'https://example.com/test.jpg'
      });

      const response = await request(app)
        .get(`/api/user/${user._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(user.name);
      expect(response.body.data._id.toString()).toBe(user._id.toString());
    });

    it('should return 404 when user not found', async () => {
      const fakeId = '507f1f77bcf86cd799439011'; //fake id like mongo id

      const response = await request(app)
        .get(`/api/user/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User not found');
    });
  });

  describe('PUT /api/user/:id', () => {
    it('should update a user', async () => {
      const user = await User.create({
        name: 'user test',
        image: 'https://example.com/original.jpg'
      });

      const updates = {
        name: 'user test updated',
        image: 'https://example.com/updated.jpg'
      };

      const response = await request(app)
        .put(`/api/user/${user._id}`)
        .send(updates)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updates.name);
      expect(response.body.data.image).toBe(updates.image);
    });

    it('should return 404 when updating non-existent user', async () => {
      const fakeId = '507f1f77bcf86cd799439011'; //fake id like mongo id

      const response = await request(app)
        .put(`/api/user/${fakeId}`)
        .send({ name: 'user test' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User not found');
    });
  });

  describe('DELETE /api/user/:id', () => {
    it('should delete a user', async () => {
      const user = await User.create({
        name: 'user test',
        image: 'https://example.com/delete.jpg'
      });

      const response = await request(app)
        .delete(`/api/user/${user._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify user was deleted
      const deletedUser = await User.findById(user._id);
      expect(deletedUser).toBeNull();
    });

    it('should return 404 when deleting non-existent user', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .delete(`/api/user/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User not found');
    });
  });
});
