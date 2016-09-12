'use strict';

var user = require('../models').User;
var assembler = require('../helpers/assembler');
var viewModel = {};

var registerUser = function(req,res,viewModel){

	var renderPage = function(){
		res.render('register',viewModel);
	};

	// move below line of code into call back function of user
	// assembler(req,viewModel,registerUser(req,res,viewModel));
	//parameters expected in the body
	var formFields = ['firstName','lastName','email','password','confirmPassword'];
	var formFieldLabel = ['First Name','Last Name','Email','Password','Confirm Password'];

	viewModel.error = 0;
	viewModel.message = '';

	formFields.forEach( function(field,idx){
		if( req.body[field] === 'undefined' || req.body[field] === ''){
			viewModel.message += '<br />' + formFieldLabel[idx];
		}
	});

	if( viewModel.message !== '' ){
		viewModel.error = 1;
		viewModel.message = ' !!! Oops you missed some fields !!!' + viewModel.message;
	}

	if( req.body.password !== req.body.confirmPassword ){
		viewModel.error = 1;
		viewModel.message = ' Password and confirm password do not match';
	}

	if( viewModel.error === 1){
		//assemble the page
		assembler(req,viewModel,renderPage);
		return false;
	}

	if( viewModel.error === 0 ){
		user.count({ 'email':req.body.email }, function( err,count ){
			if(err) return err;

			if( count !== 0 ){
				viewModel.error = 1;

				//user exists
				viewModel.message = 'Email: '+req.body.email+' is already registered';
				
				//assemble the page
				assembler(req,viewModel,renderPage);
			}
			else{
				var u = new user({
					'firstname'			 : req.body.firstName,
					'lastname' 		     : req.body.lastName,
					'email'    		     : req.body.email,
					'password' 			 : req.body.password
				});
				viewModel.error = 0;
				viewModel.message = req.body.firstName + ', ' + req.body.lastName + ' (' + req.body.email + ') added successfully !!!';

				//add user to DB
				u.save( function(err, a, numAffected){
					assembler(req,viewModel,renderPage);
				});
			}
		});
	}
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
		// var viewModel = {};
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