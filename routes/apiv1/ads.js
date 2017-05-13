'use strict';

const express = require('express');
const router = express.Router();
const context = require('../../lib_db/context');
const customError = require('../../lib/customError');

// AUTENTICACIÓN JWT
const jwtAuth = require('../../lib/jwtAuth');

router.use(jwtAuth);


/* GET /apiv1/ads */
router.get('/', function (req, res, next) {
    let filter;
    let options;
    try {
        filter = getFilter(req);
        options = getOptions(req);

    } catch (err) { 
        
        next(customError("Error en la query string",409,err));
        return;
    }

    context.listAds(filter, options).then((datos) => { 
        const datosWithPicture = datos.map(function (ad) {
            ad.picture =  'http://' + req.header('host') + '/apiv1/ads/images/' + ad.picture;
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
            next(customError("Error al recuperar los datos",err));
            return;
         });
});

function getFilter(req) { 
    // Consultamos la query string para obtener los fitros
    const tag = req.query.tag;
    const sale = req.query.sale;
    const name = req.query.name;
    const price = req.query.price;

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
            throw customError('Error en el filtro de venta');
            
        }
    }
    if (name) {
        filter.name = name;
    }
    if (price) {

        if (price.match(/^\d*-\d*$/g) != null) {
            const priceFrom = price.match(/^\d*/g);
            const priceUntil = price.match(/\d*$/g);
            if (priceFrom[0]) {
                filter.priceFrom = parseInt(priceFrom[0]);
            }
            if (priceUntil[0]) {
                filter.priceUntil = parseInt(priceUntil[0]);
            }
        } else {
            console.log('Error');
            throw customError('El filtro de precio no es correcto');
            
        }

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
            throw new customError('La opción de inicio no es correcta');
        }
    }
    if (req.query.limit) { 
        if (limit) {
            options.limit = limit;
        } else { 
            throw customError('La opción de límite no es correcta');
        }
    }
    if (sort) { 
        options.sort = sort;
    }

    return options;
}
module.exports = router;