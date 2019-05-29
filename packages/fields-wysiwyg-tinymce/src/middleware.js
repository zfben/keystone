const express = require('express');

module.exports = () => {
  const tinymce = require.resolve('tinymce');
  const tinymcePath = tinymce.substr(0, tinymce.lastIndexOf('/'));
  const app = express();
  app.use('/tinymce-assets', express.static(tinymcePath));
  return app;
};
