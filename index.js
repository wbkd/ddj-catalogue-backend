#!/usr/bin/env node

var Hapi = require('hapi');
var mongoose = require('mongoose');
var path = require('path');

var routes = require('./src/routes');
var config = require('./src/config');

var server = new Hapi.Server(config.host, config.port, { 
	cors: config.cors,
	files: {
	    // path for serving static files
	    relativeTo: config.filesPath
	},
  debug: false //config.debug
});

mongoose.connect(config.db);
server.route(routes);

server.start(function () {
    console.log('DDJ-Katalog API running at:', server.info.uri);
});