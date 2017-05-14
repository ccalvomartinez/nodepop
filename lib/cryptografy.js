'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const config = require('../config/config');
module.exports.getHash = function (password) {
    return bcrypt.hash(password, saltRounds);
};

module.exports.validateHash = function (password, hash) {
    return bcrypt.compare(password, hash);
};

module.exports.getToken = function (user) {
    try {
        return jwt.sign(user, config.jwt.secret, { expiresIn: config.jwt.expiresInSeconds });

    } catch (err) {
        throw err;
    }
  
};

module.exports.validateToken =  function (token, callback) {
    jwt.verify(token, config.jwt.secret, { expiresIn: config.jwt.expiresInSeconds }, callback);
};