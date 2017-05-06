// load the default config generator.
var genDefaultConfig = require('@kadira/storybook/dist/server/config/defaults/webpack.config.js');

module.exports = function (config, env) {
    var config = genDefaultConfig(config, env);

    config.module.loaders.push({
        test: /\.tsx$/,
        loader: 'ts-loader'
    })
    config.module.loaders.push({
        test: /\.ts$/,
        loader: 'ts-loader'
    })
    config.resolve.extensions.push(".tsx");
    config.resolve.extensions.push(".ts");

    return config;
};
