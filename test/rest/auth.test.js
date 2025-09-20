// test/rest/auth.test.js
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const createApp = require('../..//src/app'); // note: tests run from project root

let app;

before(async () => {
  app = await createApp();
});

describe('REST: /api/auth', () => {
  const userService = require('../../src/services/userService');
  beforeEach(() => userService._resetForTests());

  it('should register a user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'a@a.com', password: '123456', name: 'A' });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('email', 'a@a.com');
  });

  it('should login and return token', async () => {
    await request(app).post('/api/auth/register').send({ email: 'b@b.com', password: 'pwd', name: 'B' });
    const res = await request(app).post('/api/auth/login').send({ email: 'b@b.com', password: 'pwd' });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
  });

  it('should protect /api/profile', async () => {
    await request(app).post('/api/auth/register').send({ email: 'p@p.com', password: 'pwd', name: 'P' });
    const login = await request(app).post('/api/auth/login').send({ email: 'p@p.com', password: 'pwd' });
    const token = login.body.token;
    const res = await request(app).get('/api/profile').set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body.user).to.have.property('email', 'p@p.com');
  });
});
