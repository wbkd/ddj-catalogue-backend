var path = require('path');

var config = {
  development: {
    root: path.resolve(__dirname, '../'),
    port: 1337,
    host: 'localhost',
    spreadsheetkey : process.env.KEY,
    api: '/api/v1/',
    db: 'mongodb://localhost/ddjcat',
    useMailchimp: false,
    filesPath : path.resolve(__dirname, '../public')
  },
 
  production:  {
    root: path.resolve(__dirname, '../'),
    port: 1337,
    host: 'localhost',
    spreadsheetkey : process.env.KEY,
    api: '/api/v1/',
    db: 'mongodb://localhost/ddjcat',
    useMailchimp: true,
    filesPath : path.resolve(__dirname, '../../ddjcat-backend-data/public')
  }
};

// set default environment to development
var env = process.env.NODE_ENV || 'development';

// export environment specific config
module.exports = config[env];

module.exports.getConfigByEnv = function(env) {
  return config[env];
}