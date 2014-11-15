var fs = require('fs');
var path = require('path');
var util = require('util');
var result = {
  byline : [],
  category : [],
  tags : [],
  visualform : [],
  technology : []
}


module.exports.addData = function(project){

    Object.keys(project).forEach(function(key,i){

      if(typeof result[key] !== 'undefined'){

        var value = project[key];

        if(util.isArray(value)){
          value.forEach(function(el){
            add(key,el);
          });
        }else{
          add(key,value)
        }
      }

    });

}

module.exports.writeFile = function(){

  Object.keys(result).forEach(function(key,i){
      result[key] = result[key].sort();
  });

  fs.writeFile(path.resolve(__dirname,'../public/data/ui-data.json'), JSON.stringify(result), function(err){});
}

function add(key,value){
  if(value && value.length > 0 && result[key].indexOf(value) === -1){
    result[key].push(value);
  }
}