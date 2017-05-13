const express = require('express');
const router = express.Router();
const customError = require('../../lib/customError');
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
    
      next(customError('Error al registrar al usuario',null, err));
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

      next(customError('Error al autenticar al usuario', null, err));
    });
});

function getUserData(body) { 
  const name = body.name;
  const email = body.email;
  const password = body.password;

  if (!name) { 
    throw customError("El nombre no puede estar vacío");
  }
  if (!email) { 
    throw customError("El email no puede estar vacío");
  }
  if (!password) { 
    throw customError("El password no pude estar vacío");
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
    throw customError("El email no puede estar vacío");
  }
  if (!password) {
    throw customError("El password no pude estar vacío");
  }
  return {
    email: email,
    password: password
  }
}
module.exports = router;
