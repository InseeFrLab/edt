const path = require("path");



module.exports = function override(config, env) {
    config.resolve.alias["react"] = path.resolve('./node_modules/react');
    config.resolve.alias["react-dom"] = path.resolve('./node_modules/react-dom');
    config.resolve.alias["@emotion/react"] = path.resolve('./node_modules/@emotion/react');
    config.resolve.alias["@mui/material"] = path.resolve('./node_modules/@mui/material');
    config.resolve.alias["@inseefr/lunatic"] = path.resolve('./node_modules/@inseefr/lunatic');
    return config;
}