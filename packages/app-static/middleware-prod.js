const path = require('path');
const express = require('express');

const getDistDir = (src, distDir) => {
  const srcRelative = path.relative(process.cwd(), src);
  return path.resolve(path.join(distDir, srcRelative));
};

module.exports = ({ app, distDir }) => {
  const server = express();
  const destination = getDistDir(app._src, distDir);
  server.use(app._path, express.static(destination));
  return server;
};
