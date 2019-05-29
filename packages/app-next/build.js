const nextBuild = require('next/dist/build').default;

module.exports = ({ app }) => {
  return nextBuild(app._dir);
};
