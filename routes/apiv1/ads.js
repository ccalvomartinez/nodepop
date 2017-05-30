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
