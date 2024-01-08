const { ApolloServer } = require("apollo-server-express");
const fs = require('fs');
const gql = require('graphql-tag');
const resolvers = require("./resolvers/resolver");
const path = require('path');
const typeDefs = gql(fs.readFileSync(path.join(__dirname, 'schema.gql'), 'utf-8'));
const context = require('./context');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');

module.exports = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
    persistedQueries: false,
    context: context,
});
