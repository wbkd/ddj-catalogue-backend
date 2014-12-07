var config = require('../src/config');
var privateConfig = require('../src/private-config');
var argv = require('minimist')(process.argv.slice(2));
var noSocialUpdates = typeof argv.nosocial !== 'undefined';

if (typeof privateConfig.spreadsheet.id === 'undefined') {
  console.log('Error:\nPlease specify a google spreadsheet id under src/private-config.js');
  return false;
}

var Tabletop = require('tabletop');
var mongoose = require('mongoose');
mongoose.connect(config.db);
var db = mongoose.connection;
var merge = require('merge');
var async = require('async');
var winston = require('winston');
var fs = require('fs');
var path = require('path');
var childProcess = require('child_process');

// helper modules
var dataCleaner = require('./data-cleaner');
var imageHandler = require('./image-handler');
var Project = require('../src/models/project');
var uiDataWriter = require('./uidata-handler');
var socialHandler = require('./social-handler');

var isLocalMode = false;

winston.add(winston.transports.File, {
  filename: path.resolve(__dirname, '../logs/importer.log')
});

db.once('open', function callback() {
  getSpreadsheetData(updateDatabase);
});

function updateDatabase(data, tabletop) {

  var katalogData = tabletop.sheets('katalog').elements,
    faqData = tabletop.sheets('faq').elements;

  winston.info('Found %s datasets', katalogData.length);
  
  // write faq-data file
  fs.writeFile(config.filesPath + '/data/faq-data.json', JSON.stringify(faqData), function(err){
    if(err)console.log(err)
  });  

  var cleanedData = katalogData.map(cleanupData);

  // updating all cleaned data
  async.eachSeries(cleanedData, updateData, function(err) {
    handleError(err);
    uiDataWriter.writeFile();

    childProcess.exec('cd ../public/ && ./image-resizer.sh',  function (error, stdout, stderr){
      console.log(stdout);
    });

    winston.info('Successfully updated database');
    db.close();
  });
}

function updateData(currentData, callback) {

  var url = currentData.url,
    imageurl = currentData.imageurl;

  if(typeof url === 'undefined' || !url){
    return callback(null);
  }

  Project
    .findOne({
      url: url
    })
    .exec(function(err, project) {
      handleError(err);

      project = initOrMerge(project, currentData);

      imageHandler.createImage(project, function(error, project){
        
        if(noSocialUpdates){

          project.social = project.social ? project.social : { twitter : 0, facebook : 0, sum : 0 };
          saveObject(project,callback); 
          return false;
        }

        socialHandler.getCounts(project, function(err, socialData){
          project.social = socialData;
          saveObject(project,callback);  
        });

      });
      
    });
}

function saveObject(project,callback) {
  project.save(function(err, res) {
    winston.info('udpated project: ', project.url)
    handleError(err);
    callback(null);
  });
}

function initOrMerge(project, data) {

  if (!project) {
    return new Project(data);
  }
  return merge(project, data);
}

function getSpreadsheetData(cb) {

  if (isLocalMode) {
    fs.readFile(path.resolve(__dirname, 'testdata.json'), function(err, data) {
      cb(JSON.parse(data));
    });
  } else {
    Tabletop.init({
      key: privateConfig.spreadsheet.id,
      callback: cb,
      simpleSheet: false
    });
  }
}

function handleError(err) {
  if (err) {
    winston.error(err);
  }
}

function cleanupData(projectData) {

  projectData.byline = dataCleaner.stringToArray(projectData.byline);
  projectData.category = dataCleaner.stringToArray(projectData.category);
  projectData.tags = dataCleaner.stringToArray(projectData.tags);
  projectData.visualform = dataCleaner.stringToArray(projectData.visualformclean);
  projectData.technology = dataCleaner.stringToArray(projectData.technology);
  projectData.date = dataCleaner.formatDate(projectData.date);
  projectData.publisher = dataCleaner.stringToArray(projectData.publisher);
  projectData.organisation = dataCleaner.stringToArray(projectData.organisation);
  projectData.public = projectData.public ? !!parseInt(projectData.public) : true;

  uiDataWriter.addData(projectData);

  return projectData;
}


module.exports.updateDatabase = updateDatabase;