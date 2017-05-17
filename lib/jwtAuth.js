'use strict';

const CustomError = require('../lib/CustomError');
const cryptografy = require('./cryptografy');

// Authentication middleware

module.exports = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    cryptografy.validateToken(token, function (err, decoded) {
        if (err) {
            next(new CustomError('Token not valid', 403, err));
            return;
        }
        req.decoded = decoded;
        next();
    });
};
