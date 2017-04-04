var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io')(server)
  , BasicStrategy = require('passport-http').BasicStrategy
  , mongoose = require ("mongoose")
  , basicAuth = require('basic-auth-connect')
  , multer  =   require('multer')
  , bodyParser = require('body-parser')
  , async = require('async');

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
      type: String,
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

          notify(user.type, user.excellence, user.category);
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

//Socket.io emits this event when a connection is made.
io.sockets.on('connection', function (socket) {

        
    socket.on('get-college-etab-women', function (user) {
      emitCollegeEtabWomen();
    });
    
    socket.on('get-college-etab-men', function (user) {
      emitCollegeEtabMen();
    });
        
    socket.on('get-college-excel-women', function (user) {
      emitCollegeExcelWomen();
    });
    
    socket.on('get-college-excel-men', function (user) {
      emitCollegeExcelMen();
    });
        
    socket.on('get-lycee-etab-women', function (user) {
      emitLyceeEtabWomen();
    });
    
    socket.on('get-lycee-etab-men', function (user) {
      emitLyceeEtabMen();
    });
        
    socket.on('get-lycee-excel-women', function (user) {
      emitLyceeExcelWomen();
    });
    
    socket.on('get-lycee-excel-men', function (user) {
      emitLyceeExcelMen();
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
        var excellence = user[8] === 'Oui';
        var category = user[3].indexOf('F') > -1 ? 'F' : 'M';
        var userObj = {
          licence: user[0],
          name: {
            last: user[1],
            first: user[2]
          },
          category: category,
          type: user[4],
          club: user[5]+ ' ' + user[7],
          city: user[6],
          team: user[7],
          excellence: excellence,
          time: null
        }
        console.log(userObj);
        new User (userObj).save(function (err) {if (err) console.log ('Error on save!' + err)});
      });
    });
  });
};


function emitCollegeEtabWomen() {

  User.find({time: { $ne: null }, type: 'COL', category: 'F', excellence: false}).sort({time : 'asc'}).exec(function(err, result) {
    if (!err) {
      console.log(result.length + ' CollegeEtabWomen users found');
      io.sockets.emit('college-etab-women', result);      
    }
  });
}

function emitCollegeEtabMen() {

  User.find({time: { $ne: null }, type: 'COL', category: 'M', excellence: false}).sort({time : 'asc'}).exec(function(err, result) {
    if (!err) {
      console.log(result.length + ' CollegeEtabMen users found');
      io.sockets.emit('college-etab-men', result);      
    }
  });
}


function emitCollegeExcelWomen() {

  User.find({time: { $ne: null }, type: 'COL', category: 'F', excellence: true}).sort({time : 'asc'}).exec(function(err, result) {
    if (!err) {
      console.log(result.length + ' CollegeExcelWomen users found');
      io.sockets.emit('college-excel-women', result);      
    }
  });
}

function emitCollegeExcelMen() {

  User.find({time: { $ne: null }, type: 'COL', category: 'M', excellence: true}).sort({time : 'asc'}).exec(function(err, result) {
    if (!err) {
      console.log(result.length + ' CollegeExcelMen users found');
      io.sockets.emit('college-excel-men', result);      
    }
  });
}


function emitLyceeEtabWomen() {

  User.find({time: { $ne: null }, type: 'LYC', category: 'F', excellence: false}).sort({time : 'asc'}).exec(function(err, result) {
    if (!err) {
      console.log(result.length + ' LyceeEtabWomen users found');
      io.sockets.emit('lycee-etab-women', result);      
    }
  });
}

function emitLyceeEtabMen() {

  User.find({time: { $ne: null }, type: 'LYC', category: 'M', excellence: false}).sort({time : 'asc'}).exec(function(err, result) {
    if (!err) {
      console.log(result.length + ' LyceeEtabMen users found');
      io.sockets.emit('lycee-etab-men', result);      
    }
  });
}


