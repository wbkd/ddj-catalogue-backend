var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var config = require('../src/config');

var result = {
  byline : [],
  category : [],
  tags : [],
  visualform : [],
  technology : []
}

module.exports.addData = function(project){
    Object.keys(project).forEach(function(key,i){
      if(!_.isUndefined(result[key])){
        var value = project[key];
        result[key] = result[key].concat(value);
      }
    });
}

module.exports.writeFile = function(){

  Object.keys(result).forEach(function(key,i){
      result[key] = result[key].sort();
      result[key] = _.uniq(result[key], true);
  });
  console.log(result);

  fs.writeFile(config.filesPath + '/data/ui-data.json', JSON.stringify(result), function(err){console.log(err)});
}