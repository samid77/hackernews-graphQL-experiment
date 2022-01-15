const postsResolvers = require('./posts.js')
const usersResolvers = require('./users.js')
const commentsResolvers = require('./comments.js')

module.exports = {
    Post: {
      likeCount(parent) {
        return parent.likes.length;
      },
      commentCount: (parent) => parent.comments.length
    },
    Query: {
      ...postsResolvers.Query
    },
    Mutation: {
      ...usersResolvers.Mutation,
      ...postsResolvers.Mutation,
      ...commentsResolvers.Mutation,
    },
    Subscription: {
      ...postsResolvers.Subscription
    }
}