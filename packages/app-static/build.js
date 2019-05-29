const fs = require('fs-extra');
const path = require('path');

const getDistDir = (src, distDir) => {
  const srcRelative = path.relative(process.cwd(), src);
  return path.resolve(path.join(distDir, srcRelative));
};

module.exports = ({ app, distDir }) => {
  const source = path.resolve(app._src);
  const destination = getDistDir(app._src, distDir);
  return fs.copy(source, destination);
};
