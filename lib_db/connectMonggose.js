"use strict";

const mongoose = require('mongoose');

//Obtenemos el objeto conexión
const conn = mongoose.connection;

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



