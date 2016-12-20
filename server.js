var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io')(server)
  , passport = require('passport')
  , BasicStrategy = require('passport-http').BasicStrategy;

// Use the BasicStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.
passport.use(new BasicStrategy({},
  function(username, password, done) {
    var success = (username === 'USERNAME' && password === 'PASSWORD');
    done(null, success);
  }
));

var app = express();
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

app.use(passport.initialize());
// comment/remove this line below to disable auth
app.use(passport.authenticate('basic', { session: false }));
app.use('/static', express.static(__dirname + '/static'));;


var port = Number(process.env.PORT || 5000);

server.listen(port, function() {
  console.log("Listening on " + port);
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

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

//Socket.io emits this event when a connection is made.
io.sockets.on('connection', function (socket) {

    io.sockets.emit('users', db_users);
    
    socket.on('add-user', function (user) {
      db_users.push(user);
      io.sockets.emit('users', db_users);
    });  
});