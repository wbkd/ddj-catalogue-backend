var config = require('./config');

if(typeof config.spreadsheetkey === 'undefined'){
	console.log('Error:\nPlease specify a google spreadsheet key via:\nKEY=your-key-here node src/spreadsheet-importer.js');
	return false;
}
var Tabletop = require('tabletop');
var mongoose = require('mongoose');
var Project = require('./models/project');

mongoose.connect(config.db);
var db = mongoose.connection;

db.once('open', function callback () {
  getSpreadsheetData(updateDatabase);
});

function updateDatabase(data,tabletop) {

	var cleanedData = data.map(cleanupData),
		index = 0,
		count = cleanedData.length;

	insertData();
	
	function insertData(){
		if(index >= count){
			db.close();	
			return false;
		}

		var currentData = cleanedData[index],
			url = currentData.url

		if(typeof url  === 'undefined' || !url){
			index++;
			insertData();
			return false;
		}

		Project.update({ url : url },currentData,{upsert : true},function(err,updateCount){
			index++;
			insertData();	
		});
	}
}

function getSpreadsheetData(cb) {
	Tabletop.init({
		key: config.spreadsheetkey,
		callback: cb,
		simpleSheet: true
	});
}

function cleanupData(projectData){

	projectData.byline = stringToArray(projectData.byline);
	projectData.tags = stringToArray(projectData.tags);
	projectData.visualform = stringToArray(projectData.visualform);
	projectData.date = formatDate(projectData.date);

	delete projectData.rowNumber;

	return projectData;
}

function stringToArray(str){

	if(!str){
		return [];
	}

	return str.indexOf(',') !== -1 ? str.split(',') : [str];
}

// convert 2.12.2014 to js date object
function formatDate(dirtyDate){

	if(dirtyDate){
		var splittedDate = dirtyDate.split('.');
	}

	return dirtyDate ? new Date(splittedDate[2], parseInt(splittedDate[1]) - 1,splittedDate[0]) : new Date();
}

module.exports.updateDatabase = updateDatabase;