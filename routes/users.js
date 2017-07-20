var express = require('express');
var router = express.Router(); //setting up express router
var passport = require('passport');
var LocalStrategy =require('passport-local').Strategy;

var User = require('../models/user');


// Register route - '/register' is just the register route
router.get('/register', function(req, res){ 
	res.render('register'); //rendering view called register
});

// login route
router.get('/login', function(req, res){ 
	res.render('login'); //rendering view called login
});

///////////////////// Register user - (Create user logic) ////////////////////////////
router.post('/register', function(req, res){ 
	//declare all the variables, to store the user info.from register form.
	var name = req.body.name;
	var username = req.body.username;
	var email = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;

	//console.log(name);	//to check if its working. when enter a name on browser it will log on git bash.

	//Validations for all form fields
	req.checkBody('name', 'Name is required.').notEmpty(); //checking that the name isn't empty
	req.checkBody('email', 'Email is required.').notEmpty(); //checking that email isn't empty
	req.checkBody('email', 'Email is not valid.').isEmail(); //checking for valid email id
	req.checkBody('username', 'Username is required.').notEmpty(); //checking that username isn't empty
	req.checkBody('password', 'Password is required.').notEmpty(); //checking that password isn't empty
	req.checkBody('password2', 'Passwords do not match.').equals(req.body.password); //checking to match the password in confirm password

	var errors = req.validationErrors(); //vaidationErrors() is a function

	if(errors){
		//if there are errors, re-render the form 
		res.render('register', {
			errors: errors 	//pass along the error
		});
	} else {
		//if there are no errors, store the newUser info., create user, show success msg & redirect to login page.
		var newUser = new User({
			name: name,
			email: email,
			username: username,
			password: password
		});

		//call that create User function in the model user.js
		User.createUser(newUser, function(err, user){
			//check for the err then throw the err
			if(err) throw err;
			console.log(user);
		});

		//set a success msg //in order to show this msg, i need to add a placeholder in the template(layout file)
		req.flash('success_msg', 'You are registered and can now login.');

		//respose - redirect to login page
		res.redirect('/users/login');
	}

});

//everything's gonna come from the local strategy which will be like this. //code is taken from http://passportjs.org/docs/username-password
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, function(err, user){
    	if(err) throw err;
		if(!user){
			return done(null, false, {message: 'Invalid User'});
		}

		User.comparePassword(password, user.password, function(err, isMatch){
			if(err) throw err;
			if(isMatch){
				return done(null, user);
			} else {
				return done(null, false, {message: 'Invalid password'});
			}
		});
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

/////////////////Logic for login with authentication.////////////////////
//make sure to include variables for passport & LocalStrategy, to import them, on top of this file under router variable
router.post('/login',					//post req.to /login url -code is taken from http://passportjs.org/docs/authenticate
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login', failureFlash: true}),	//second parameter of passport.authenticate with local coz I'm using a local db
  function(req, res) {
    res.redirect('/'); //redirect user to the dashboard page
});

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You logged out.');

	res.redirect('/users/login');
});

module.exports = router; //exporting the router module

