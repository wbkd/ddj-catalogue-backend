var Project = require('../models/project.js');
var merge = require('merge');

var defaultQueryOptions = {
  filters : {},
  sortby: {
    date : -1
  }, 
  items : 1000, 
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

// we use this function to return the data for a shared favorites list
module.exports.getByIds = function(req, reply) {
 
  var projectIds = req.payload.ids;

  Project.find({_id: { $in : projectIds }},function(err, projects) {
    if (err) throw err;
    reply(projects);
  });
};

module.exports.query = function(req, reply) {
  
  var payload = !Object.keys(req.payload).length ? {} : req.payload,
    options = merge(defaultQueryOptions,payload),
    skip = options.offset * options.items;

    options.filters = options.filters ? options.filters : {};

  Project.count(options.filters)
    .exec(function(err,count){

        Project
          .find(options.filters)
          .skip(skip)
          .limit(options.items)
          .sort(options.sortby)
          .exec(function(err,projects){
            if (err) throw err;

            reply({previews: projects, count : count});
          });
    });
};