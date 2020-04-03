const path = require('path');
const chalk = require('chalk');
const { DEFAULT_ENTRY } = require('../../constants');
const { getEntryFileFullPath } = require('../utils');

const printArrow = ({ left, right }) => {
  if (right) {
    console.log(`  ${left.listKey}.${left.path} -> ${right.listKey}.${right.path}`);
  } else {
    console.log(`  ${left.listKey}.${left.path} -> ${left.refListKey}`);
  }
};

const strategySummary = (
  { one_one_to_many, one_many_to_many, two_one_to_one, two_one_to_many, two_many_to_many },
  keystone
) => {
  const mongo = !!keystone.adapters.MongooseAdapter;
  const c = s => chalk.cyan(s);
  let f, g;
  if (mongo) {
    const { _pluralize } = keystone.adapters.MongooseAdapter.mongoose;
    f = s => chalk.cyan(_pluralize(s));
    g = left => chalk.cyan(`${_pluralize(left.listKey)}.${left.path}`);
  }

  console.log(chalk.bold('One-sided: one to many'));
  one_one_to_many.forEach(({ left }) => {
    printArrow({ left });
    console.log('    * No action required');
  });

  console.log(chalk.bold('One-sided: many to many'));
  one_many_to_many.forEach(({ left, columnNames, tableName }) => {
    const { near, far } = columnNames[`${left.listKey}.${left.path}`];
    printArrow({ left });
    if (mongo) {
      if (false) {
        console.log(
          `    * Create a collection ${f(tableName)} with fields ${c(near)} and ${c(far)}`
        );
        console.log(`    * Move the data from ${g(left)} into ${f(tableName)}`);
        console.log(`    * Delete ${g(left)}`);
      } else {
        const { _pluralize } = keystone.adapters.MongooseAdapter.mongoose;
        console.log(
          `    * db.createCollection(${f(tableName)}) with fields ${c(near)} and ${c(far)}`
        );
        console.log(`    * FIXME ${g(left)} into ${f(tableName)}`);
        console.log(
          `    * db.${_pluralize(left.listKey)}.updateMany({}, { $unset: { "${left.path}": 1 } })`
        );
      }
    } else {
      if (true) {
        console.log(`    * Rename table ${c(`${left.listKey}_${left.path}`)} to ${c(tableName)}`);
        console.log(`    * Rename column ${c(`${left.listKey}_id`)} to ${c(near)}`);
        console.log(`    * Rename column ${c(`${left.refListKey}_id`)} to ${c(far)}`);
      } else {
        console.log(`    * FIXME table ${c(`${left.listKey}_${left.path}`)} to ${c(tableName)}`);
        console.log(`    * FIXME column ${c(`${left.listKey}_id`)} to ${c(near)}`);
        console.log(`    * FIXME column ${c(`${left.refListKey}_id`)} to ${c(far)}`);
      }
    }
  });
  console.log(chalk.bold('Two-sided: one to one'));
  two_one_to_one.forEach(({ left, right }) => {
    printArrow({ left, right });
    if (mongo) {
      console.log(`    * Delete ${g(right)}`);
    } else {
      console.log(`    * Delete column ${c(`${right.listKey}.${right.path}`)}`);
    }
  });
  console.log(chalk.bold('Two-sided: one to many'));
  two_one_to_many.forEach(({ left, right, tableName }) => {
    const dropper = left.listKey === tableName ? right : left;
    printArrow({ left, right });
    if (mongo) {
      console.log(`    * Remove ${g(dropper)}`);
    } else {
      console.log(`    * Drop table ${c(`${dropper.listKey}_${dropper.path}`)}`);
    }
  });
  console.log(chalk.bold('Two-sided: many to many'));
  two_many_to_many.forEach(({ left, right, tableName, columnNames }) => {
    const { near, far } = columnNames[`${left.listKey}.${left.path}`];
    printArrow({ left, right });
    if (mongo) {
      console.log(`    * Create a collection ${f(tableName)} with fields ${c(near)} and ${c(far)}`);
      console.log(`    * Move the data from ${g(left)} into ${f(tableName)}`);
      console.log(`    * Delete ${g(left)}`);
      console.log(`    * Delete ${g(right)}`);
    } else {
      console.log(`    * Drop table ${c(`${right.listKey}_${right.path}`)}`);
      console.log(`    * Rename table ${c(`${left.listKey}_${left.path}`)} to ${c(tableName)}`);
      console.log(`    * Rename column ${c(`${left.listKey}_id`)} to ${c(near)}`);
      console.log(`    * Rename column ${c(`${left.refListKey}_id`)} to ${c(far)}`);
    }
  });
};

const simpleSummary = ({
  one_one_to_many,
  one_many_to_many,
  two_one_to_one,
  two_one_to_many,
  two_many_to_many,
}) => {
  console.log(chalk.bold('One-sided: one to many'));
  one_one_to_many.forEach(({ left }) => {
    printArrow({ left });
  });

  console.log(chalk.bold('One-sided: many to many'));
  one_many_to_many.forEach(({ left }) => {
    printArrow({ left });
  });
  console.log(chalk.bold('Two-sided: one to one'));
  two_one_to_one.forEach(({ left, right }) => {
    printArrow({ left, right });
  });
  console.log(chalk.bold('Two-sided: one to many'));
  two_one_to_many.forEach(({ left, right }) => {
    printArrow({ left, right });
  });
  console.log(chalk.bold('Two-sided: many to many'));
  two_many_to_many.forEach(({ left, right }) => {
    printArrow({ left, right });
  });
};

const upgradeRelationships = async (args, entryFile) => {
  // Allow the spinner time to flush its output to the console.
  await new Promise(resolve => setTimeout(resolve, 100));
  const { keystone } = require(path.resolve(entryFile));

  const rels = keystone._consolidateRelationships();

  const one_one_to_many = rels.filter(({ right, cardinality }) => !right && cardinality !== 'N:N');
  const one_many_to_many = rels.filter(({ right, cardinality }) => !right && cardinality === 'N:N');

  const two_one_to_one = rels.filter(({ right, cardinality }) => right && cardinality === '1:1');
  const two_one_to_many = rels.filter(
    ({ right, cardinality }) => right && (cardinality === '1:N' || cardinality === 'N:1')
  );
  const two_many_to_many = rels.filter(({ right, cardinality }) => right && cardinality === 'N:N');

  if (args.simple) {
    simpleSummary({
      one_one_to_many,
      one_many_to_many,
      two_one_to_one,
      two_one_to_many,
      two_many_to_many,
    });
  }
  strategySummary(
    {
      one_one_to_many,
      one_many_to_many,
      two_one_to_one,
      two_one_to_many,
      two_many_to_many,
    },
    keystone
  );

  process.exit(0);
};

module.exports = {
  // prettier-ignore
  spec: {
    '--entry':      String,
  },
  help: ({ exeName }) => `
    Usage
      $ ${exeName} upgrade-relationships

    Options
      --entry       Entry file exporting keystone instance [${DEFAULT_ENTRY}]
  `,
  exec: async (args, { exeName, _cwd = process.cwd() } = {}, spinner) => {
    spinner.text = 'Validating project entry file';
    const entryFile = await getEntryFileFullPath(args, { exeName, _cwd });
    spinner.start(' ');
    return upgradeRelationships(args, entryFile);
  },
};
