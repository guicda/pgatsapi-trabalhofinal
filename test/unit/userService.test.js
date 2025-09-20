// test/unit/userService.test.js
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const bcrypt = require('bcryptjs');
const userService = require('../../src/services/userService');

describe('userService (unit tests w/ Sinon)', () => {
  beforeEach(() => userService._resetForTests());
  afterEach(() => sinon.restore());

  it('createUser should call bcrypt.hash', async () => {
    const hashStub = sinon.stub(bcrypt, 'hash').resolves('fakehash');
    const u = await userService.createUser({ email: 's@s.com', password: 'pw', name: 'S' });
    expect(hashStub.calledOnce).to.be.true;
    expect(u).to.have.property('email', 's@s.com');
  });

  it('authenticate should call bcrypt.compare', async () => {
    sinon.stub(bcrypt, 'hash').resolves('fakehash');
    await userService.createUser({ email: 'c@c.com', password: 'pw', name: 'C' });

    const compareStub = sinon.stub(bcrypt, 'compare').resolves(true);
    const auth = await userService.authenticate('c@c.com', 'pw');
    expect(compareStub.calledOnce).to.be.true;
    expect(auth).to.have.property('email', 'c@c.com');
  });
});
