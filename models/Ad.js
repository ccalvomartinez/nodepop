const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// primero definimos un esquema
const adSchema = new Schema({
    name: {
        type:String,
        required:true,
        index: true
    },
    category: {
        type:String,
        enum:['vende','busca'],
        index:true
    },
    price: {
        type:Number,
        min:1,
        index: true
    },
    picture: String,
    tags:[{
        type:String,
        enum:['work','lifeStyle','motor','mobile'],
        index: true 
    }]
    });

// Luego creamos el modelo

const Ad = mongoose.model('Ad', adSchema);

//Realmente no es necesario exportarlo porque  podríamos recuperarlo usando
//mongoose.models('Ad)
module.exports = Ad;