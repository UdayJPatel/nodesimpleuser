"use strict";

var path = require('path');

var appVariables = {
    siteName : "Node JS Simple User"
};


// sometimes I run this code on mac and at times on windows set lets webroot accordingly
// set webroot dir name - lets call it webroot
switch(process.platform){
    case "win32":
        var webrootdir = __dirname.split("\\");
        break;

    case "darwin":
        var webrootdir = __dirname.split("/");
        break;

    default:
        console.log("Not able to detect OS");
        process.exit();
        break;
}

module.exports = function(app){

    for( var key in appVariables){
        app.set(key,appVariables[key]);
    }

    app.set('port',process.env.PORT || 3300);
    app.set('views', path.join(__dirname, 'views'));
    app.set('webroot',webrootdir[ webrootdir.length-1 ]);

};





