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
  res.sendFile(__dirname + '/templates/index.html');
});

app.get('/admin', function (req, res) {
  res.sendFile(__dirname + '/templates/admin.html');
});

var db_users = {
  collegeWomen: [
    {
      id:1,
      firstName: 'Marie',
      lastName: 'Moumou',
      club: 'Collège de Paris',
      bestTime: '01:22:05',
    },
    {
      id:2,
      firstName: 'Louis',
      lastName: 'Martin',
      club: 'Collège Emiles Combes',
      bestTime: '02:19:35',
    },
    {
      id:3,
      firstName: 'Bernadette',
      lastName: 'Bernard',
      club: 'Collège Emiles Combes',
      bestTime: '02:19:35',
    }
  ],
  collegeMen: [
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
      bestTime: '08:32:11',
    },
    {
      id:2,
      firstName: 'Ramon',
      lastName: 'Lopez',
      club: 'Collège Emiles Combes',
      bestTime: '02:19:35',
    },
    {
      id:2,
      firstName: 'Louis',
      lastName: 'Robin',
      club: 'Collège Emiles Combes',
      bestTime: '02:19:35',
    }
  ],
  eliteWomen: [
    {
      id:1,
      firstName: 'Camille',
      lastName: '	Mercier',
      club: 'Collège de Paris',
      bestTime: '01:22:05',
    },
    {
      id:2,
      firstName: 'Manon',
      lastName: '	Fournier',
      club: 'Collège Emiles Combes',
      bestTime: '02:19:35',
    }
  ],
  eliteMen: [
    {
      id:1,
      firstName: 'Raoul',
      lastName: 'Blanc',
      club: 'Collège de Paris',
      bestTime: '01:22:05',
    },
    {
      id:2,
      firstName: 'Daniel',
      lastName: 'Blanc',
      club: 'Collège Emiles Combes',
      bestTime: '02:19:35',
    }
  ],
  customWomen: [
    {
      id:1,
      firstName: 'Lea',
      lastName: 'Dubois',
      club: 'Collège de Paris',
      bestTime: '01:22:05',
    },
    {
      id:2,
      firstName: 'Emma',
      lastName: 'Petit',
      club: 'Collège Emiles Combes',
      bestTime: '02:19:35',
    }
  ],
  customMen: [
    {
      id:1,
      firstName: 'Michel',
      lastName: 'Richard',
      club: 'Collège de Paris',
      bestTime: '01:22:05',
    },
    {
      id:2,
      firstName: 'Roger',
      lastName: 'Moreau',
      club: 'Collège Emiles Combes',
      bestTime: '02:19:35',
    }
  ]
};

//Socket.io emits this event when a connection is made.
io.sockets.on('connection', function (socket) {

    
    socket.on('add-user', function (user) {
      db_users.push(user);
      io.sockets.emit('users', db_users);
    });  
    
    socket.on('get-college-women', function (user) {
      socket.emit('college-women', db_users.collegeWomen);
    });
    
    socket.on('get-college-men', function (user) {
      socket.emit('college-men', db_users.collegeMen);
    });
    
    socket.on('get-elite-women', function (user) {
      socket.emit('elite-women', db_users.eliteWomen);
    });
    
    socket.on('get-elite-men', function (user) {
      socket.emit('elite-men', db_users.eliteMen);
    });
    
    socket.on('get-custom-women', function (user) {
      socket.emit('custom-women', db_users.customWomen);
    });
    
    socket.on('get-custom-men', function (user) {
      socket.emit('custom-men', db_users.customMen);
    });
    
    socket.on('get-all', function (user) {
      socket.emit('all', db_users);
    }); 
});
  
io.sockets.emit('users', db_users);