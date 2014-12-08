var Project = require('../models/project.js');
var merge = require('merge');
var async = require('async');

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

  // only return public projects
  options.filters.public = true; 

  // only return count if its the first request
  if(parseInt(options.offset) === 0){
    Project.count(options.filters)
    .exec(function(err,count){
      replyProjects(err,count)
    });

    return false;
  }

  replyProjects(null,null);

  function replyProjects(err,count){
    Project
      .find(options.filters)
      .skip(skip)
      .limit(options.items)
      .sort(options.sortby)
      .exec(function(err,projects){
        if (err) throw err;
        reply({previews: projects, count : count});
      });
  }
};


/*

async.parallel([
  function(cb){distinct('publisher',options.filters,cb)},
  function(cb){distinct('byline',options.filters,cb)},
  function(cb){distinct('visualform',options.filters,cb)},
  function(cb){distinct('category',options.filters,cb)}
  ],function(err,uidata){
    replyProjects(err, count, { publisher : uidata[0], byline: uidata[1],visualform: uidata[2], category: uidata[3] });
});

function distinct(key,filter,cb){
  Project.collection.distinct(key,filter, function(err,result){
    cb(err,result);
  });
}

*/