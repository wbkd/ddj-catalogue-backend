var request = require('request');
var cheerio = require('cheerio');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var imagesPath = path.resolve(__dirname, '../public/images/');

module.exports.createImage = function(project, cb) {

	if (_.isUndefined(project.serverImageurl)) {
		checkImageUrl(project, cb);
	} else {
		cb(project);
	}
}

function checkImageUrl(project, cb) {

	var imageurl = project.imageurl;

	if (typeof imageurl === 'undefined' || !imageurl) {
		// TODO : check og:image metatag ftw

		request(project.url, function(err, res, body) {

			if(err){
				cb(project);
				return false;
			}

			var $ = cheerio.load(body),
				fbImageurl = $('meta[property="og:image"]').attr('content');

			if(!_.isUndefined(fbImageurl)){
				project.imageurl = fbImageurl;
				downloadImage(project, cb);
			}else{
				cb(project);
			}
			
		});
	}else{
		downloadImage(project, cb);
	}




}

function downloadImage(project, cb) {
	//request.head(imageurl, function(err, res, body){
	// 	var contentType = res.headers['content-type'];
	// TODO ?: check if content type is valid image

	var filename = project._id + '.jpg',
		filePath = path.resolve(imagesPath, filename);

	console.log(project.imageurl, 'iurl')


	request(project.imageurl)
		.pipe(fs.createWriteStream(filePath))
		.on('close', function() {
			project.serverImageurl = filename;
			cb(project);
		});
	//});
}