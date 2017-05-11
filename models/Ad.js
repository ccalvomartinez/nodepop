const mongoose = require('mongoose');

// primero definimos un esquema
const addSchema =
    // @ts-ignore
    mongoose.Schema({
        name: String,
        price: Number,
       // ....
    });

// Luego creamos el modelo

const Ad = mongoose.model('Ad', addSchema);
//Realmente no es necesario exportarlo porque  podríamos recuperarlo usando
//mongoose.models('Agente)
module.exports = Ad;