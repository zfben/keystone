const path = require('path');

class GraphQLApp {
  constructor({
    cors = { origin: true, credentials: true },
    cookieSecret = 'qwerty',
    apiPath = '/admin/api',
    graphiqlPath = '/admin/graphiql',
    schemaName = 'admin',
    apollo = {},
    sessionStore,
    pinoOptions,
  } = {}) {
    this._apiPath = apiPath;
    this._graphiqlPath = graphiqlPath;
    this._pinoOptions = pinoOptions;
    this._cors = cors;
    this._cookieSecret = cookieSecret;
    this._sessionStore = sessionStore;
    this._apollo = apollo;
    this._schemaName = schemaName;

    this.targets = {
      server: {
        prepare: {
          development: path.join(__dirname, 'middleware-dev.js'),
          production: path.join(__dirname, 'middleware-prod.js'),
        }
      },
      serverless: {
        prepare: {
          development: path.join(__dirname, 'middleware-dev.js'),
          production: path.join(__dirname, 'middleware-prod.js'),
        }
      }
    };
  }
}

module.exports = {
  GraphQLApp,
};
