let path = require('path');
let fs = require('fs-extra');
let { Keystone } = require('@keystone-alpha/keystone');
let { MongooseAdapter } = require('@keystone-alpha/adapter-mongoose');

let fieldsPath = path.resolve(__dirname, '..', '..', '..', 'packages', 'fields', 'types');

exports.sourceNodes = async ({ actions: { createNode }, createNodeId, createContentDigest }) => {
  let types = [
    'Text',
    'Password',
    'DateTime',
    'Float',
    'Integer',
    'Color',
    'CalendarDay',
    'Checkbox',
  ]
    .map(fieldType => path.resolve(fieldsPath, fieldType))
    .filter(filepath => fs.statSync(filepath).isDirectory())
    .map(require);

  for (let type of types) {
    let keystone = new Keystone({ name: 'Keystone App', adapter: new MongooseAdapter() });
    keystone.createList('ListName', {
      fields: {
        field: { type },
      },
    });
    let schema = `
    scalar Upload
    ${keystone.getTypeDefs({ skipAccessControl: true }).join('\n')}
  `;

    let data = { schema, type: type.type };
    let content = JSON.stringify(data);
    let nodeMeta = {
      id: createNodeId(`keystone-field-type-${type.type}`),
      parent: null,
      children: [],
      internal: {
        type: `FieldType`,
        mediaType: `application/json`,
        content: content,
        contentDigest: createContentDigest(data),
      },
    };
    createNode({ ...nodeMeta, ...data });
  }
};
