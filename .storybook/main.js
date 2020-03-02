const path = require('path');

module.exports = {
  webpackFinal: async config => {

    // add sass setting
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    });

    // add html setting
    config.module.rules.push({
      test: /\.html$/,
      loaders: ['extract-loader', 'html-loader'],
      include: path.resolve(__dirname, '../'),
    });

    return config;
  },
};
