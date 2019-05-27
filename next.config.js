// DOCS: https://github.com/zeit/next-plugins/tree/master/packages/next-typescript

const withTypescript = require("@zeit/next-typescript");

module.exports = withTypescript({
  target: "serverless",
  webpack(config, options) {
    return config;
  }
});
