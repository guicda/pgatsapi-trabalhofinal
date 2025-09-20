const express = require('express');
const bodyParser = require('body-parser');
const { ApolloServer } = require('apollo-server-express');

const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const getUserFromToken = require('./utils/getUserFromToken');

async function createApp() {
  const app = express();
  app.use(bodyParser.json());

  // REST routes
  app.use('/api/auth', authRoutes);

  // protected REST example
  app.get('/api/profile', authMiddleware, (req, res) => {
    // req.user set by authMiddleware
    res.json({ user: req.user });
  });

  // Apollo Server (GraphQL) setup
  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const authHeader = req.headers.authorization || '';
      const user = getUserFromToken(authHeader);
      return { user };
    }
  });

  await apollo.start();
  apollo.applyMiddleware({ app, path: '/graphql' });

  // simple health
  app.get('/health', (req, res) => res.json({ ok: true }));

  return app;
}

module.exports = createApp;
