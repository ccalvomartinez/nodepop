// Conectamos a la BD y rellenamos la BD si está en el fichero de configuración 
require('./connectMonggose');
const mongoose = require('mongoose');
const Ad = require('../models/Ad');
const User = require('../models/User');

// Leer los datos del fichero de configuración rellenar la base de datos en caso 
//necesario
try{
    const config = require('../config/config');
}catch(err){
    console.error('No se ha podido leer el fichero de configuración:', err);
}
if(config && confirm.loadDataToDb){
    const fillDB = require('./fillDB');
    fillDB().then(()=>{
        assignExports();
    }).catch(err => {
        console.log('Error al cargar los datos',err);
        assignExports();
    });
}else{
    assignExports();
}


function assignExports(){
        // Callback o promesa para todas las funciones que voy a crear
    module.exports.addUser = function (name, email, password, callback) { 
            //
        };
    module.exports.listAds = function (filter, limit, skip, fields, sort, callback) { };
        
    module.exports.getUserByEmail = function (email) { };
    module.exports.validateUser = function (email, password) { };
}