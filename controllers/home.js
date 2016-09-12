'use strict';

var assembler 		= require('../helpers/assembler');
var viewModel = {};

module.exports = {
	index : function(req,res){
		// res.send('Doing conrollers - home - index');
	
		//sample data to test /helpers/dump module		
		var person = {
			"name" : 'Uday',
			"Address" : {
				"Street" : "Rohan Jharoka",
				"City" : "Bangalore",
				"Address2" : {
					"Street" : "Rohan Jharoka",
					"City" : "Bangalore"
				}
			},
			"Phone" : [12312,3213,3435,464,645,54,75,686,8],
			"getName" : function(){
				return this.name;
			}
		}

		var dump = require('../helpers/dump');

		// commenting below code - used to check some options thats available in dump module
		dump.init({printFunction:1});
		// dump.init({levelLimit:8});
		viewModel.dumpdata = dump.dump(person, {label : 'Person'});

		// viewModel.dumpdata = nodedump(person);

		var renderPage = function(){
			res.render('index',viewModel);
		}

		assembler(req,viewModel,renderPage);
	}
}