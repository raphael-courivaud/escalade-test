var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io')(server)
  , BasicStrategy = require('passport-http').BasicStrategy
  , mongoose = require ("mongoose")
  , basicAuth = require('basic-auth-connect')
  , multer  =   require('multer')
  , bodyParser = require('body-parser');

var parse = require('csv-parse');
var auth = basicAuth('admin', 'Vitesse');
var uploadDir = './uploads';
var storage =   multer.memoryStorage();
var upload = multer({ storage : storage}).single('usersFile');

var nMemoPt = 100;
var configSchema = new mongoose.Schema({});
var userSchema = new mongoose.Schema({
      licence: Number,
      name: {
        first: String,
        last: String
      },
      category: String,
      club: String,
      city: String,
      team: Number,
      excellence: Boolean,
      time: { type: Number, min: 0 },
      score: { type: Number, min: 0 }
    });
var User = mongoose.model('Users', userSchema);


var uristring = process.env.MONGODB_URI || 'mongodb://localhost/escalade';

mongoose.connect(uristring, function (err, res) {
  if (err) {
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  }
});

app.use('/static', express.static(__dirname + '/static'));;
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

var port = Number(process.env.PORT || 5000);

server.listen(port, function() {
  console.log("Listening on " + port);
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/templates/index.html');
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

app.post("/admin/users/result", function(req, res){
  User.findOne({'_id' : req.body.userId }, function(err, user){
      user.time = req.body.time;
      user.save(function (err) {
        if (err) console.log ('Error on save!' + err)
        else {
          /*console.log(user + ' saved');
          User.findOne({time: { $ne: null }, type: user.type, category: user.category, excellence: user.excellence}).sort({time : 'asc'}).exec( function(err, minUser) {
              
              console.log('Min user');
              console.log(minUser);
              if(minUser.id === user.id) {
                emitExplosion();
                updateAllScores(user.type, user.excellence, user.category);
              } else {
                updateUserScore(minUser, user).then(function (){
                  notify(user.type, user.excellence, user.category);
                });
              }
          });*/

          notify(user.excellence, user.category);
        }
      });
      res.sendStatus(200)
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
    User.find({}).sort({'city' : 'asc', 'club' : 'asc', 'team' : 'asc', 'name.last' : 'asc', 'name.first' : 'asc'}).exec(function(err, result) {
      if (!err) {
        res.send(JSON.stringify(result));
      } else {
        // error handling
      };
    });
});

app.delete('/admin/users/:userId/reset', function (req, res) {
  var userId = req.params.userId;

  User.findOne({'_id' : userId }, function(err, user){
      user.time = null;
      user.save(function (err) {
        if (err) console.log ('Error on save!' + err)
        else {
          notify(user.excellence, user.category);
        }
      });
      res.sendStatus(200)
  });
});

app.delete('/admin/users/:userId', function (req, res) {
  var userId = req.params.userId;

  User.remove({'_id' : userId }, function(err, user){
      res.sendStatus(200)
  });
});

app.delete('/admin/users/reset', function (req, res) {
  User.find(function(err, users) {
    users.forEach(function(user) {
      user.time = null;
      user.save(function (err) {
        if (err) console.log ('Error on save!' + err)
        else {}
      });
    });
  })
  .then(function() {
    notify(false, 'F');
    notify(false, 'G');
    notify(true, 'F');
    notify(true, 'G');
  })
  .then(function(){
    res.sendStatus(200);
  });
});

//Socket.io emits this event when a connection is made.
io.sockets.on('connection', function (socket) {

        
    socket.on('get-etab-women', function (user) {
      emitEtabWomen();
    });
    
    socket.on('get-etab-men', function (user) {
      emitEtabMen();
    });
        
    socket.on('get-excel-women', function (user) {
      emitExcelWomen();
    });
    
    socket.on('get-excel-men', function (user) {
      emitExcelMen();
    });
            
    socket.on('get-mixed', function (user) {
      emitMixed();
    });
    
    socket.on('get-all', function (user) {
      emitAll();
    }); 
});

function loadUsers(data) {
  User.remove({}, function(err) { 
    parse(data, {delimiter: ','}, function(err, output){
      output.forEach(function(user) {
        var excellence = user[7] === 'Oui';
        var category = user[3].indexOf('F') > -1 ? 'F' : 'M';
        var userObj = {
          licence: user[0],
          name: {
            last: user[1],
            first: user[2]
          },
          category: category,
          club: user[4],
          city: user[5],
          team: user[6],
          excellence: excellence,
          time: null
        }
        console.log(userObj);
        new User (userObj).save(function (err) {if (err) console.log ('Error on save!' + err)});
      });
    });
  });
};


function emitEtabWomen() {

  User.find({time: { $ne: null }, category: 'F', excellence: false}).sort({time : 'asc'}).exec(function(err, result) {
    if (!err) {
      console.log(result.length + ' EtabWomen users found');
      io.sockets.emit('etab-women', result);      
    }
  });
}

function emitEtabMen() {

  User.find({time: { $ne: null }, category: 'M', excellence: false}).sort({time : 'asc'}).exec(function(err, result) {
    if (!err) {
      console.log(result.length + ' EtabMen users found');
      io.sockets.emit('etab-men', result);      
    }
  });
}


function emitExcelWomen() {

  User.find({time: { $ne: null }, category: 'F', excellence: true}).sort({time : 'asc'}).exec(function(err, result) {
    if (!err) {
      console.log(result.length + ' ExcelWomen users found');
      io.sockets.emit('excel-women', result);      
    }
  });
}

function emitExcelMen() {

  User.find({time: { $ne: null }, category: 'M', excellence: true}).sort({time : 'asc'}).exec(function(err, result) {
    if (!err) {
      console.log(result.length + ' ExcelMen users found');
      io.sockets.emit('excel-men', result);      
    }
  });
}

function emitAll() {
  var limit = 5;
  var data = {};
  User.find({time: { $ne: null }, category: 'F', excellence: false}).sort({time : 'asc'}).limit(limit).exec(function(err, result) {
    if (!err) {
      data['etab-women'] = result;  
    }
  })
  .then(function() {
    return User.find({time: { $ne: null }, category: 'M', excellence: false}).sort({time : 'asc'}).limit(limit).exec(function(err, result) {
      if (!err) {
        data['etab-men'] = result;
            
      }
    }); 
  })
  .then(function() {
    return User.find({time: { $ne: null }, category: 'F', excellence: true}).sort({time : 'asc'}).limit(limit).exec(function(err, result) {
      if (!err) {
        data['excel-women'] = result;             
      }
    })
  })
  .then(function() {
    return User.find({time: { $ne: null }, category: 'M', excellence: true}).sort({time : 'asc'}).limit(limit).exec(function(err, result) {
      if (!err) {
        data['excel-men'] = result;                           
      }
    })
  })
  .then(function() {
        io.sockets.emit('all', data); 
  }); 
}  


function emitExplosion() {
  console.log('explosion emited');
  //io.sockets.emit('explosion', null);    
}

function updateAllScores(excellence, category) {
  console.log('updateAllScores')
  User.find({time: { $ne: null }, category: category, excellence: excellence}).sort({time : 'asc'}).exec(function(err, users) {
    if (!err) {          
      if(users.length === 0) {
          return;
      };
      var minUser = users[0]; 
      minUser.score = nMemoPt;
      console.log('best saving')
      console.log('users : ')
      console.log(users)
      minUser.save().then(function() {
        async.eachLimit(users.slice(1, users.length), 10, function(user) {
          updateUserScore(minUser, user);
        }, function(err) {

            console.log('test 2')
            if (!err) {
              notify(excellence, category);
            }
        });
      });         
    }
  });   
}

function updateUserScore(minUser, user) {
  var diff  = ((user.time - minUser.time) * 100) / minUser.time;
  if(diff >= 0 && diff  <= 125) {
      user.score = (nMemoPt - ((diff * nMemoPt)/100)).toFixed(2);
  } else if(diff > 125 && diff  <= 150) {
      user.score = (nMemoPt/10).toFixed(2);                  
  } else if(diff > 150) {
      user.score = (nMemoPt/20).toFixed(2); 
  }
  return user.save();
}

function notify(excellence, category) {
    console.log('notified')
    emitAll();
    if(category === 'F') {
      if(excellence) {
        emitExcelWomen();
      } else {
        emitEtabWomen();
      }
    } else {
      if(excellence) {
        emitExcelMen();
      } else {
        emitEtabMen();
      }
    }        
}