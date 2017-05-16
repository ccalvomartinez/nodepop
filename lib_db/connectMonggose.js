'use strict';

const mongoose = require('mongoose');

//Obtenemos el objeto conexión
const conn = mongoose.connection;
// Le decimos a mongoose qué librería de promesas vamos a utilizar
mongoose.Promise = global.Promise;
// Nos suscribimos a los eventos que nos interesan
conn.on('error', (err) => { 
    console.log('Error de conexión', err);
    process.exit(3);
});

conn.once('open', () => {
    console.log('Conectado a MongoDB');
});

// When the connection is disconnected
conn.on('disconnected', function () {
  console.log('Mongoose default connection to DB :' + db_server + ' disconnected');
});

const gracefulExit = function() { 
 conn.close(function () {
    console.log('Mongoose default connection with DB :' + db_server + ' is disconnected through app termination');
    process.exit(0);
  });
}

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

// Conectamos
mongoose.connect('mongodb://localhost/cursonode');



