'use strict';

const express = require('express');
const router = express.Router();
const contextModel = require('../../lib_db/context');
const CustomError = require('../../lib/CustomError');

// AUTENTICACIÓN JWT
const jwtAuth = require('../../lib/jwtAuth');

router.use(jwtAuth);

//  Util

function getFilter(req) {
    // Consultamos la query string para obtener los fitros
    const tag = req.query.tag;
    const sale = req.query.sale;
    const name = req.query.name;
    const price = req.query.price;
    const fields = req.query.fields;

    let filter = {};
    if (tag) {
        filter.tag = tag;
    }

    if (sale) {
        if (sale.toLowerCase() === 'true') {
            filter.sale = true;
        } else if (sale.toLowerCase() === 'false') {
            filter.sale = false;
        } else {
            throw new CustomError('Sale filter not valid', 409);
        }
    }
    if (name) {
        filter.name = name;
    }
    if (price) {

        if (price.match(/^\d*-\d*$/g) !== null) {
            const priceFrom = price.match(/^\d*/g);
            const priceUntil = price.match(/\d*$/g);
            if (priceFrom[0]) {
                filter.priceFrom = parseInt(priceFrom[0]);
            }
            if (priceUntil[0]) {
                filter.priceUntil = parseInt(priceUntil[0]);
            }
        } else {
            throw new CustomError('Price filter is not valid', 409);
        }
    }
    if (fields) {
        const fields_arr = fields.split(',');
        filter.fields = fields_arr;
    }
    return filter;
}

function getOptions(req) {
    const start = parseInt(req.query.start);
    const limit = parseInt(req.query.limit);
    const sort = req.query.sort;

    let options = {};
    if (req.query.start) {
        if (start) {
            options.start = start;
        } else {
            throw new CustomError('Start option is not valid', 409);
        }
    }
    if (req.query.limit) {
        if (limit) {
            options.limit = limit;
        } else {
            throw new CustomError('Limit option is not valid', 409);
        }
    }
    if (sort) {
        options.sort = sort;
    }

    return options;
}

/* GET /apiv1/ads */
router.get('/', function (req, res, next) {
    let filter;
    let options;
    try {
        filter = getFilter(req);
        options = getOptions(req);

    } catch (err) { 
        
        next(new CustomError('Query string not valid', 409, err));
        return;
    }

    contextModel.listAds(filter, options).then((datos) => { 
        const datosWithPicture = datos.map(function (ad) {
            contextModel.setPictureUrl(ad,'http://' + req.header('host') + '/apiv1/ads/images/');
            return ad;
        });
        
         res.json({
            success: true,
            result: {
                list: datosWithPicture,
                total: datosWithPicture.length
            }
        });
    })
        .catch(err => {
            next(new CustomError('Error while retrieving ads', err));
            return;
         });
});

module.exports = router;