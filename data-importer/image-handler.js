var request = require('request');
var fs = require('fs');
var path = require('path');
var imagesPath = path.resolve(__dirname, '../public/images/');

module.exports.createImage = function(project,cb){

	if(typeof project.serverImageurl === 'undefined'){
		downloadImage(project,cb);
	}else{
		cb(project);
	}
}

function downloadImage(project,cb){

	var imageurl = project.imageurl,
		filename = project._id + '.jpg',
		filePath = path.resolve(imagesPath, filename);

	if(typeof imageurl === 'undefined' || !imageurl){
		// TODO : check og:image metatag ftw
		cb(project)
  		return false;
	}

	request.head(imageurl, function(err, res, body){
    	var contentType = res.headers['content-type'];
    	// TODO ?: check if content type is valid image

		request(imageurl)
			.pipe(fs.createWriteStream(filePath))
			.on('close', function(){
				project.serverImageurl = filename;
				cb(project);
			});
	});
}