const falsey = require('falsey');
const createCorsMiddleware = require('cors');
const { commonSessionMiddleware } = require('@keystone-alpha/session');

const { createApolloServer } = require('./lib/apolloServer');
const createGraphQLMiddleware = require('./lib/graphql');

module.exports = ({ keystone, app, dev }) => {
  const middlewares = [];

  if (falsey(process.env.DISABLE_LOGGING)) {
    middlewares.push(require('express-pino-logger')(app._pinoOptions));
  }

  if (app._cors) {
    middlewares.push(createCorsMiddleware(app._cors));
  }

  if (keystone.auth && Object.keys(keystone.auth).length > 0) {
    middlewares.push(commonSessionMiddleware(keystone, app._cookieSecret, app._sessionStore));
  }

  const server = createApolloServer(keystone, app._apollo, app._schemaName, dev);
  // GraphQL API always exists independent of any adminUI or Session
  // settings We currently make the admin UI public. In the future we want
  // to be able to restrict app to a limited audience, while setting up a
  // separate public API with much stricter access control.
  middlewares.push(
    createGraphQLMiddleware(
      server,
      { apiPath: app._apiPath, graphiqlPath: app._graphiqlPath },
      { isPublic: true }
    )
  );

  return middlewares;
};