function emitLyceeExcelWomen() {

  User.find({time: { $ne: null }, type: 'LYC', category: 'F', excellence: true}).sort({time : 'asc'}).exec(function(err, result) {
    if (!err) {
      console.log(result.length + ' LyceeExcelWomen users found');
      io.sockets.emit('lycee-excel-women', result);      
    }
  });
}

function emitLyceeExcelMen() {

  User.find({time: { $ne: null }, type: 'LYC', category: 'M', excellence: true}).sort({time : 'asc'}).exec(function(err, result) {
    if (!err) {
      console.log(result.length + ' LyceeExcelMen users found');
      io.sockets.emit('lycee-excel-men', result);      
    }
  });
}

function emitMixed() {

  User.find({time: { $ne: null }, type: 'LYC', category: 'M', excellence: true}).sort({time : 'asc'}).exec(function(err, result) {
    if (!err) {
      console.log(result.length + ' LyceeExcelMen users found');
      io.sockets.emit('lycee-excel-men', result);      
    }
  });
}

function emitAll() {
  var data = {};
  User.find({time: { $ne: null }, type: 'COL', category: 'F', excellence: false}).sort({time : 'asc'}).limit(3).exec(function(err, result) {
    if (!err) {
      data['college-etab-women'] = result;
      User.find({time: { $ne: null }, type: 'COL', category: 'M', excellence: false}).sort({time : 'asc'}).limit(3).exec(function(err, result) {
        if (!err) {
          data['college-etab-men'] = result;
          User.find({time: { $ne: null }, type: 'COL', category: 'F', excellence: true}).sort({time : 'asc'}).limit(3).exec(function(err, result) {
            if (!err) {
              data['college-excel-women'] = result;   
              User.find({time: { $ne: null }, type: 'COL', category: 'M', excellence: true}).sort({time : 'asc'}).limit(3).exec(function(err, result) {
                if (!err) {
                  data['college-excel-men'] = result;  
                  User.find({time: { $ne: null }, type: 'LYC', category: 'F', excellence: false}).sort({time : 'asc'}).limit(3).exec(function(err, result) {
                    if (!err) {
                      data['lycee-etab-women'] = result;
                      User.find({time: { $ne: null }, type: 'LYC', category: 'M', excellence: false}).sort({time : 'asc'}).limit(3).exec(function(err, result) {
                        if (!err) {
                          data['lycee-etab-men'] = result;
                          User.find({time: { $ne: null }, type: 'LYC', category: 'F', excellence: true}).sort({time : 'asc'}).limit(3).exec(function(err, result) {
                            if (!err) {
                              data['lycee-excel-women'] = result;   
                              User.find({time: { $ne: null }, type: 'LYC', category: 'M', excellence: true}).sort({time : 'asc'}).limit(3).exec(function(err, result) {
                                if (!err) {
                                  data['lycee-excel-men'] = result;  
                                  io.sockets.emit('all', data);  
                                }
                              });  
                            }
                          });       
                        }
                      });   
                    }
                  });  
                }
              });  
            }
          });       
        }
      });   
    }
  }); 
}  

function emitExplosion() {
  console.log('explosion emited');
  //io.sockets.emit('explosion', null);    
}

function updateAllScores(type, excellence, category) {
  console.log('updateAllScores')
  User.find({time: { $ne: null }, type: type, category: category, excellence: excellence}).sort({time : 'asc'}).exec(function(err, users) {
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
              notify(type, excellence, category);
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

function notify(type, excellence, category) {
    console.log('notified')
    emitAll();
    switch (type){
      case 'COL': 
        if(category === 'F') {
          if(excellence) {
            emitCollegeExcelWomen();
          } else {
            emitCollegeEtabWomen();
          }
        } else {
          if(excellence) {
            emitCollegeExcelMen();
          } else {
            emitCollegeEtabMen();
          }
        }
        break;
      case 'LYC': 
        if(category === 'F') {
          if(excellence) {
            emitLyceeExcelWomen();
          } else {
            emitLyceeEtabWomen();
          }
        } else {
          if(excellence) {
            emitLyceeExcelMen();
          } else {
            emitLyceeEtabMen();
          }
        }
        break;
    }
}