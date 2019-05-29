//const { createNowNodeApp } = require('@keystone-alpha/target-now');
const { createNowNodeApp } = require('./target-now');

const { distDir, keystone, apps } = require('./index');

module.exports = createNowNodeApp({ distDir, keystone, apps });
