// src/graphql/schema.js
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String
  }

  type Query {
    me: User
  }

  type Mutation {
    register(email: String!, password: String!, name: String): User
    login(email: String!, password: String!): String
  }
`;

module.exports = typeDefs;
