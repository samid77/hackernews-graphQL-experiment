const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const gql = require('graphql-tag');
const { MONGODB } = require('./config.js');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');


/** Setup apollo server */
const server = new ApolloServer({
  typeDefs,
  resolvers
});

/** Connect to DB */
mongoose
  .connect(MONGODB, {useNewUrlParser: true})
  .then(() => {
    console.log(`MongoDB Connected ...`)
    return server.listen({port: 5000});
  })
  .then(res => {
    console.log(`Server running at ${res.url} ...`)
  })

  