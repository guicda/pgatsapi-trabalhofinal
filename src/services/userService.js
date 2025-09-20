// src/services/userService.js
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const users = []; // in-memory store for this exercise

async function createUser({ email, password, name }) {
  if (!email || !password) throw new Error('email and password required');
  if (users.find(u => u.email === email)) throw new Error('User already exists');
  const hash = await bcrypt.hash(password, 10);
  const user = { id: uuidv4(), email, password: hash, name: name || null };
  users.push(user);
  // don't return password
  return { id: user.id, email: user.email, name: user.name };
}

function findUserByEmail(email) {
  return users.find(u => u.email === email);
}

async function authenticate(email, password) {
  const user = users.find(u => u.email === email);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null;
  return { id: user.id, email: user.email, name: user.name };
}

// helper for tests to reset memory
function _resetForTests() {
  users.length = 0;
}

module.exports = {
  createUser,
  findUserByEmail,
  authenticate,
  _resetForTests
};
