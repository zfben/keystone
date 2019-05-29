const path = require('path');
const fs = require('fs-extra');
const DEFAULT_DIST_DIR = 'dist';
const args = {};
const _cwd = process.cwd();
const exeName = 'keystone';
function getEntryFileFullPath() {
  return Promise.resolve(require.resolve(path.resolve(_cwd, 'index.js')));
}

// A copy of the cli build.js file, with a process.exit(0) at the end

(async () => {
process.env.NODE_ENV = 'production';

console.log('Validating project entry file');
let entryFile = await getEntryFileFullPath(args, { exeName, _cwd });
console.log(`Validated project entry file ./${path.relative(_cwd, entryFile)}`);

console.log('Initialising Keystone instance');
let { keystone, apps, distDir = DEFAULT_DIST_DIR } = require(entryFile);
console.log('Initialised Keystone instance');

if (args['--out']) {
  distDir = args['--out'];
}
let resolvedDistDir = path.resolve(_cwd, distDir);
console.log(`Exporting Keystone build to ./${path.relative(_cwd, resolvedDistDir)}`);

await fs.remove(resolvedDistDir);

if (apps) {
  await Promise.all(
    apps.map(app => {
      return app.build({
        apiPath: '/admin/api',
        distDir: resolvedDistDir,
        graphiqlPath: '/admin/graphiql',
        keystone,
      });
    })
  );

  console.log(
    `Exported Keystone build to ./${path.relative(_cwd, resolvedDistDir)}`
  );
} else {
  console.log('Nothing to build.');
  console.log(
    `To create an Admin UI build, make sure you export 'admin' from ./${path.relative(
      _cwd,
      entryFile
    )}`
  );
}

})().then(() => {
  process.exit(0);
});
