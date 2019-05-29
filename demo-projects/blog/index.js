//imports for Keystone app core
const { Keystone, PasswordAuthStrategy } = require('@keystone-alpha/keystone');
const { MongooseAdapter } = require('@keystone-alpha/adapter-mongoose');
const { GraphQLApp } = require('@keystone-alpha/app-graphql');
const { AdminUIApp } = require('@keystone-alpha/app-admin-ui');
const { StaticApp } = require('@keystone-alpha/app-static');

const expressSession = require('express-session');
const MongoStore = require('connect-mongodb-session')(expressSession);

const { staticRoute, staticPath, distDir } = require('./config');
const { User, Post, PostCategory, Comment } = require('./schema');

const keystone = new Keystone({
  name: 'Keystone Demo Blog',
  adapter: new MongooseAdapter(),
  onConnect: async () => {
    // Initialise some data.
    // NOTE: This is only for demo purposes and should not be used in production
    const users = await keystone.lists.User.adapter.findAll();
    if (!users.length) {
      const initialData = require('./initialData');
      await keystone.createItems(initialData);
    }
  },
});

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User',
});

keystone.createList('User', User);
keystone.createList('Post', Post);
keystone.createList('PostCategory', PostCategory);
keystone.createList('Comment', Comment);

const adminApp = new AdminUIApp({
  adminPath: '/admin',
  authStrategy,
  pages: [
    //    {
    //      label: 'About this project',
    //      path: 'about',
    //      component: require.resolve('./admin/pages/about'),
    //    },
    {
      label: 'Blog',
      children: [
        { listKey: 'Post' },
        { label: 'Categories', listKey: 'PostCategory' },
        { listKey: 'Comment' },
      ],
    },
    {
      label: 'People',
      children: ['User'],
    },
  ],
});

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(
      process.env.NODE_ENV !== 'production'
        ? {}
        : { sessionStore: new MongoStore({ uri: process.env.CONNECT_TO }) }
    ),
    new StaticApp({ path: staticRoute, src: staticPath }),
    adminApp,
  ],
  distDir,
};
