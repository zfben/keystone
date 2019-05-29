const next = require('next');

module.exports = async ({ app }) => {
  const nextApp = next({ dir: app._dir, dev: true });
  await nextApp.prepare();
  // Add support for fridays/next-routes npm module
  if (app._nextRoutes) {
    return app._nextRoutes.getRequestHandler(nextApp);
  } else {
    return nextApp.getRequestHandler();
  }
};
