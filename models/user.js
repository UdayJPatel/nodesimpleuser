'use strict';

var mongoose 	= require('mongoose'),
	Schema 		= mongoose.Schema;

var UserSchema = new Schema({
	firstname      			: { type: String },
	lastname				: { type: String },
	email   				: { type: String },
	password      			: { type: String },
	dateAdded 				: { type: Date, default: Date.now }
});

// UserSchema.virtual('uniqueId').get(function() {
// 	return this.filename.replace(path.extname(this.filename), '');
// });

module.exports = mongoose.model('User', UserSchema);


/*
// this works
var user = new model.User({
			firstname      			: "Uday",
			lastname				: "Patel",
			email   				: "upatel@gmail.com",
			password      			: "pa55word"
		});

console.log('User Model: ' + user);
user.save();
*/