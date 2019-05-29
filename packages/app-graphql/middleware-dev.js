const prepareMiddleware = require('./prepare-middleware');
module.exports = (args) => {
  return prepareMiddleware({ ...args, dev: true });
};
