const path = require('path');
const webpack = require('webpack');

const getWebpackConfig = require('./server/getWebpackConfig');

module.exports = ({ keystone, app, distDir }) => {
  const builtAdminRoot = path.join(distDir, 'admin');

  const adminMeta = app.getAdminUIMeta(keystone);

  const compilers = [];

  const secureCompiler = webpack(
    getWebpackConfig({
      adminMeta,
      entry: 'index',
      outputPath: path.join(builtAdminRoot, 'secure'),
    })
  );
  compilers.push(secureCompiler);

  if (app.authStrategy) {
    const publicCompiler = webpack(
      getWebpackConfig({
        // override lists so that schema and field views are excluded
        adminMeta: { ...adminMeta, lists: {} },
        entry: 'public',
        outputPath: path.join(builtAdminRoot, 'public'),
      })
    );
    compilers.push(publicCompiler);
  }

  return Promise.all(
    compilers.map(
      compiler =>
      new Promise((resolve, reject) => {
        compiler.run(err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      })
    )
  );
}
