'use strict';

require('./connectMonggose');
const Ad = require('../models/Ad');

//Controlaremos los errores a la salida de este método.
module.exports = async function populateBD() {
    // Leer ficheros
    const ads = require('./adsInitData.json');

    // Borrar tablas
    await Ad.remove({});

    // Insertar filas    
    await Ad.insertMany(ads);
};
//module.exports.fillDB().then(()=>{console.log('Terminado')}).catch((err) => {console.log(err)});

