"use strict";
const fs = require('fs');
require('./connectMonggose');
const mongoose = require('mongoose');
const Ad = require('../models/Ad');
const User = require('../models/User');
//Controlaremos los errores a la salida de este método.
module.exports= function(){
    // Leer ficheros
    const ads = require('./adsInitData.json');
//TODO: Async await
    // Borrar tablas
    return  Ad.remove({}).then(()=>{
        //Insertar anuncios
        return Ad.insertMany(ads);
     });
    
}
//module.exports.fillDB().then(()=>{console.log('Terminado')}).catch((err) => {console.log(err)});

