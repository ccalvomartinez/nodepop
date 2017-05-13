const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// primero definimos un esquema
const userSchema = new Schema({
        name: {
            type: String,
            required:true    
    },
        email: {
            type:String,
            required: true,
            unique: true,
            match:/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/    
    },
        password: {
            type:String,
            required: true
    }
    });

// Luego creamos el modelo

const User = mongoose.model('User', userSchema);

//Realmente no es necesario exportarlo porque  podríamos recuperarlo usando
//mongoose.models('Ad)
module.exports = User;