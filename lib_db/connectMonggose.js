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

// No necesito exportar nada ya que mongoose se encarga de guardar la conexión

// Leer los datos del fichero de configuración rellenar la base de datos en caso 
//necesario

