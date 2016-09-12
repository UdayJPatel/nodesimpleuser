"use strict";

var express 				= require('express');
var route 					= express.Router();
var home 					= require('../controllers/home');

module.exports = function(app){

	/* Get home page */
	route.get('/',home.index);

	//finally pass the route to app
	app.use(route);
}
