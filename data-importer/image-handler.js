var request = require('request');
var cheerio = require('cheerio');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var config = require('../src/config');
var imagesPath = config.filesPath + '/raw_images';
var urlPattern = new RegExp(/^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\!\w \.-]*)*\/?$/);
var httpPattern = new RegExp(/^(https?:\/\/)/);

var headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2225.0 Safari/537.36' };

module.exports.createImage = function(project, cb) {

	// only download image if there if we dont have one
	if (_.isUndefined(project.serverImageurl)) {
		checkImageUrl(project, cb);
	} else {
		cb(null,project);
	}
}

function checkImageUrl(project, cb) {

	var imageurl = project.imageurl;

	if (typeof imageurl === 'undefined' || !imageurl) {
		
		// TODO : check og:image metatag ftw
		request({uri : project.url, headers : headers, method: 'GET'}, function(err, res, body) {
			if(err){
				console.log('request error', err);
				return cb(null,project);
			}

			var $ = cheerio.load(body),
				fbImageurl = $('meta[property="og:image"]').attr('content') || '';

			if(httpPattern.test(fbImageurl) ){
				project.imageurl = fbImageurl;
				downloadImage(project, cb);
			}else{
				cb(null,project);
			}
			
		});
	}else{
		downloadImage(project, cb);
	}
}

function downloadImage(project, cb) {

	if(project.imageurl.indexOf('http://') < 0) {project.imageurl = project.url + project.imageurl};

	request.head(project.imageurl, function(err, res, body){

		// only download images
		var contentType = res.headers['content-type'];
		if(contentType.indexOf('image') !== 0){
			return cb(null,project);
		}

		console.log('download image', project.imageurl);
		
		var filename = project._id + '.jpg',
			filePath = path.resolve(imagesPath, filename);

		

		request({uri : project.imageurl , headers : headers, method: 'GET'})
			.on('error', function(err){
				console.log('image download error', err);
				return cb(null,project);
			})
			.pipe(fs.createWriteStream(filePath))
			.on('close', function() {
				project.serverImageurl = filename;
				cb(null,project);
			});
	});
}