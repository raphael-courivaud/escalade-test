var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io')(server)
  , BasicStrategy = require('passport-http').BasicStrategy
  , mongoose = require ("mongoose")
  , basicAuth = require('basic-auth-connect')
  , multer  =   require('multer');

var parse = require('csv-parse');

var auth = basicAuth('admin', 'admin');

var uploadDir = './uploads';

var storage =   multer.memoryStorage();
var upload = multer({ storage : storage}).single('usersFile');

// comment/remove this line below to disable auth
//app.use(passport.authenticate('basic', { session: false }));
app.use('/static', express.static(__dirname + '/static'));;

var port = Number(process.env.PORT || 5000);

server.listen(port, function() {
  console.log("Listening on " + port);
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/templates/index.material.html');
});

app.get('/admin', auth, function (req, res) {
  res.sendFile(__dirname + '/templates/admin.html');
});

app.get('/config', auth, function (req, res) {
  res.sendFile(__dirname + '/templates/config.html');
});

app.post("/users", function(req, res){
  upload(req,res,function(err) {
      if(err) {
          console.log(err);
          return res.end("Error uploading file.");
      }
      loadUsers(req.file.buffer.toString());
      res.end("File is uploaded");
  });
});

app.get('/admin', function (req, res) {
  res.sendFile(__dirname + '/templates/admin.html');
});

app.get('/admin', function (req, res) {
  res.sendFile(__dirname + '/templates/admin.html');
});

app.get('/admin/users', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  User.find({}).exec(function(err, result) {
    if (!err) {
      res.send(JSON.stringify(result));
    } else {
      // error handling
    };
  });
});

var uristring = process.env.MONGODB_URI || 'mongodb://localhost/escalade';

mongoose.connect(uristring, function (err, res) {
  if (err) {
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  }
});

var userSchema = new mongoose.Schema({
      name: {
        first: String,
        last: String
      },
      category: String,
      club: String,
      time: { type: Number, min: 0 }
    });
var User = mongoose.model('Users', userSchema);

var db_users = {}

//Socket.io emits this event when a connection is made.
io.sockets.on('connection', function (socket) {

    
    socket.on('add-user', function (user) {
      db_users.push(user);
      io.sockets.emit('users', db_users);
    });  
    
    socket.on('get-college-women', function (user) {
      User.find({}).exec(function(err, result) {
        if (!err) {
          socket.emit('college-women', result);
        } else {
          // error handling
        };
      });
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
      /*socket.emit('all', {
       collegeWomen: db_users.collegeWomen.slice(0, 3), 
       collegeMen: db_users.collegeMen.slice(0, 3), 
       eliteWomen: db_users.eliteWomen.slice(0, 3), 
       eliteMen: db_users.eliteMen.slice(0, 3), 
       customWomen: db_users.customWomen.slice(0, 3), 
       customMen: db_users.customMen.slice(0, 3), 
      });*/
    }); 
});

function loadUsers(data) {
  mongoose.connection.db.dropCollection('Users', function(err, result) {});
  
  parse(data, {delimiter: ','}, function(err, output){
      output.forEach(function(user) {
        var excellence = user[8] === 'Oui';
        var aUser = new User ({
          licence: user[0],
        name: {
          last: user[1],
          first: user[2]
        },
        category: user[3],
        type: user[4],
        club: user[5],
        city: user[6],
        team: user[7],
        excellence: excellence,
        time: null
        }).save(function (err) {if (err) console.log ('Error on save!' + err)});
      });
    });
};