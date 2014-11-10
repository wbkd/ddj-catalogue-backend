var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var projectSchema = new Schema({
	publisher: String,
	url : {type: String, unique : true },
    title: String,
    byline : [String],
    visualform : String,
    category: String,
    date: Date,
    imageurl: String,
    tags: [String]
});

module.exports = mongoose.model('Project', projectSchema);