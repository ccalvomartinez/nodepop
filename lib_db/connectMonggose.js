'Use strict';

// Logger
const winston = require('winston');
// Intentamos leer el fichero de configuración.
// Si hay un error, terminamos el programa
let config;
try {
    config = require('../config/config');
} catch (err) {
    winston.error('No se ha podido leer el fichero de configuración:', err);
    process.exit(4);
}

// CONEXIÓN CON MONGO
const mongoose = require('mongoose');

//Obtenemos el objeto conexión
const conn = mongoose.connection;
// Le decimos a mongoose qué librería de promesas vamos a utilizar
mongoose.Promise = global.Promise;
// Nos suscribimos a los eventos que nos interesan

// En caso de error en la conexión
conn.on('error', (err) => {
    winston.error('Error de conexión', err);
    process.exit(3);
});

conn.once('open', () => {
    winston.info('Conectado a MongoDB');
});

// Cuando nos desconectamos
conn.on('disconnected', function () {
    winston.info('Mongoose default connection to DB disconnected');
});

const gracefulExit = function () {
    conn.close(function () {
        winston.info('Mongoose default connection with DB is disconnected through app termination');
        process.exit(0);
    });
};

// Si termina el proceso de Node, cerramos la conexión
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

// Conectamos
let connectionString = '';
if (config.mongoURI){
    connectionString = config.mongoURI;
}else{
    connectionString='mongodb://';
    if (config.mongoConf.user){
        connectionString += config.mongoConf.user + ':' + config.mongoConf.password;
    }

    connectionString += 'localhost/';
    if (config.mongoConf.dbName){
        connectionString += config.mongoConf.dbName;
    }else{
        connectionString += 'nodepop';
    }
}
console.log(connectionString);
  mongoose.connect(connectionString);


