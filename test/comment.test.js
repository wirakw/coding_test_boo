const request = require('supertest');
const app = require('../app');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Profile = require('../models/Profile');
const { connect, close, clearDatabase } = require('./setup');

describe('Comment API Tests', () => {
  let testUser;
  let testProfile;

  beforeAll(async () => {
    await connect();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await close();
  });
 
  // Create a user and profile before each test
  beforeEach(async () => {
    testUser = await User.create({
      name: 'Test User',
      image: 'https://example.com/avatar.jpg'
    });

    testProfile = await Profile.create({
      name: 'Test Profile',
      description: 'Test Description',
      mbti: 'INTJ',
      enneagram: '5w4',
      variant: 'sp/sx',
      zodiac: 'Aries'
    });
  });

  describe('POST /api/comment', () => {
    it('should create a new comment with valid personality data', async () => {
      const newComment = {
        profileId: testProfile._id.toString(),
        userId: testUser._id.toString(),
        title: 'Great profile!',
        content: 'This is a test comment',
        personality: {
          mbti: 'INTJ',
          zodiac: 'Aries',
          enneagram: '5w4'
        }
      };

      const response = await request(app)
        .post('/api/comment')
        .send(newComment)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.title).toBe(newComment.title);
      expect(response.body.data.content).toBe(newComment.content);
      expect(response.body.data.personality.mbti).toBe(newComment.personality.mbti);
    });

    it('should return 400 when required fields are missing', async () => {
      const response = await request(app)
        .post('/api/comment')
        .send({
          profileId: testProfile._id.toString(),
          userId: testUser._id.toString(),
          title: 'Missing fields'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('all fields are required');
    });

    it('should return 400 when personality is not an object', async () => {
      const response = await request(app)
        .post('/api/comment')
        .send({
          profileId: testProfile._id.toString(),
          userId: testUser._id.toString(),
          title: 'Test',
          content: 'Test content',
          personality: 'invalid'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Personality must be an object');
    });

    it('should return 400 when MBTI is invalid', async () => {
      const response = await request(app)
        .post('/api/comment')
        .send({
          profileId: testProfile._id.toString(),
          userId: testUser._id.toString(),
          title: 'Test',
          content: 'Test content',
          personality: {
            mbti: 'INVALID'
          }
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid MBTI type in personality');
    });
  });

  describe('GET /api/comment', () => {
    it('should return all comments', async () => {
      await Comment.create([
        {
          profileId: testProfile._id,
          userId: testUser._id,
          title: 'Comment 1',
          content: 'Content 1',
          personality: { mbti: 'INTJ' }
        },
        {
          profileId: testProfile._id,
          userId: testUser._id,
          title: 'Comment 2',
          content: 'Content 2',
          personality: { zodiac: 'Leo' }
        }
      ]);

      const response = await request(app)
        .get('/api/comment')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.comments).toHaveLength(2);
      expect(response.body.data.count).toBe(2);
    });

    it('should filter comments by personality type', async () => {
      await Comment.create([
        {
          profileId: testProfile._id,
          userId: testUser._id,
          title: 'Comment 1',
          content: 'Content 1',
          personality: { mbti: 'INTJ' }
        },
        {
          profileId: testProfile._id,
          userId: testUser._id,
          title: 'Comment 2',
          content: 'Content 2',
          personality: { zodiac: 'Leo' }
        }
      ]);

      const response = await request(app)
        .get('/api/comment?personality=mbti')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.comments).toHaveLength(1);
      expect(response.body.data.comments[0].personality.mbti).toBe('INTJ');
    });
  });

  describe('POST /api/comment/like', () => {
    it('should like a comment', async () => {
      const comment = await Comment.create({
        profileId: testProfile._id,
        userId: testUser._id,
        title: 'Test Comment',
        content: 'Test Content',
        personality: { mbti: 'INTJ' }
      });

      const response = await request(app)
        .post('/api/comment/like')
        .send({
          commentId: comment._id.toString(),
          userId: testUser._id.toString()
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.liked).toBe(true);
      expect(response.body.data.totalLikes).toBe(1);
    });

    it('should unlike a comment when liked again', async () => {
      const comment = await Comment.create({
        profileId: testProfile._id,
        userId: testUser._id,
        title: 'Test Comment',
        content: 'Test Content',
        personality: { mbti: 'INTJ' },
        likes: [testUser._id]
      });

      const response = await request(app)
        .post('/api/comment/like')
        .send({
          commentId: comment._id.toString(),
          userId: testUser._id.toString()
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.liked).toBe(false);
      expect(response.body.data.totalLikes).toBe(0);
    });
  });
});
