var Project = require('../models/project.js');

module.exports.getAll = function(req, reply) {
  Project.find(function(err, projects) {
    if (err) throw err;

    reply(projects);
  });
}

module.exports.get = function(req, reply) {
  Project.find(function(err, projects) {
    if (err) throw err;

    reply(projects);
  });
}