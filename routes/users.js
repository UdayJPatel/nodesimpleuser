'use strict';

var express 				= require('express');
var route 					= express.Router();
var users 					= require('../controllers/users');

module.exports = function(app){

	/* Get users page */
	route.get('/users',users.index);

	/* Get users login page */
	route.get('/login',users.login);
	route.get('/login/:id',users.login);

	/* sign up or Registration */
	route.get('/register',users.register);
	route.post('/register', users.registerPost);

	//finally pass the route to app
	app.use(route);
};
