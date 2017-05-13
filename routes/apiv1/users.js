const express = require('express');
const router = express.Router();
const CustomError = require('../../lib/CustomError');
const context = require('../../lib_db/context');

/* POST /apiv1/users */
router.post('/', function (req, res, next) {
  const userData = getUserData(req.body);
  context.addUser(userData.name, userData.email, userData.password)
    .then(user => { 
        res.json({
          success: true,
          result: {
            user:user
          }
        });
    })
    .catch(err => { 
    
      next(new CustomError('Error al registrar al usuario', err));
    });
});

router.get('/authenticate', function (req, res, next) {
  const userData = getAuthenticationData(req.query);
  context.validateUser( userData.email, userData.password)
    .then((tokenData) => {
      res.json({
        success: true,
        result: {
          user: tokenData.user,
          token: tokenData.token
        }
      });
    })
    .catch(err => {

      next(new CustomError('Error al autenticar al usuario', err));
    });
});

function getUserData(body) { 
  const name = body.name;
  const email = body.email;
  const password = body.password;

  if (!name) { 
    throw new CustomError("El nombre no puede estar vacío", 409);
  }
  if (!email) { 
    throw new CustomError("El email no puede estar vacío", 409);
  }
  if (!password) { 
    throw new CustomError("El password no pude estar vacío", 409);
  }
  return {
    name: name,
    email: email,
    password:password
  }
}

function getAuthenticationData(query) {
  const email = query.email;
  const password = query.password;

  if (!email) {
    throw new CustomError("El email no puede estar vacío", 409);
  }
  if (!password) {
    throw new CustomError("El password no pude estar vacío", 409);
  }
  return {
    email: email,
    password: password
  }
}
module.exports = router;
