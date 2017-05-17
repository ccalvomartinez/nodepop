'use strict';

const express = require('express');
const router = express.Router();
const CustomError = require('../../lib/CustomError');
const contextModel = require('../../lib_db/context');
const winston = require('winston');

/* POST /apiv1/users */
router.post('/', function (req, res, next) {
  const userData = getUserData(req.body);
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
  const userData = getAuthenticationData(req.query);
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

function getUserData (body) {
  const name = body.name;
  const email = body.email;
  const password = body.password;

  if (!name) {
    throw new CustomError('Name cannot be empty', 409);
  }
  if (!email) {
    throw new CustomError('Email cannot be empty', 409);
  }
  if (!password) {
    throw new CustomError('Password cannot be empty', 409);
  }
  return {
    name: name,
    email: email,
    password: password
  };
}

function getAuthenticationData (query) {
  const email = query.email;
  const password = query.password;

  if (!email) {
    throw new CustomError('Email cannot be empty', 409);
  }
  if (!password) {
    throw new CustomError('Password cannot be empty', 409);
  }
  return {
    email: email,
    password: password
  };
}
module.exports = router;
