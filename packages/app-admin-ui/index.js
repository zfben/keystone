const path = require('path');
const { createSessionMiddleware } = require('@keystone-alpha/session');

class AdminUIApp {
  constructor({
    adminPath = '/admin',
    apiPath = '/admin/api',
    graphiqlPath = '/admin/graphiql',
    authStrategy,
    pages,
    enableDefaultRoute = false,
  } = {}) {
    if (adminPath === '/') {
      throw new Error("Admin path cannot be the root path. Try; '/admin'");
    }

    if (authStrategy && authStrategy.authType !== 'password') {
      throw new Error('Keystone 5 Admin currently only supports the `PasswordAuthStrategy`');
    }

    this.adminPath = adminPath;
    this.authStrategy = authStrategy;
    this.pages = pages;
    this.apiPath = apiPath;
    this.graphiqlPath = graphiqlPath;
    this.enableDefaultRoute = enableDefaultRoute;

    this.routes = {
      signinPath: `${this.adminPath}/signin`,
      signoutPath: `${this.adminPath}/signout`,
      sessionPath: `${this.adminPath}/session`,
    };

    this.targets = {
      server: {
        build: path.join(__dirname, 'build.js'),
        prepare: {
          development: path.join(__dirname, 'middleware-dev.js'),
          production: path.join(__dirname, 'middleware-prod.js'),
        }
      },
      serverless: {
        build: path.join(__dirname, 'build.js'),
        prepare: {
          development: path.join(__dirname, 'middleware-dev.js'),
          production: path.join(__dirname, 'middleware-prod.js'),
        }
      }
    };
  }

  getAdminMeta() {
    return {
      adminPath: this.adminPath,
      authList: this.authStrategy ? this.authStrategy.listKey : null,
      pages: this.pages,
      ...this.routes,
      withAuth: !!this.authStrategy,
    };
  }

  createSessionMiddleware() {
    const { signinPath, signoutPath, sessionPath } = this.routes;
    // This session allows the user to authenticate as part of the 'admin' audience.
    // This isn't used by anything just yet. In the near future we will set up the admin-ui
    // application and api to be non-public.
    const audiences = ['admin'];
    return createSessionMiddleware(
      { signinPath, signoutPath, sessionPath, successPath: this.adminPath },
      this.authStrategy,
      audiences
    );
  }

  getAdminUIMeta(keystone) {
    const { adminPath } = this;

    return {
      adminPath,
      apiPath: this.apiPath,
      graphiqlPath: this.graphiqlPath,
      ...this.getAdminMeta(),
      ...keystone.getAdminMeta(),
    };
  }
}

module.exports = {
  AdminUIApp,
};
