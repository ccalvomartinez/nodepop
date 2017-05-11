// Conectamos a la BD y rellenamos la BD si está en el fichero de configuración 
require('./connectMonggose');
const mongoose = require('mongoose');
const Agente = require('../models/Ad');

    //Leer fichero de preferencias y en su caso, rellenar la bd
// Callback o promesa para todas las funciones que voy a crear
module.exports.addUser = function (name, email, password, callback) { 
        //
    };
module.exports.listAds = function (filter, limit, skip, fields, sort, callback) { };
    
module.exports.getUserByEmail = function (email) { };
module.exports.validateUser = function (email, password) { };


