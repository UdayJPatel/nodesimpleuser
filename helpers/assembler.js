/*
PURPOSE : To assemble different section of the page like
	Top nav bar
	Footer bar
	sidebar
	page title
	etc...

in the req scope you can look at
	req.path
	req.app = this is function so req.app.get('port');
	req.hostname
	req.query
	req.url
*/
'use strict';
var cf  				= require('./commonfunction');
var async 				= require('async');
var header 				= require('./header');
var	footer 				= require('./footer');

var setPageTitle = function(req){
	var currentPage = req.path.split("/");
	var title = req.app.get('siteName');

	if( currentPage.length > 1 && currentPage[1] !== ''){
		switch ( currentPage[1].toLowerCase() ) {
			case "login":
				title += ' - Login';
				break;
			case "users":
				title += ' - Users';
				break;
			default:
				title += ' - ' + currentPage[1];
				break;
		}
		
	}
	return title;
};

// if you are debugging add dumpdata to viewModel
// commenting this function as it is not needed
/*
var genDumpData = function(req,viewModel){
	if( (req.query.debug !== undefined && req.query.debug === 1) && (req.query.dump !== '') ) {
		var debugList = cf.listToArray(req.query.dump);
		var dumpList = {};

		debugList.forEach( function(element, index) {

			switch (element) {
				case "app":
					// console.log(req.app);
					dumpList[element] = req.app.locals;
					break;
				default:
					try {
						dumpList[element] = eval(element);
					}
					catch(e) {
						dumpList[element] = 'undefined';
					}
					break;
			}
			
		});

		var options = req.query;
		var dumpdata = cf.dump(dumpList,options);
		viewModel.dumpdata = dumpdata;
		viewModel.query = req.query;
		viewModel.debug = req.query.debug;
	}
	else{
		delete viewModel.dumpdata;
	}

	return viewModel;
};
*/
module.exports = function(req, viewModel, callback){
	
	async.parallel([
		function(next) {
			next(null, footer);
		},
		function(next) {
			next(null, header);
		}
	],
	function(err, results){
		viewModel.assembler = {
			footer: results[0],
			header: results[1]
		};

		// viewModel = genDumpData(req,viewModel);
		viewModel.siteName = req.app.get('siteName');
		viewModel.title = setPageTitle(req);

		callback(viewModel);
	});
};