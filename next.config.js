// DOCS: https://github.com/zeit/next-plugins/tree/master/packages/next-typescript

const withTypescript = require("@zeit/next-typescript");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = withTypescript({
  webpack(config, options) {
    return config;
  }
});
