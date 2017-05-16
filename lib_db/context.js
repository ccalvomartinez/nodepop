'use strict';


const Ad = require('../models/Ad');
const User = require('../models/User');
const CustomError = require('../lib/CustomError');
const cryptografy = require('../lib/cryptografy');

module.exports.listAds = function (filter, options) { 
    try { 

        let query = Ad.find();
        // FILTRO
        if (filter.tag) { 
            query.where('tags').in([filter.tag]);
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
        if (filter.fields) {
            query.select(filter.fields.join(' '));
        } else { 
            query.select('-__v');
        }
        return query.exec();
    } catch (err) { 
        throw new CustomError('Error al generar la consulta', err);

    }
   
};
module.exports.listTags = function(){

   return Ad.find().distinct("tags").exec();
};
module.exports.setPictureUrl = function (ad, rootUrl) {
    if (ad.picture) {
        ad.picture = rootUrl + ad.picture;
    }
    return ad;
};

module.exports.addUser = async function (name, email, password) {
    let passwordHashed = await cryptografy.getHash(password);
    const user = new User({
        name: name,
        email: email,
        password: passwordHashed
    });
    let createdUser = await user.validate()
        .catch(valErr => {
            let message = '';
            Object.keys(valErr.errors).forEach(function (key) {
                message += valErr.errors[key].message + ' ';
            });
            
            throw new CustomError(message, 409);
        })    
        .then(() => {
            return user.save();
        })
        .then(user => { 
            return User.findById(user._id).select('-__v -password');
        })
        
    return createdUser;
  
};


module.exports.validateUser = async function (email, password) { 
    const user = await User.findOne({ email: email });
    if (!user) { 
        
        throw new CustomError('We do not have a registered user with that email', 409);
    }
 
    const esPasswordValido = await cryptografy.validateHash(password, user.password);

    if (esPasswordValido) {
        const token = cryptografy.getToken(user);
            return {
                user: {
                    name: user.name,
                    email: user.email              
                },
                token: token
            }
    } else { 
        throw new CustomError('Password not valid',409);
    }
};
