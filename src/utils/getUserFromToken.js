// src/utils/getUserFromToken.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

module.exports = function getUserFromToken(authHeader) {
  const token = (authHeader || '').startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return { id: payload.id, email: payload.email };
  } catch (err) {
    return null;
  }
};
