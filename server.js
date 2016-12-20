var express = require('express')
  , passport = require('passport')
  , BasicStrategy = require('passport-http').BasicStrategy
  , io = require('socket.io').listen(server);

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

app.use(passport.initialize());
// comment/remove this line below to disable auth
app.use(passport.authenticate('basic', { session: false }));
app.use('/static', express.static(__dirname + '/public'));;


var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
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