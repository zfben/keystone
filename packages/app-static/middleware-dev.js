const express = require('express');

module.exports = ({ app }) => {
  const server = express();
  server.use(app._path, express.static(app._src));
  return server;
};
