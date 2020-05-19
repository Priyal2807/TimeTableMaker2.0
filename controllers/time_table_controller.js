var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({
  extended: false
});
var ejs = require('ejs');
var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt');
mongoose.connect('mongodb://localhost/time-table-part2', function(err) {
  if (err) throw err;
  console.log("Successfully connected");
});

var timeTableschema = new mongoose.Schema({
  sid: {
    type: Number,
    unique: true
  },
  start: String,
  end: String,
  desc: String
});
var UserSchema = new mongoose.Schema({
  Email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  userName: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  Userpass: {
    type: String,
    required: true
  }
});

//used for authentication
UserSchema.statics.authenticate = function(em, pass, callback) {
  User.findOne({
      Email: em
    })
    .exec(function(err, user) {
      if (err)
        return callback(err)
      else if (!user) {
        var err = new Error('User not found');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(pass, user.Userpass, function(err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      });
    });
}
//used for hashing and salting the password
UserSchema.pre('save', function(next) {
  var user = this;
  bcrypt.hash(user.Userpass, 10, function(err, hash) {
    if (err) return next(err);

    console.log("pre save function");
    user.Userpass = hash;
    next();
  })
});
var time2 = mongoose.model('time2', timeTableschema);
var User = mongoose.model('User', UserSchema);
// var timet = time2({
//   sid: 1,
//   start: "11:00",
//   end: "12:00",
//   desc: "Nothing much"
// }).save(function(err) {
//   if (err) throw err;
//   console.log("Item saved Successfully");
// });

module.exports = function(app) {
  app.get('/', (req, res) => {
    res.render('home');
  });
  app.get('/makeit', urlencodedParser, (req, res, next) => {
    User.findById(req.session.userId)
      .exec(function(error, user) {
        if (error)
          return next(error);
        else {
          if (user == null) {
            var err = new Error('Not authorized! Go back!');
            err.status = 400;
            return next(err);
          } else {
            res.render('makePage');
          }
        }
      });
  });
  app.get('/userReg', (req, res) => {
    res.render('userReg');
  });
  app.post('/userReg', urlencodedParser, (req, res, next) => {
    console.log(req.body);
    if (req.body.Userpass !== req.body.passwordConf) {
      var err = new Error('passwords do not match');
      err.status = 400;
      res.send("passwords do not match");
      return next(err);
    }
    if (req.body.Email && req.body.userName && req.body.Userpass && req.body.passwordConf) {
      var userData = User({
        Email: req.body.Email,
        userName: req.body.userName,
        Userpass: req.body.Userpass
      }).save(function(err, data) {
        if (err) throw err;
      });
      console.log('details saved');
      res.redirect('/');
    } else {
      var err = new Error('All fields required');
      err.status = 400;
      return next(err);
    }
  });
  app.post('/login', urlencodedParser, (req, res, next) => {
    if (req.body.logemail && req.body.logPassword) {
      User.authenticate(req.body.logemail, req.body.logPassword, function(error, user) {
        if (error || !user) {
          var err = new Error('Wrong email or password');
          err.status = 401;
          return next(err);
        } else {
          req.session.userId = user._id;
          return res.redirect('/makeit');
        }
      });
    } else {
      var err = new Error('All fields required');
      err.status = 400;
      return next(err);
    }
  });
  app.post('/makeit', urlencodedParser, (req, res) => {
    var newEntyr = time2(req.body).save(function(err, data) {
      if (err) throw err;
      //res.json(data);
    });
    res.redirect('/makeit');
  });
  app.get('/login', urlencodedParser, (req, res) => {
    res.render('login');
  });
  app.get('/logout', function(req, res, next) {
    if (req.session) {
      req.session.destroy(function(err) {
        if (err) return next(err);
        else {
          return res.redirect('/');
        }
      });
    }
  });

  app.get('/finalTimeTable', urlencodedParser, (req, res, next) => {
    User.findById(req.session.userId)
      .exec(function(error, user) {
        if (error)
          return next(error);
        else {
          if (user == null) {
            var err = new Error('Not authorized! Go back!');
            err.status = 400;
            return next(err);
          } else {
            time2.find({}, function(err, data) {
              if (err) throw err;
              res.render('timeTable', {
                details: data
              });
            });
          }
        }
      });
  });
};