var express = require('express');
var session = require('express-session');
var time_table_controller = require('./controllers/time_table_controller.js');
var app = express();
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false
}));
time_table_controller(app);
app.listen(5000);
console.log("You are listening to port 5000");