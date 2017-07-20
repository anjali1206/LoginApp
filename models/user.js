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

//define & export createUser function for new user
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

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

//getUserById
module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	// Load hash from your password DB. 
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}



