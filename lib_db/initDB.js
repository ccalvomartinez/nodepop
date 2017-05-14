'use strict';
// Conectamos a la BD y rellenamos la BD si está en el fichero de configuración
require('./connectMonggose');


// Leer los datos del fichero de configuración rellenar la base de datos en caso 
//necesario
let config;
try {
    config = require('../config/config');
} catch (err) {
    console.error('No se ha podido leer el fichero de configuración:', err);
    process.exit(4);
}
if (config && config.loadDataToDb) {
    const fillDB = require('./fillDB');

    fillDB().then(() => { })
        .catch(err => {
            console.error('Error:', err);
            process.exit(5);
    });
} 