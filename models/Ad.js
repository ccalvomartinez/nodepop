const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// primero definimos un esquema
const adSchema = new Schema({
    name: {
        type:String,
        required:true
    },
    category: {
        type:String,
        enum:['vende','busca']    
    },
    price: {
        type:Number,
        min:1
    },
    picture: String,
    tags:[{
        type:String,
        enum:['work','lifeStyle','motor','mobile']    
    }]
    });

// Luego creamos el modelo

const Ad = mongoose.model('Ad', adSchema);

//Realmente no es necesario exportarlo porque  podríamos recuperarlo usando
//mongoose.models('Ad)
module.exports = Ad;