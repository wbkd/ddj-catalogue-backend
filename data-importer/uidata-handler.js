var fs = require('fs');
var _ = require('lodash');
var config = require('../src/config');

var result = {
  byline : [],
  category : [],
  visualform : [],
  publisher : []
};

module.exports.addData = function(project){
    Object.keys(project).forEach(function(key,i){
      if(!_.isUndefined(result[key])){
        var value = project[key];
        result[key] = result[key].concat(value);
      }
    });
};

module.exports.writeFile = function(){

  Object.keys(result).forEach(function(key,i){
      result[key] = result[key].sort();
      result[key] = _.uniq(result[key], true);
  });

  fs.writeFile(config.filesPath + '/data/ui-data.json', JSON.stringify(result), function(err){
    if(err)console.log(err);
  });
};