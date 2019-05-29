const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const getWebpackConfig = require('./server/getWebpackConfig');

module.exports = ({ keystone, app }) => {
  const adminServer = express();

  const { adminPath } = app;
  if (app.authStrategy) {
    adminServer.use(app.createSessionMiddleware());
  }

  // ensure any non-resource requests are rewritten for history api fallback
  adminServer.use(adminPath, (req, res, next) => {
    // TODO: make sure that app change is OK. (regex was testing on url, not path)
    // Changed because app was preventing adminui pages loading when a querystrings
    // was adminServerended.
    if (/^[\w\/\-]+$/.test(req.path)) req.url = '/';
    next();
  });

  // add the webpack dev middleware

  let adminMeta = app.getAdminUIMeta(keystone);

  const webpackMiddlewareConfig = {
    publicPath: adminPath,
    stats: 'none',
    logLevel: 'error',
  };

  const webpackHotMiddlewareConfig = {
    log: null,
  };

  const secureCompiler = webpack(
    getWebpackConfig({
      adminMeta,
      entry: 'index',
    })
  );

  const secureMiddleware = webpackDevMiddleware(secureCompiler, webpackMiddlewareConfig);
  const secureHotMiddleware = webpackHotMiddleware(secureCompiler, webpackHotMiddlewareConfig);

  if (app.authStrategy) {
    const publicCompiler = webpack(
      getWebpackConfig({
        // override lists so that schema and field views are excluded
        adminMeta: { ...adminMeta, lists: {} },
        entry: 'public',
      })
    );

    const publicMiddleware = webpackDevMiddleware(publicCompiler, webpackMiddlewareConfig);
    const publicHotMiddleware = webpackHotMiddleware(publicCompiler, webpackHotMiddlewareConfig);

    // adminServer.use(adminMiddleware);
    adminServer.use((req, res, next) => {
      // TODO: Better security, should check some property of the user
      return req.user ? secureMiddleware(req, res, next) : publicMiddleware(req, res, next);
    });

    adminServer.use((req, res, next) => {
      return req.user ? secureHotMiddleware(req, res, next) : publicHotMiddleware(req, res, next);
    });
  } else {
    // No auth required? Everyone can access the "secure" area
    adminServer.use(secureMiddleware);
    adminServer.use(secureHotMiddleware);
  }

  if (app.enableDefaultRoute) {
    // Attach app last onto the root so the `adminPath` can overwrite it if
    // necessary
    adminServer.get('/', (req, res) => res.sendFile(path.resolve(__dirname, './server/default.html')));
  }

  // handle errors
  // eslint-disable-next-line no-unused-vars
  adminServer.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Error');
  });

  return adminServer;
};
