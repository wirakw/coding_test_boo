const request = require('supertest');
const app = require('../app');
const Profile = require('../models/Profile');
const { connect, close, clearDatabase } = require('./setup');

describe('Profile UI Route Tests', () => {
    beforeAll(async () => {
        await connect();
    });

    afterEach(async () => {
        await clearDatabase();
    });

    afterAll(async () => {
        await close();
    });

    describe('GET /', () => {
        it('should render profile page with first profile when no profileid is specified', async () => {
            // Create test profiles
            await Profile.create([
                {
                    "name": "A Martinez",
                    "description": "Adolph Larrue Martinez III.",
                    "mbti": "ISFJ",
                    "enneagram": "9w3",
                    "variant": "sp/so",
                    "tritype": 725,
                    "socionics": "SEE",
                    "sloan": "RCOEN",
                    "psyche": "FEVL",
                    "image": "https://soulverse.boo.world/images/1.png",
                },
                {
                    "name": "Bond Joviwski",
                    "description": "Bond joviwski the best of the world. lorem ipsum dolor sit amet.",
                    "mbti": "ENTP",
                    "enneagram": "7w8",
                    "variant": "sp/so",
                    "tritype": 725,
                    "socionics": "SEE",
                    "sloan": "RCOEN",
                    "psyche": "FEVL",
                    "image": "https://soulverse.boo.world/images/1.png",
                }
            ]);

            const response = await request(app)
                .get('/')
                .expect(200);

            // Check if HTML is returned
            expect(response.type).toBe('text/html');

            // Check if profile data is in the HTML
            expect(response.text).toContain('A Martinez');
            expect(response.text).toContain('Adolph Larrue Martinez III.');
            expect(response.text).toContain('ISFJ');
        });

        it('should render specific profile when profileid is provided', async () => {
            const profile1 = await Profile.create({
                    "name": "A Martinez",
                    "description": "Adolph Larrue Martinez III.",
                    "mbti": "ISFJ",
                    "enneagram": "9w3",
                    "variant": "sp/so",
                    "tritype": 725,
                    "socionics": "SEE",
                    "sloan": "RCOEN",
                    "psyche": "FEVL",
                    "image": "https://soulverse.boo.world/images/1.png",
                });

            const profile2 = await Profile.create({
                    "name": "Bond Joviwski",
                    "description": "Bond joviwski the best of the world. lorem ipsum dolor sit amet.",
                    "mbti": "ENTP",
                    "enneagram": "7w8",
                    "variant": "sp/so",
                    "tritype": 725,
                    "socionics": "SEE",
                    "sloan": "RCOEN",
                    "psyche": "FEVL",
                    "image": "https://soulverse.boo.world/images/1.png",
                });

            const response = await request(app)
                .get(`/?profileid=${profile2._id}`)
                .expect(200);

            expect(response.type).toBe('text/html');
            expect(response.text).toContain('Bond Joviwski');
            expect(response.text).toContain('Bond joviwski the best of the world. lorem ipsum dolor sit amet.');
            expect(response.text).toContain('ENTP');
            // Should not contain the first profile
            expect(response.text).not.toContain('A Martinez');
        });

        it('should return 404 when no profiles exist', async () => {
            const response = await request(app)
                .get('/')
                .expect(404);

            expect(response.text).toContain('No profiles found');
        });

        it('should return 404 when specified profileid does not exist', async () => {
            await Profile.create({
                name: 'Existing Profile',
                description: 'This exists',
                mbti: 'INTJ'
            });

            const fakeId = '507f1f77bcf86cd799439011';

            const response = await request(app)
                .get(`/?profileid=${fakeId}`)
                .expect(404);

            expect(response.text).toContain('No profiles found');
        });
    });
});
