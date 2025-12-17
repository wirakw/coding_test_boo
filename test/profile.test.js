const request = require('supertest');
const app = require('../app');
const Profile = require('../models/Profile');
const { connect, close, clearDatabase } = require('./setup');

describe('Profile API Tests', () => {
  beforeAll(async () => {
    await connect();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await close();
  });

  describe('POST /api/profile', () => {
    it('should create a new profile with all fields', async () => {
      const newProfile = {
        name: 'John Doe',
        description: 'A test profile',
        mbti: 'INTJ',
        enneagram: '5w4',
        variant: 'sp/sx',
        tritype: 548,
        socionics: 'ILI',
        sloan: 'RCOEI',
        psyche: 'VLEF',
        image: 'https://example.com/avatar.jpg'
      };

      const response = await request(app)
        .post('/api/profile')
        .send(newProfile)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.name).toBe(newProfile.name);
      expect(response.body.data.description).toBe(newProfile.description);
      expect(response.body.data.mbti).toBe(newProfile.mbti);
      expect(response.body.data.enneagram).toBe(newProfile.enneagram);
      expect(response.body.data.variant).toBe(newProfile.variant);
      expect(response.body.data.tritype).toBe(newProfile.tritype);
      expect(response.body.data.socionics).toBe(newProfile.socionics);
      expect(response.body.data.sloan).toBe(newProfile.sloan);
      expect(response.body.data.psyche).toBe(newProfile.psyche);
      expect(response.body.data.image).toBe(newProfile.image);
    });

    it('should create a profile with only required fields', async () => {
      const newProfile = {
        name: 'Jane Smith'
      };

      const response = await request(app)
        .post('/api/profile')
        .send(newProfile)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(newProfile.name);
      expect(response.body.data.description).toBe('');
      expect(response.body.data.mbti).toBe('');
      expect(response.body.data.image).toContain('ui-avatars.com');
    });

    it('should create profile with default avatar when image is not provided', async () => {
      const newProfile = {
        name: 'Test User'
      };

      const response = await request(app)
        .post('/api/profile')
        .send(newProfile)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.image).toContain('ui-avatars.com');
      expect(response.body.data.image).toContain(encodeURIComponent('Test User'));
    });

    it('should return 400 error when name is missing', async () => {
      const response = await request(app)
        .post('/api/profile')
        .send({
          description: 'Missing name'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Name is required');
    });

    it('should create profile with partial personality data', async () => {
      const newProfile = {
        name: 'Partial Profile',
        mbti: 'ENFP',
        enneagram: '7w6'
      };

      const response = await request(app)
        .post('/api/profile')
        .send(newProfile)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.mbti).toBe('ENFP');
      expect(response.body.data.enneagram).toBe('7w6');
      expect(response.body.data.variant).toBe('');
      expect(response.body.data.tritype).toBeNull();
    });
  });

  describe('GET /api/profile', () => {
    it('should return all profiles', async () => {
      await Profile.create([
        {
          name: 'Profile 1',
          description: 'Description 1',
          mbti: 'INTJ',
          enneagram: '5w4'
        },
        {
          name: 'Profile 2',
          description: 'Description 2',
          mbti: 'ENFP',
          enneagram: '7w6'
        },
        {
          name: 'Profile 3',
          description: 'Description 3',
          mbti: 'INFJ',
          enneagram: '4w5'
        }
      ]);

      const response = await request(app)
        .get('/api/profile')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.profiles).toHaveLength(3);
      expect(response.body.data.count).toBe(3);
    });

    it('should return empty array when no profiles exist', async () => {
      const response = await request(app)
        .get('/api/profile')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.profiles).toHaveLength(0);
      expect(response.body.data.count).toBe(0);
    });

    it('should return profiles with all personality fields', async () => {
      await Profile.create({
        name: 'Full Profile',
        description: 'Complete personality data',
        mbti: 'INTJ',
        enneagram: '5w4',
        variant: 'sp/sx',
        tritype: 548,
        socionics: 'ILI',
        sloan: 'RCOEI',
        psyche: 'VLEF'
      });

      const response = await request(app)
        .get('/api/profile')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.profiles).toHaveLength(1);
      const profile = response.body.data.profiles[0];
      expect(profile.mbti).toBe('INTJ');
      expect(profile.enneagram).toBe('5w4');
      expect(profile.variant).toBe('sp/sx');
      expect(profile.tritype).toBe(548);
      expect(profile.socionics).toBe('ILI');
      expect(profile.sloan).toBe('RCOEI');
      expect(profile.psyche).toBe('VLEF');
    });
  });

  describe('GET /api/profile/:id', () => {
    it('should return a profile by id', async () => {
      const profile = await Profile.create({
        name: 'Test Profile',
        description: 'Test Description',
        mbti: 'INTJ',
        enneagram: '5w4',
        image: 'https://example.com/test.jpg'
      });

      const response = await request(app)
        .get(`/api/profile/${profile._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(profile.name);
      expect(response.body.data.description).toBe(profile.description);
      expect(response.body.data._id.toString()).toBe(profile._id.toString());
    });

    it('should return 404 when profile not found', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .get(`/api/profile/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Profile not found');
    });

    it('should return profile with complete personality data', async () => {
      const profile = await Profile.create({
        name: 'Complete Profile',
        description: 'All fields',
        mbti: 'ENFP',
        enneagram: '7w6',
        variant: 'sx/so',
        tritype: 729,
        socionics: 'IEE',
        sloan: 'SCUAI',
        psyche: 'ELVF'
      });

      const response = await request(app)
        .get(`/api/profile/${profile._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tritype).toBe(729);
      expect(response.body.data.socionics).toBe('IEE');
    });
  });

  describe('PUT /api/profile/:id', () => {
    it('should update a profile with new data', async () => {
      const profile = await Profile.create({
        name: 'Original Name',
        description: 'Original Description',
        mbti: 'INTJ',
        enneagram: '5w4',
        image: 'https://example.com/original.jpg'
      });

      const updates = {
        name: 'Updated Name',
        description: 'Updated Description',
        mbti: 'INFJ',
        enneagram: '4w5',
        image: 'https://example.com/updated.jpg'
      };

      const response = await request(app)
        .put(`/api/profile/${profile._id}`)
        .send(updates)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updates.name);
      expect(response.body.data.description).toBe(updates.description);
      expect(response.body.data.mbti).toBe(updates.mbti);
      expect(response.body.data.enneagram).toBe(updates.enneagram);
      expect(response.body.data.image).toBe(updates.image);
    });

    it('should update only specified fields', async () => {
      const profile = await Profile.create({
        name: 'Original Name',
        description: 'Original Description',
        mbti: 'INTJ',
        enneagram: '5w4'
      });

      const updates = {
        mbti: 'INFP'
      };

      const response = await request(app)
        .put(`/api/profile/${profile._id}`)
        .send(updates)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.mbti).toBe('INFP');
      expect(response.body.data.name).toBe('Original Name');
      expect(response.body.data.description).toBe('Original Description');
      expect(response.body.data.enneagram).toBe('5w4');
    });

    it('should update all personality fields', async () => {
      const profile = await Profile.create({
        name: 'Test Profile',
        mbti: 'INTJ'
      });

      const updates = {
        mbti: 'ENFP',
        enneagram: '7w6',
        variant: 'sx/so',
        tritype: 729,
        socionics: 'IEE',
        sloan: 'SCUAI',
        psyche: 'ELVF'
      };

      const response = await request(app)
        .put(`/api/profile/${profile._id}`)
        .send(updates)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.mbti).toBe('ENFP');
      expect(response.body.data.enneagram).toBe('7w6');
      expect(response.body.data.variant).toBe('sx/so');
      expect(response.body.data.tritype).toBe(729);
      expect(response.body.data.socionics).toBe('IEE');
      expect(response.body.data.sloan).toBe('SCUAI');
      expect(response.body.data.psyche).toBe('ELVF');
    });

    it('should return 404 when updating non-existent profile', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .put(`/api/profile/${fakeId}`)
        .send({ name: 'New Name' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Profile not found');
    });

    it('should handle empty update gracefully', async () => {
      const profile = await Profile.create({
        name: 'Test Profile',
        description: 'Test Description'
      });

      const response = await request(app)
        .put(`/api/profile/${profile._id}`)
        .send({})
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Test Profile');
      expect(response.body.data.description).toBe('Test Description');
    });
  });

  describe('DELETE /api/profile/:id', () => {
    it('should delete a profile', async () => {
      const profile = await Profile.create({
        name: 'Profile to Delete',
        description: 'This will be deleted',
        mbti: 'INTJ',
        image: 'https://example.com/delete.jpg'
      });

      const response = await request(app)
        .delete(`/api/profile/${profile._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toBe('Profile deleted successfully');

      // Verify profile was deleted
      const deletedProfile = await Profile.findById(profile._id);
      expect(deletedProfile).toBeNull();
    });

    it('should return 404 when deleting non-existent profile', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .delete(`/api/profile/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Profile not found');
    });

    it('should successfully delete profile with complete data', async () => {
      const profile = await Profile.create({
        name: 'Complex Profile',
        description: 'All fields',
        mbti: 'INTJ',
        enneagram: '5w4',
        variant: 'sp/sx',
        tritype: 548,
        socionics: 'ILI',
        sloan: 'RCOEI',
        psyche: 'VLEF',
        image: 'https://example.com/complex.jpg'
      });

      const response = await request(app)
        .delete(`/api/profile/${profile._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify deletion
      const deletedProfile = await Profile.findById(profile._id);
      expect(deletedProfile).toBeNull();
    });
  });
});
