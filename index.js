#!/usr/bin/env node

var Hapi = require('hapi');
var mongoose = require('mongoose');

var routes = require('./src/routes');
var config = require('./src/config');
var server = new Hapi.Server(config.host, config.port, { cors: true });

mongoose.connect(config.db);

server.route(routes);

server.start(function () {
    console.log('DDJ-Katalog API running at:', server.info.uri);
});