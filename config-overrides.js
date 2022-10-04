const path = require("path");



module.exports = function override(config, env) {
    config.resolve.alias["react"] = path.resolve('./node_modules/react');
    config.resolve.alias["react-dom"] = path.resolve('./node_modules/react-dom');

    config.optimization = {
        minimize: false,
        splitChunks: {
            chunks: 'all',
            name: true
        },
        runtimeChunk: true
    };

    console.log(config);
    return config;
}