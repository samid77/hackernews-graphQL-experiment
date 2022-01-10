const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const gql = require('graphql-tag');
const { MONGODB } = require('./config.js')

const typeDefs = gql`
  type Query{
    sayHi: String!
  }
`

/** Set logic for queries */
const resolvers = {
  Query: {
    sayHi: () => 'FirstQuery from Apollo Samid'
  }
}

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


/** Setup apollo server */
const server = new ApolloServer({
  typeDefs,
  resolvers
});

  