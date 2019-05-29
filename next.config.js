// DOCS: https://github.com/zeit/next-plugins/tree/master/packages/next-typescript

const withTypescript = require('@zeit/next-typescript');
const withLess = require('@zeit/next-less');

module.exports = withTypescript(withLess({
  target:     'serverless',
  cssModules: false,
  webpack(config, _options) {
    return config;
  }
}));
