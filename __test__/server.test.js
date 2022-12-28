const supertest = require('supertest');
const app = require('../src/server/app.js');

describe('Connect to server', () => {
    test('a success message should be received', async () => {
        const response = await supertest(app)
            .get('/test')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);
        expect(response.body.success).toEqual('true');
    });
});
