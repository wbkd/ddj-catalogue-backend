var path = require('path');

var config = {
  development: {
    root: path.resolve(__dirname, '../'),
    cors : true,
    port: 1337,
    host: 'localhost',
    api: '/api/v1/',
    db: 'mongodb://localhost/ddjcat',
    useMailchimp: false,
    filesPath : path.resolve(__dirname, '../public'),
    debug : {
      request: ['received', 'error', 'handler']
    }
  },
 
  production:  {
    root: path.resolve(__dirname, '../'),
    cors : false,
    port: 1337,
    host: 'localhost',
    api: '/api/v1/',
    db: 'mongodb://localhost/ddjcat',
    useMailchimp: true,
    filesPath : path.resolve(__dirname, '../../../ddjcat-backend-data/public'),
    debug : false
  }
};

// set default environment to development
var env = process.env.NODE_ENV || 'development';

// export environment specific config
module.exports = config[env];

module.exports.getConfigByEnv = function(env) {
  return config[env];
}