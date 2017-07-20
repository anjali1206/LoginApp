var express = require('express');
var router = express.Router(); //setting up express router

// Get homepage - '/' is just the homepage 
//to use ensureAuthenticated function in a row, added it as a second perameter in router.get 
router.get('/',  ensureAuthenticated, function(req, res){ 
	res.render('index'); //rendering view called index
});

//ensureAuthenticated function to check if user is logged in then only allow them to go to dashboard else show err msg & redirec to login page.
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){ //if user req. is authenticated, then allow to keep going.
		return next();
	} else {	//else show err msg & redirect to login page.
		//req.flash('error_msg', 'You are not logged in.');	//this msg is showing all the time on browser. so commented it.
		res.redirect('/users/login');
	}
}

module.exports = router; //exporting the router module