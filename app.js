var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var mongoose = require('mongoose');
var morgan = require("morgan");
var cors = require("cors");
var register = require("./http/routes/register");
var auth =  require("./http/routes/auth");
var dashboard =  require("./http/routes/dashboard");


//mongoose.connect('mongodb://localhost/loginapp');
mongoose.connect('mongodb://heroku_m6zrfwx3:i8ts5lctrrbtk107usvj3jl7ko@ds053708.mlab.com:53708/heroku_m6zrfwx3');
// var db = mongoose.connection;


// Init App
const app = express();

// View Engine
app.set("view engine", "pug");

//log request
app.use(morgan("combined"));

//set Cross-origin resource sharing
app.use(cors());

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.use("", auth);
app.use("/login", auth);
app.use("/register", register);
app.use("/dashboard", dashboard);
// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function() {
	console.log('Server started on port '+ app.get('port'));
});

module.exports = app;