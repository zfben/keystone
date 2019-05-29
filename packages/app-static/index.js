const pathModule = require('path');

class StaticApp {
  constructor({ path, src }) {
    this._path = path;
    this._src = src;

    this.targets = {
      server: {
        build: pathModule.join(__dirname, 'build.js'),
        prepare: {
          development: pathModule.join(__dirname, 'middleware-dev.js'),
          production: pathModule.join(__dirname, 'middleware-prod.js'),
        }
      },
      serverless: {
        build: pathModule.join(__dirname, 'build.js'),
        prepare: {
          development: pathModule.join(__dirname, 'middleware-dev.js'),
          production: pathModule.join(__dirname, 'middleware-prod.js'),
        }
      }
    };
  }
}

module.exports = {
  StaticApp,
};
