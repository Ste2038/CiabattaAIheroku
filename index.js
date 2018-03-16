var app = require('express')();
var basicAuth = require('express-basic-auth');
var http = require('http').Server(app);
var io = require('socket.io')(http);