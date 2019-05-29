const path = require('path');

class NextApp {
  constructor({ dir, nextRoutes }) {
    this._dir = path.resolve(dir);
    this._nextRoutes = nextRoutes;

    this.targets = {
      server: {
        build: path.join(__dirname, 'build.js'),
        prepare: {
          development: path.join(__dirname, 'middleware-dev.js'),
          production: path.join(__dirname, 'middleware-prod.js'),
        }
      },
      serverless: {
        build: path.join(__dirname, 'build.js'),
        prepare: {
          development: path.join(__dirname, 'middleware-dev.js'),
          production: path.join(__dirname, 'middleware-prod.js'),
        }
      }
    };
  }
}

module.exports = {
  NextApp,
};
