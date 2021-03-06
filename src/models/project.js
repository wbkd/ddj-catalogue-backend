var mongoose = require('mongoose');
var util = require('util');
var shortId = require('shortid');
var Schema = mongoose.Schema;

var projectSchema = new Schema({
  _id: {
      type: String,
      unique: true,
      'default': shortId.generate
  },
  date: Date,
  publisher: [String],
  organisation: [String],
  url: {
    type: String,
    unique: true
  },
  title: String,
  description : String,
  byline: [String],
  visualform: [String],
  category: [String],
  imageurl: String,
  serverImageurl: String,
  tags: [String],
  technology : [String],
  availability : [String],
  public : {
    type : Boolean,
    'default' : true
  },
  social : {
    facebook : Number,
    twitter : Number,
    sum : Number
  }
});

module.exports = mongoose.model('Project', projectSchema);