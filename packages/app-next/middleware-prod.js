const next = require('next');

module.exports = async ({ app, distDir }) => {
  const nextApp = next({ distDir, dir: app._dir, dev: false });
  await nextApp.prepare();
  // Add support for fridays/next-routes npm module
  if (app._nextRoutes) {
    return app._nextRoutes.getRequestHandler(nextApp);
  } else {
    return nextApp.getRequestHandler();
  }
};
