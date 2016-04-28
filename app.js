var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var request = require('./routes/request');
var project = require('./routes/project');
var api = require('./routes/api');
var compression = require('compression')

var app = express();
var session = require('express-session');
var db = require('./util/db');
var _ = require('lodash');
var http = require('./middle/http');
var login_auth = require('./middle/login-auth');
var message = require('./util/message');
var SequelizeStore = require('connect-session-sequelize')(session.Store);

app.disable('x-powered-by');

app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(http);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
const secret = "something";
app.use(cookieParser(secret));

app.use(session({
    secret: secret,
    resave: false,
    rolling: true,
    store: new SequelizeStore({
        db: db.sequelize
    }),
    saveUninitialized: true,
    cookie: {maxAge: 1000 * 60 * 60, path: "/"}
}));


app.use('/apis', api);
app.use('/', routes);
app.use(login_auth);
app.use('/users', users);
app.use('/requests', request);
app.use('/projects', project);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        console.log(err);
        if (req.acceptJson()) { //json
            res.json(_.defaults({message: "from response system " + err.message}, message.exception));
        } else {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        }
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    console.log(err);
    if (req.acceptJson()) { //json
        res.json(_.defaults({message: "from response system error"}, message.exception));
    } else {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    }
});


module.exports = app;
