'use strict';

const express = require('express');
const router = express.Router();
const CustomError = require('../../lib/CustomError');
const contextModel = require('../../lib_db/context');
const winston = require('winston');
const middlewareUtils = require('../../lib/middlewareUtils');

/* POST /apiv1/users */
router.post('/', function (req, res, next) {
  
  const userData = middlewareUtils.getUserData(req.body);

  contextModel.addUser(userData.name, userData.email, userData.password)
    .then(user => {

        winston.info('Usuario registrado. Nombre: %s, Email: %s', user.name, user.email);

        res.json({
          success: true,
          result: {
            user:user
          }
        });
    })
    .catch(err => {
      next(new CustomError('Error while registering user', err));
    });
});



/* GET /apiv1/users/authenticate */
router.get('/authenticate', function (req, res, next) {
  const userData = middlewareUtils.getAuthenticationData(req.query);
  
  contextModel.validateUser( userData.email, userData.password)
    .then((tokenData) => {

      winston.info('Usuario autenticado. Nombre: %s, Email: %s', tokenData.user.name, tokenData.user.email);

      res.json({
        success: true,
        result: {
          user: tokenData.user,
          token: tokenData.token
        }
      });
    })
    .catch(err => {
      next(new CustomError('Error while authenticating user', err));
    });
});



module.exports = router;
