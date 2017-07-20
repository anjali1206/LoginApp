var express = require('express');
var router = express.Router(); //setting up express router

// Get homepage - '/' is just the homepage
router.get('/',  ensureAuthenticated, function(req, res){ 
	res.render('index'); //rendering view called index
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg', 'You are not logged in.');
		res.redirect('/users/login');
	}
}

module.exports = router; //exporting the router module