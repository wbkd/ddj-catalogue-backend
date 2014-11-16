var Project = require('../models/project.js');
var merge = require('merge');

var defaultQueryOptions = {
  filters : {},
  sortby: {
    date : -1
  }, 
  items : 25, 
  offset : 0
};

module.exports.getAll = function(req, reply) {
  Project.find(function(err, projects) {
    if (err) throw err;

    reply(projects);
  });
};

module.exports.getById = function(req, reply) {

  var projectId = req.params.id;

  Project.find({_id: projectId},function(err, projects) {
    if (err) throw err;

    reply(projects);
  });
};

module.exports.query = function(req, reply) {

  
  var payload = !Object.keys(req.payload).length ? {} : JSON.parse(req.payload),
    options = merge(defaultQueryOptions,payload),
    skip = options.offset * options.items;

  Project
    .find(options.filters)
    .skip(skip)
    .limit(options.items)
    .sort(options.sortby)
    .exec(function(err,projects){
      if (err) throw err;

      reply(projects);
    });

};