var Path = require('path');

var config = {
  development: {
    port: 1337,
    host: 'localhost',
    spreadsheetkey : process.env.KEY,
    api: '/api/v1/',
    db: 'mongodb://localhost/ddjprojects'
  },
 
  production:  {
    port: 1337,
    host: 'localhost',
    spreadsheetkey : process.env.KEY,
    api: '/api/v1/',
    db: 'mongodb://localhost/ddjprojects'
  }
};

// set default environment to development
var env = process.env.NODE_ENV || 'development';

// export environment specific config
module.exports = config[env];

module.exports.getConfigByEnv = function(env) {
  return config[env];
}