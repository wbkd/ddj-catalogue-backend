#!/usr/bin/env node

var Hapi = require('hapi');
var mongoose = require('mongoose');
var path = require('path');

var routes = require('./src/routes');
var config = require('./src/config');


var server = new Hapi.Server(config.host, config.port, { 
	cors: true,
	files: {
	    // path for serving static files
	    relativeTo: path.join(config.root, 'public')
	}
});

mongoose.connect(config.db);
server.route(routes);

server.start(function () {
    console.log('DDJ-Katalog API running at:', server.info.uri);
});