// src/graphql/resolvers.js
const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

module.exports = {
  Query: {
    me: (_, __, { user }) => {
      if (!user) return null;
      return { id: user.id, email: user.email };
    }
  },

  Mutation: {
    register: async (_, { email, password, name }) => {
      const u = await userService.createUser({ email, password, name });
      return u;
    },

    login: async (_, { email, password }) => {
      const user = await userService.authenticate(email, password);
      if (!user) throw new Error('Invalid credentials');
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
      return token;
    }
  }
};
