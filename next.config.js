// DOCS: https://github.com/zeit/next-plugins/tree/master/packages/next-typescript

const withTypescript             = require("@zeit/next-typescript");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = withTypescript({
    webpack(config, options) {

        // If your IDE or code editor don't provide satisfying TypeScript support,
        // or you want to see error list in console output, you can use fork-ts-checker-webpack-plugin.
        // It will not increase compile time because it forks type checking in a separate process
        if ( options.isServer ) {  // Do not run type checking twice:
            config.plugins.push(new ForkTsCheckerWebpackPlugin());
        }

        return config;
    },
});
