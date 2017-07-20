var express= require('express');
var path= require('path');
var cookieParser= require('cookie-parser');
var bodyParser= require('body-parser');
var exphbs= require('express-handlebars');
var expressValidator= require('express-validator');
var flash= require('connect-flash');
var session= require('express-session');
var passport= require('passport');
var LocalStrategy= require('passport-local').Strategy; //since I'm gonna use passport local, i'll use local strategy
var mongo= require('mongodb');
var mongoose= require('mongoose');
mongoose.connect('mongodb://localhost/loginapp'); //to connect to the mongodb and call in loginapp
var db= mongoose.connection; //db variable setting for the mongoose connection

var routes = require('./routes/index'); //route to index.html file
var users = require('./routes/users'); //route to users file.

//Init app
var app = express(); //to initialize the app

//view engine
app.set('views', path.join(__dirname, 'views')); //telling the system that, i need a folder called views to handle all views
app.engine('handlebars', exphbs({defaultLayout: 'layout'})); //set handlebars as app.engine & defaultLayout file i want to be called layout
app.set('view engine', 'handlebars');//set app.set the view engnie to handlebars

//BodyParser and cookieParser Middleware - middleware is kind of a set up or configuration for certain modules.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extented: false }));
app.use(cookieParser()); 

//to set the public folder - Set Static Folder (stuff that publicly accessible on the browser)
app.use(express.static(path.join(__dirname, 'public'))); //named it public, where files like, stylesheets, imgs, jQuery will be added.

// Middlewar for Express session
app.use(session({
	secret: 'secret', //secret can be anything but, i just kept it as secret.
	saveUninitialized: true,
	resave: true
}));

// Passport init - to use passport 
app.use(passport.initialize());
app.use(passport.session());

//Express Valdator - This is taken from the github page, https://github.com/ctavan/express-validator Go to Middleware Options
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Connect flash middleware
app.use(flash());

//Set some global variables for the flash messages
//whenever I need to create global variables or functions, use with res.locals
app.use(function (req, res, next){
	res.locals.success_msg = req.flash('success_msg'); //for success msgs
	res.locals.error_msg = req.flash('error_msg'); //for error msgs
	res.locals.error = req.flash('error'); //this one is bcoz passport sets its own flash msgs & its set it to error.
	res.locals.user = req.user || null; //if user is there, i can access user from anywhere, if not then it will be null.
  next();
});


//Middleware for the route files
app.use('/', routes);	//its gonna be mapped to the routes as we mentiond at 16th line for the index
app.use('/users', users); //this one is for users.

//Set Port
app.set('port', (process.env.PORT || 3000));

//to start the server
app.listen(app.get('port'), function(){
	console.log('Server started on port ' + app.get('port'));
});
