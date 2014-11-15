var trim = require('trim');
// from "foo, bar, zoo" to ['foo','bar','zoo']
module.exports.stringToArray = function(str) {

  if (!str) {
    return [];
  }

  var strArray = str.indexOf(',') !== -1 ? str.split(',') : [str],
    cleanedElements = [];

  strArray.forEach(function(el) {
    var trimedEl = trim(el); 
    if(trimedEl){
      cleanedElements.push(trimedEl);
    }
  });

  return cleanedElements;
}

// convert 2.12.2014 to js date object
module.exports.formatDate = function(dirtyDate) {

  if (dirtyDate) {
    var splittedDate = dirtyDate.split('.');
  }

  return dirtyDate ? new Date(splittedDate[2], parseInt(splittedDate[1]) - 1, splittedDate[0]) : new Date();
}