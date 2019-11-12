const { Keystone } = require('@keystonejs/keystone');
const { MongooseAdapter } = require('@keystonejs/adapter-mongoose');
const { Text, Relationship } = require('@keystonejs/fields');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { StaticApp } = require('@keystonejs/app-static');

const keystone = new Keystone({
  name: 'Keystone To-Do List',
  adapter: new MongooseAdapter({}),
  // knexOptions: { connection: 'postgres://keystone5:k3yst0n3@localhost:5432/keystone' },
  // }),
});

keystone.createList('Todo', {
  schemaDoc: 'A list of things which need to be done',
  fields: {
    name: { type: Text, schemaDoc: 'This is the thing you need to do', isRequired: true },
    author: { type: Relationship, ref: 'User', many: false },
    reviewers: { type: Relationship, ref: 'User', many: true },
    leadAuthor: { type: Relationship, ref: 'User.leadPost', many: false },
    readers: { type: Relationship, ref: 'User.readPosts', many: true },
    publisher: { type: Relationship, ref: 'User.published', many: false },
  },
});
keystone.createList('User', {
  fields: {
    name: { type: Text },
    leadPost: { type: Relationship, ref: 'Todo.leadAuthor', many: false },
    readPosts: { type: Relationship, ref: 'Todo.readers', many: true },
    published: { type: Relationship, ref: 'Todo.publisher', many: true },
  },
});

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new StaticApp({ path: '/', src: 'public' }),
    // Setup the optional Admin UI
    new AdminUIApp({ enableDefaultRoute: true }),
  ],
};
