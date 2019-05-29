const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');
const { getEntryFileFullPath } = require('../utils');
const { DEFAULT_ENTRY, DEFAULT_DIST_DIR, DEFAULT_TARGET } = require('../../constants');

module.exports = {
  // prettier-ignore
  spec: {
    '--out':    String,
    '-o':       '--out',
    '--target': String,
    '-t':       '--target',
    '--entry':  String,
    '-e':       '--entry',
  },
  help: ({ exeName }) => `
    Usage
      $ ${exeName} build --out=dist

    Options
      --out,    -o  Directory to save build [${DEFAULT_DIST_DIR}]
      --entry,  -e  Entry file exporting keystone instance [${DEFAULT_ENTRY}]
      --target, -t  Target either 'server' or 'serverless' builds [${DEFAULT_TARGET}]
  `,
  exec: async (args, { exeName, _cwd = process.cwd() } = {}, spinner) => {
    process.env.NODE_ENV = 'production';

    const target = args['--target'] || DEFAULT_TARGET;
    if (target !== 'server' && target !== 'serverless') {
      return Promise.reject(new Error("target must be one of 'server' or 'serverless'"));
    }

    spinner.text = 'Validating project entry file';
    let entryFile = await getEntryFileFullPath(args, { exeName, _cwd });
    spinner.succeed(`Validated project entry file ./${path.relative(_cwd, entryFile)}`);

    spinner.start('Initialising Keystone instance');
    let { keystone, apps, distDir = DEFAULT_DIST_DIR } = require(entryFile);
    spinner.succeed('Initialised Keystone instance');

    if (args['--out']) {
      distDir = args['--out'];
    }
    let resolvedDistDir = path.resolve(_cwd, distDir);
    spinner.start(`Exporting Keystone build to ./${path.relative(_cwd, resolvedDistDir)}`);

    await fs.remove(resolvedDistDir);

    if (apps) {
      await Promise.all(
        apps
          .filter(({ targets } = {}) => targets && targets[target] && targets[target].build)
          .map(app =>
            require(app.targets[target].build)({
              distDir: resolvedDistDir,
              keystone,
              app,
            })
          )
      );

      spinner.succeed(
        chalk.green.bold(`Exported Keystone build to ./${path.relative(_cwd, resolvedDistDir)}`)
      );
    } else {
      spinner.info('Nothing to build.');
      spinner.info(
        `To create an Admin UI build, make sure you export 'admin' from ./${path.relative(
          _cwd,
          entryFile
        )}`
      );
    }
  },
};
