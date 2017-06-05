'use strict';

const express = require('express');
const router = express.Router();
const contextModel = require('../../lib_db/context');
const CustomError = require('../../lib/CustomError');
const middlewareUtils = require('../../lib/middlewareUtils');

// AUTENTICACIÓN JWT
const jwtAuth = require('../../lib/jwtAuth');

router.use(jwtAuth);

/* GET /apiv1/ads */
router.get('/', function (req, res, next) {
    let filter;
    let options;
    try {
        filter = middlewareUtils.getFilter(req);
        options = middlewareUtils.getOptions(req);

    } catch (err) {
        next(new CustomError('Query string not valid', 409, err));
        return;
    }

    contextModel.listAds(filter, options).then((datos) => {
        const datosWithPicture = datos.map(function (ad) {
            contextModel.setPictureUrl(ad, 'http://' + req.header('host') + '/apiv1/ads/images/');
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


<<<<<<< HEAD
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

            if (filter.priceFrom && filter.priceUntil && filter.priceFrom > filter.priceUntil) {
                throw new CustomError('Price filter is not valid', 409);
            }
        } else {
            throw new CustomError('Price filter is not valid', 409);
        }
    }
    if (fields) {
        filter.fields = fields.split(',');
    }
    return filter;
}

function getOptions (req) {
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
=======
>>>>>>> ccd06473b8ab16c0c58812faf7a2dec3dd6fb5be

/* GET /apiv1/ads/tags */
router.get('/tags', function (req, res, next) {

    contextModel.listTags().then((tags) => {

        res.json({
            success: true,
            result: {
                listTags: tags,
                total: tags.length
            }
        });
    })
        .catch(err => {
            next(new CustomError('Error while retrieving tags', err));
            return;
        });
});
module.exports = router;
