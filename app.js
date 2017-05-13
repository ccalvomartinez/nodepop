var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var winston = require('winston');

//Configuramos la utilidad de log

winston.add(winston.transports.File, {
  name: 'error-file',
  filename: './logs/errors.log',
  handleExceptions: true,
  humanReadableUnhandledException: true,
  level: 'error'
});
winston.add(winston.transports.File, {
  name: 'info-file',
  filename: './logs/info.log',
  level: 'info'
});

// Cargamos Custom Errors
const CustomError = require('./lib/CustomError');

//Conectamos a la base de datos y la poblamos si así lo pide el fichero de configuración
require('./lib_db/initDB');

var index = require('./routes/index');
var users = require('./routes/apiv1/users');
var ads = require('./routes/apiv1/ads');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use('/apiv1/ads/images',express.static(path.join(__dirname, 'public/images')));

app.use('/', index);
app.use('/apiv1/users', users);
app.use('/apiv1/ads', ads);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
 // console.log('Error final', err);
  res.status(err.status || 500);

  if (isAPI(req)) {
    winston.error('Error %s, status: %d', err.message, err.status);
    if (err instanceof CustomError) {
      res.json(err.toPrettyObject());
    } else { 
      res.json({ succes: false, error: err.message });
    }
    return;
  }
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.render('error');
});

function isAPI(req) {
  return req.originalUrl.indexOf('/apiv') === 0;
}

module.exports = app;
