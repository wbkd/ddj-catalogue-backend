var request = require('request');
var async = require('async');
var path = require('path');
var fs = require('fs');
var config = require('../src/config');

// logging
var winston = require('winston');

// global variables
var apis = {
  twitter: 'https://cdn.api.twitter.com/1/urls/count.json?url={{url}}',
  facebook: 'https://api.facebook.com/method/links.getStats?format=json&urls={{url}}'
};

module.exports.getCounts = function(project, cb) {

  async.parallel([
      // get twitter sharing counts
      function(callback) {
        getSocialCounts({ url: project.url, socialName: 'twitter'}, callback);
      },
      // get facebook sharing counts
      function(callback) {
        getSocialCounts({ url: project.url, socialName: 'facebook'}, callback);
      }
    ],
    // update project model in database
    function(err, results) {
      var twitter = parseInt(results[0].count),
        facebook = parseInt(results[1][0].share_count) + parseInt(results[1][0].like_count),
        socialData = { twitter : twitter, facebook : facebook, sum : twitter + facebook };
        cb(null, socialData);
    });
};

// helper method to get social counts
function getSocialCounts(params, callback) {
  var url = apis[params.socialName].replace('{{url}}', params.url)
  request(url, function(err, res, body) {
    callback(err, JSON.parse(body));
  });
}