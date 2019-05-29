import { Text } from '@keystone-alpha/fields';
import { importView } from '@keystone-alpha/build-field-types';

export let Wysiwyg = {
  type: 'Wysiwyg',
  implementation: Text.implementation,
  views: {
    Controller: Text.views.Controller,
    Field: importView('./views/Field'),
    Filter: Text.views.Filter,
  },
  adapters: Text.adapters,
  actions: {
    prepareDevMiddleware: importView('./middleware.js'),
    prepareProdMiddleware: importView('./middleware.js'),
  },
};
