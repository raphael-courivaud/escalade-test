var mongoose = require ("mongoose");

var fs = require('fs'); 
var parse = require('csv-parse');

var uristring =
    process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/escalade';

mongoose.connect(uristring, function (err, res) {
      if (err) {
      console.log ('ERROR connecting to: ' + uristring + '. ' + err);
      } else {
      console.log ('Succeeded connected to: ' + uristring);
      }
    });

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
      time: { type: Number, min: 0 }
    });

var User = mongoose.model('Users', userSchema);

var inputFile='users.csv';

var users=[];
fs.createReadStream(inputFile)
    .pipe(parse({delimiter: ','}))
    .on('data', function(csvrow) {
        //do something with csvrow
        users.push(csvrow);        
    })
    .on('end',function() {
      saveUsers();
    });
  
  function saveUsers() {
    users.forEach(function(user) {
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
      console.log(aUser);

    });
    
  }
/*

    new User ({
      name: {
        first: 'Lulu',
        last: 'Martin'
      },
      category: 'collegeWomen',
      club: 'Collège Emiles Combes',
      time: '10254',
    }).save(function (err) {if (err) console.log ('Error on save!')});

    new User ({
      name: {
        first: 'Bernadette',
        last: 'Martin'
      },
      category: 'collegeWomen',
      club: 'Collège Emiles Combes',
      time: '24004',
    }).save(function (err) {if (err) console.log ('Error on save!')});

*/