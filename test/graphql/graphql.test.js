// test/graphql/graphql.test.js
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const createApp = require('../../src/app');

let app;

before(async () => {
  app = await createApp();
});

describe('GraphQL', () => {
  const userService = require('../../src/services/userService');
  beforeEach(() => userService._resetForTests());

  it('register mutation then login mutation', async () => {
    const registerQuery = {
      query: `mutation { register(email:"g@graph.com", password:"pwd", name:"G") { id email name } }`
    };
    const r = await request(app).post('/graphql').send(registerQuery);
    expect(r.status).to.equal(200);
    expect(r.body.data.register).to.have.property('email', 'g@graph.com');

    const loginQuery = { query: `mutation { login(email:"g@graph.com", password:"pwd") }` };
    const l = await request(app).post('/graphql').send(loginQuery);
    expect(l.status).to.equal(200);
    expect(l.body.data.login).to.be.a('string');
  });

  it('me query returns null when not authenticated', async () => {
    const query = { query: `query { me { id email } }` };
    const r = await request(app).post('/graphql').send(query);
    expect(r.status).to.equal(200);
    expect(r.body.data.me).to.equal(null);
  });
});
