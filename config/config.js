'use strict';

module.exports.loadDataToDb = true;
module.exports.mongoConf={
    dbName: 'cursonode',
    user: '',
    password: ''
};
module.exports.mongoURI="";
module.exports.saltRounds = 10;
module.exports.jwt = {
    secret: 'BgV7G@fqJS2xR*HJ',
    expiresInSeconds: 24 * 60 * 60
};