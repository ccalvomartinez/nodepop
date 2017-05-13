"use strict";

const mongoose = require('mongoose');

//Obtenemos el objeto conexión
const conn = mongoose.connection;
// Le decimos a mongoose qué librería de promesas vamos a utilizar
mongoose.Promise = global.Promise;
// Nos suscribimos a los eventos que nos interesan
conn.on('error', (err) => { 
    console.log('Error de conexión', err);
    process.exit(1);
});

conn.once('open', () => { 
    console.log('Conectado a MongoDB');
})
// Conectamos
mongoose.connect('mongodb://localhost/cursonode');



