var config = require('../config');
var projectRoutes = require('./project-routes.js');
var submitRoutes = require('./submit-routes.js');
var staticRoutes = require('./static-routes.js');

module.exports = [].concat(projectRoutes,staticRoutes,submitRoutes);