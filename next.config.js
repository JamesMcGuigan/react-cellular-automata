const withLess = require("next-with-less");

module.exports = withLess({
    webpack(config, _options) {
        return config;
    }
});

