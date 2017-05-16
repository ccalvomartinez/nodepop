'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const winston = require('winston');

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

// Conectamos a la BD 
require('./lib_db/connectMonggose');

// Rutas
const index = require('./routes/index');
const users = require('./routes/apiv1/users');
const ads = require('./routes/apiv1/ads');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// MIDLEWARE
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Habilitamos CORS

app.use(function (req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With,Content- Type, Accept');
next();
});

// ROUTES
app.use('/apiv1/ads/images',express.static(path.join(__dirname, 'public/images')));

app.use('/', index);
app.use('/apiv1/users', users);
app.use('/apiv1/ads', ads);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});


function isAPI(req) {
  return req.originalUrl.indexOf('/apiv') === 0;
}

// error handler
app.use(function (err, req, res, next) {
 // console.log('Error final', err);
  res.status(err.status || 500);

  if (isAPI(req)) {
   
     winston.error('Error %s, status: %d', err.message, err.status);
    
    if (err instanceof CustomError) {
      const culture = req.query.culture || req.body.culture;
      res.json(err.toPrettyObject(culture));
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


module.exports = app;
