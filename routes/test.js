var express = require('express');
var route = express.Router();

module.exports = function(app) {

	/* Get users page */
	route.get('/test', function(req, res) {
		res.send("TEST PAGE");
	});

	app.use(route);
}