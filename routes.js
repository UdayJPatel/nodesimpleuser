// var express 				= require('express');
// var route 					= express.Router();
// var home 					= require('./controllers/home');
// var users 					= require('./controllers/users');

// module.exports = function(app){

// 	/* Get home page */
// 	route.get('/',home.index);

// 	/* Get users page */
// 	route.get('/users',users.index);

// 	/* Get users login page */
// 	route.get('/login',users.login);
// 	route.get('/login/:id',users.login);

// 	/* sign up or Registration */
// 	route.get('/register',users.register);
// 	route.post('/register', users.registerPost);

// 	/* test pages */
// 	route.get('/test',function(req,res){
// 		var querystring 			= require('querystring');
// 		res.send( querystring.stringify(req) );
// 	});

// 	//finally pass the route to app
// 	app.use(route);
// }
