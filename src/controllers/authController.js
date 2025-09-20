// src/controllers/authController.js
const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

exports.register = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const user = await userService.createUser({ email, password, name });
    res.status(201).json({ id: user.id, email: user.email, name: user.name });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userService.authenticate(email, password);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};