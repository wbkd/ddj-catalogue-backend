var config = require('../src/config');
var privateConfig = require('../src/private-config');

if (typeof privateConfig.spreadsheet.apikey === 'undefined') {
  console.log('Error:\nPlease specify a google spreadsheet key via:\nKEY=your-key-here node data-importer/index.js');
  return false;
}

var Tabletop = require('tabletop');
var mongoose = require('mongoose');
mongoose.connect(config.db);
var db = mongoose.connection;
var merge = require('merge');
var async = require('async');
var _ = require('lodash');
var winston = require('winston');
var fs = require('fs');
var path = require('path');

var dataCleaner = require('./data-cleaner');
var imageHandler = require('./image-handler');
var Project = require('../src/models/project');
var uiDataWriter = require('./uidata-handler');

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

  fs.writeFile(config.filesPath + '/data/faq-data.json', JSON.stringify(faqData), function(err){
    if(err)console.log(err)
  });  

  winston.info('Found %s datasets', katalogData.length);
  
  var cleanedData = katalogData.map(cleanupData);

  // updating all cleaned data
  async.eachSeries(cleanedData, updateData, function(err) {
    handleError(err);
    uiDataWriter.writeFile();

    winston.info('Successfully updated database');
    db.close();
  });
}

function updateData(currentData, callback) {

  var url = currentData.url,
    imageurl = currentData.imageurl;

  if(_.isUndefined(url) || !url){
    return callback();
  }

  Project
    .findOne({
      url: url
    })
    .exec(function(err, project) {
      handleError(err);

      project = initOrMerge(project, currentData);
      
      imageHandler.createImage(project, function(project){
        saveObject(project,callback);  
      });
      
    });
}

function saveObject(project,callback) {
  project.save(function(err, res) {
    handleError(err);
    callback();
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
      key: privateConfig.spreadsheet.apikey,
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