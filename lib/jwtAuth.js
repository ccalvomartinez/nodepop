"use strict";
const jwt = require('jsonwebtoken');
const customError = require('../lib/customError');
const config = require('../config/config');

module.exports = (req, res, next) => {
    const token = req.body.token || req.query.token ||
        req.headers['x-access-token'];
    jwt.verify(token, config.jwt.secret, function (err, decoded) {
        if (err) { 
            next(customError('Token no válido', 403, err));
            return;
        }
        req.decoded = decoded;
        next();
    })
};