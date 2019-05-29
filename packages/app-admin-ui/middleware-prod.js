const fs = require('fs');
const path = require('path');
const express = require('express');
const fallback = require('express-history-api-fallback');
const compression = require('compression');

module.exports = ({ app, distDir }) => {
  const staticServer = express.Router();

  staticServer.use(compression());

  const builtAdminRoot = path.join(distDir, 'admin');
  if (!fs.existsSync(builtAdminRoot)) {
    throw new Error(
      'There are no Admin UI build artifacts. Please run `keystone build` before running `keystone start`'
    );
  }
  const secureBuiltRoot = path.join(builtAdminRoot, 'secure');
  const secureStaticMiddleware = express.static(secureBuiltRoot);
  const secureFallbackMiddleware = fallback('index.html', { root: secureBuiltRoot });

  if (app.authStrategy) {
    const publicBuiltRoot = path.join(builtAdminRoot, 'public');
    const publicStaticMiddleware = express.static(publicBuiltRoot);
    const publicFallbackMiddleware = fallback('index.html', { root: publicBuiltRoot });
    staticServer.use((req, res, next) => {
      // TODO: Better security, should check some property of the user
      return req.user
        ? secureStaticMiddleware(req, res, next)
        : publicStaticMiddleware(req, res, next);
    });

    staticServer.use((req, res, next) => {
      // TODO: Better security, should check some property of the user
      return req.user
        ? secureFallbackMiddleware(req, res, next)
        : publicFallbackMiddleware(req, res, next);
    });
  } else {
    staticServer.use(secureStaticMiddleware);
    staticServer.use(secureFallbackMiddleware);
  }

  const adminServer = express.Router();

  if (app.authStrategy) {
    adminServer.use(app.createSessionMiddleware());
  }

  adminServer.use(app.adminPath, staticServer);

  if (app.enableDefaultRoute) {
    // Attach this last onto the root so the `app.adminPath` can overwrite it
    // if necessary
    adminServer.get('/', (req, res) => res.sendFile(path.resolve(__dirname, './server/default.html')));
  }

  return adminServer;
}
