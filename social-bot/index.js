var request = require('request');
var async = require('async');
var path = require('path');
var fs = require('fs');
var config = require('../src/config');

// logging
var winston = require('winston');
winston.add(winston.transports.File, {
  filename: path.resolve(__dirname, 'logs/importer.log')
});

// database
var mongoose = require('mongoose');
var Project = require('../src/models/project');
mongoose.connect(config.db);
var db = mongoose.connection;

// global variables
var apis = {
  twitter: 'https://cdn.api.twitter.com/1/urls/count.json?url={{url}}',
  facebook: 'https://api.facebook.com/method/links.getStats?format=json&urls={{url}}'
}
var index = 0;
var projects = [];

db.once('open', function callback() {
  // update all projects
  Project.find({}).exec(function(err,projectData){
    if(err){
      winston.error(err);
      return false;
    }
    projects = projectData;
    handleUrls();
  });
});

function handleUrls() {

  if (index >= projects.length) {
    db.close();
    return false;
  }

  var currentProject = projects[index++];

  async.parallel([
      // get twitter sharing counts
      function(callback) {
        getSocialCounts({ url: currentProject.url, socialName: 'twitter'}, callback);
      },
      // get facebook sharing counts
      function(callback) {
        getSocialCounts({ url: currentProject.url, socialName: 'facebook'}, callback);
      }
    ],

    // update project model in database
    function(err, results) {
      var twitter = parseInt(results[0].count),
        facebook = parseInt(results[1][0].total_count),
        updateData = { social : { twitter : twitter, facebook : facebook, sum : twitter + facebook } };

        Project.update({_id : currentProject._id},updateData).exec(function(err,updatedItems){
          console.log(currentProject.url,': twitter ',twitter,', faceboob',facebook);
          setTimeout(handleUrls, 200);  
        });
    });
}



// helper method to get social counts
function getSocialCounts(params, callback) {
  var url = apis[params.socialName].replace('{{url}}', params.url)
  request(url, function(err, res, body) {
    callback(err, JSON.parse(body));
  });
}