const path = require("path");

module.exports = function override(config) {
    config.resolve.alias["react"] = path.resolve('./node_modules/react');
    config.resolve.alias["react-dom"] = path.resolve('./node_modules/react-dom');
    config.resolve.alias["@emotion/react"] = path.resolve('./node_modules/@emotion/react');
    config.resolve.alias["@mui/material"] = path.resolve('./node_modules/@mui/material');
    config.resolve.alias["@inseefr/lunatic"] = path.resolve('./node_modules/@inseefr/lunatic');
    //config.resolve.plugins = config.resolve.plugins.filter(plugin => !(plugin instanceof ModuleScopePlugin));
    const scopePluginIndex = config.resolve.plugins.findIndex(
        ({ constructor }) => constructor && constructor.name === "ModuleScopePlugin"
      );
    
      config.resolve.plugins.splice(scopePluginIndex, 1);
      
    return config;
}