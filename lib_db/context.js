// Conectamos a la BD y rellenamos la BD si está en el fichero de configuración 

const mongoose = require('mongoose');
const Ad = require('../models/Ad');
const User = require('../models/User');
const customError = require('../lib/customError');
const cryptografy = require('../lib/cryptografy');

    // Callback o promesa para todas las funciones que voy a crear

module.exports.listAds = function (filter, options) { 
    let query;
    try { 

        let query = Ad.find();
        // FILTRO
        if (filter.tag) { 
            query.where('tags').in([filter.tag])
        }
    
        if (filter.sale === true) { 
            query.where('category').equals('vende');
        }
        if (filter.sale === false) { 
            query.where('category').equals('busca');
        }
        if (filter.name) { 
            query.where('name', new RegExp('^' + filter.nombre, 'i'));
        }
        if (filter.priceFrom) { 
            query.where('price').gt(filter.priceFrom);
        }
        if (filter.priceUntil) { 
            query.where('price').lt(filter.priceUntil);
        }

        //OPCIONES DE SALIDA

        if (options.start) { 
            query.start(options.start);
        }        
        if (options.limit) { 
            query.limit(options.limit);
        }
        if (options.sort) { 
            query.sort(options.sort);
        }
        query.select('-__v');
        return query.exec();
    } catch (err) { 
        throw customError('Error al generar la consulta', err);
    }
   
};
module.exports.addUser = async function (name, email, password) {
   let passwordHashed = await cryptografy.getHash(password)
    const user = new User({
        name: name,
        email: email,
        password: passwordHashed
    });
    let createdUser = await user.validate()
        .catch(valErr => {
            let message = '';
            console.log(valErr.errors);
            Object.keys(valErr.errors).forEach(function (key, index) {
                message += valErr.errors[key].message + ' ';
            })

            throw customError(message,409);
        })    
        .then(() => {
            return user.save();
        })
        .then(user => { 
            return User.findById(user._id).select('-__v -password');
        })
        
    return createdUser;
  
};
module.exports.getUserByEmail = function (email) { };
module.exports.validateUser = async function (email, password) { 
    console.log('Email', email);
    console.log('Password', password);
    const user = await User.findOne({ email: email });
    console.log('User', user);  
    if (!user) { 
        throw customError('No tenemos un usuario registrado con ese email', 409);
    }
 
    const esPasswordValido = await cryptografy.validateHash(password, user.password);

    if (esPasswordValido) {
        cryptografy.getToken(user, function (err, token) {
            if (err) { 
                throw customError('Error al generar el token');
            }
            return {
                user: {
                    name: user.name,
                    email: user.email              
                },
                token: token
            }
        });
    } else { 
        throw customError('La contraseña no es correcta',409);
    }
};
