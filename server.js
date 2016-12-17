#!/usr/bin/env node

var db_users = [
  {
    id:1,
    firstName: 'Jean',
    lastName: 'Dupond',
    club: 'Collège de Paris',
    bestTime: '01:22:05',
  },
  {
    id:2,
    firstName: 'Raphaël',
    lastName: 'Courivaud',
    club: 'Collège Emiles Combes',
    bestTime: '02:19:35',
  },
  {
    id:3,
    firstName: 'Pimette',
    lastName: 'La Coquette',
    club: 'Collège Emiles Combes',
    bestTime: '01:10:22',
  }
];


/* Express 3 requires that you instantiate a `http.Server` to attach socket.io to first */
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    port = process.env.PORT || 8887,
    url  = 'http://localhost:' + port + '/';

server.listen(port);
console.log("Express server listening on port " + port);
console.log(url);

app.use('/static', express.static(__dirname + '/static'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

//Socket.io emits this event when a connection is made.
io.sockets.on('connection', function (socket) {

    io.sockets.emit('users', db_users);
    
    socket.on('add-user', function (user) {
      db_users.push(user);
      io.sockets.emit('users', db_users);
    });  
});