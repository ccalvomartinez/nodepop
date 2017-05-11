var express = require('express');
var router = express.Router();
const context = new (require('../lib_db/Context'))();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
