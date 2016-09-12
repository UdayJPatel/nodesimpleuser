'use strict';

var user = require('../models').User;
var assembler = require('../helpers/assembler');

var registerUser = function(req,res,viewModel){

	var renderPage = function(){
		res.render('register',viewModel);
	};

	// move below line of code into call back function of user
	// assembler(req,viewModel,registerUser(req,res,viewModel));

	user.count({'email':req.body.email}, function( err,count ){
		if(err) return err;

		if( req.body.email === '' || req.body.firstname === '' || req.body.lastname === '' ){
			viewModel.error = 1;
			viewModel.message = 'Please provide data';
			assembler(req,viewModel,renderPage);
		}
		else{
			if( count !== 0 ){
				viewModel.error = 1;

				//user exists
				viewModel.message = req.body.lastname + ', ' + req.body.firstname + ' (' + req.body.email + ') already exists !!!';
				
				//assemble the page
				assembler(req,viewModel,renderPage);
			}
			else{
				var u = new user({
					'firstname'			 : req.body.firstname,
					'lastname' 		     : req.body.lastname,
					'email'    		     : req.body.email,
					'password' 			 : req.body.password
				});
				viewModel.error = 0;
				viewModel.message = req.body.firstname + ', ' + req.body.lastname + ' (' + req.body.email + ') added successfully !!!';

				//add user to DB
				u.save( function(err, a, numAffected){
					assembler(req,viewModel,renderPage);
				});
			}
		}

	});
};

module.exports = {
	index : function(req,res){
		
		var viewModel = {};
		var renderPage = function(){
			res.render('users',viewModel);
		};

		//query and get user list
		user.find({},function(err,doc){
			if(err) console.log(err);
			viewModel.users = doc;
			assembler(req,viewModel,renderPage);
		});
	},
	login : function(req,res){
		var viewModel = {};
		var renderPage = function(){
			res.render('login',viewModel);
		};

		assembler(req,viewModel,renderPage);
	},
	register : function(req,res){
		var viewModel = {};
		viewModel.formAction = req.path;

		// viewModel.htmlContent = genForm();// TO DO
		var renderPage = function(){
			res.render('register',viewModel);
		};
		assembler(req,viewModel,renderPage);
	},

	//this is when the form is posted 
	registerPost : function(req,res){
		var viewModel = {};
		viewModel.formAction = req.path;
		viewModel.body = req.body;

		//if form is submitted register user by adding him to db
		registerUser(req,res,viewModel);
	}
};


/* UNDER CONSTRUCTION - 
	PURPOSE : Utility function to generate from and its input element from json data. so adding form fields becomes a breeze
*/
function genForm(){
	return '<input type="email" class="form-control" id="email" name="email">';
}