var mongoose = require('mongoose'); //to store in db
var bcrypt = require('bcryptjs'); //to hash the password

//Set the schema for user(define the type of data)- to store all data. 

var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index: true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	}
});

//create var that can be accessed outside this file
var User = module.exports = mongoose.model('User', UserSchema); //model name =User & user schema variable = USerSchema.

//////////// createUser function for new user - define & export /////////////
module.exports.createUser = function(newUser, callback){
	//need to user bcrypt to hash the password - 
	//get the code (& change it as required) from https://www.npmjs.com/package/bcryptjs under Usage - Async
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        // Store hash in your password DB.
	        newUser.password = hash;
	        newUser.save(callback); 
	    });
	});
}

//getUserByUsername function to validate username
module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};	//query for username to match username entered for login
	User.findOne(query, callback);	//find that username query & return callback
}

//getUserById function to use in deserializeUser function in users.js
module.exports.getUserById = function(id, callback){ //it will take in id
	User.findById(id, callback); //to get user by id & callback
}

//comparePassword function to validate password
module.exports.comparePassword = function(candidatePassword, hash, callback){
	// Load hash from your password DB. 
	// grab the bcrypt code from https://www.npmjs.com/package/bcryptjs under usage - Async - To check password
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;			//if error throw error
    	callback(null, isMatch);	//callback null and isMatch
	});
}

//////////// editUser function for existing user - define & export /////////////
module.exports.editUser = function()
