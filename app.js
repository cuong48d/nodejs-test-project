var express  	 = require('express');
var app      	 = express();
var port 		 = process.env.PORT||8080 ;
var mongoose  	 = require('mongoose');
var passport 	 = require('passport');
var flash    	 = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var path 		 = require('path');
var configDB 	 = require('./config/database');
mongoose.connect(configDB.url);

require('./config/passport')(passport); // pass passport for configuration
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // get information from html forms
// app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating
// required for passport
app.use(session({ secret: 'woimi', resave: true, saveUninitialized: true })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./front/index.js')(app, passport); // load our routes and pass in our app and fully configured passport
var apis = require('./api/index');
var cms = require('./front/cms');
app.use('/api', apis);
app.use('/cms', cms);
// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);