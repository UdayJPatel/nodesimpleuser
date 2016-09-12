"use strict";

var express                         = require('express');
var exphbs                          = require('express-handlebars');
var path                            = require('path');
var favicon                         = require('serve-favicon');
var logger                          = require('morgan');
var cookieParser                    = require('cookie-parser');
var bodyParser                      = require('body-parser');
var mongoose                        = require('mongoose');
var fs                              = require('fs');

// var routes                          = require('./routes');
var routeHome                       = require('./routes/index');
var routeUsers                      = require('./routes/users');
var routeTest                       = require('./routes/test');
var moment                          = require('moment');

var app                             = express();

//run config
require('./config')(app);

//put commonfunction in global stuff - this contains dump
global.cs                           = require('./helpers/commonfunction');
global.dump                         = require('./helpers/dump');

require('nodedump');

// var test = require('./test/async');
// var test = require('./test/typeof');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

// routes(app);
routeHome(app);
routeUsers(app);

if (app.get('env') === 'development') {
    routeTest(app);
}

app.use('/public',express.static(path.join(__dirname, 'public')));

// view engine setup
app.engine('hbs', exphbs.create({
        defaultLayout: 'main',
        extname : 'hbs',
        layoutsDir: app.get('views') + '/layouts/',
        partialsDir: [app.get('views') + '/partials/'],
        helpers: {
            timeago: function(timestamp) {
                return moment(timestamp).startOf('minute').fromNow();
            },
            formatDate: function(timestamp){
                return moment(timestamp).format('MM-DD-YYYYY');
            }
        }
    }).engine);
app.set('view engine', 'hbs');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// DB connection
mongoose.connect('mongodb://localhost/' + app.get('webroot'),function(error){
    if(error){
        console.log(error.name + ' : ' + error.message);
        console.log('Aborting....');
        process.abort();    
    }
});

mongoose.connection.on('open', function() {
    console.log('Mongoose connected.');
});

app.listen(app.get('port'),function(){
    console.log('Server running at: http://localhost:' + app.get('port'));
});

module.exports = app;