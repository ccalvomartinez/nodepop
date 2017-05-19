'use strict';

module.exports.loadDataToDb = true;
module.exports.dbName = "nodepop";
module.exports.saltRounds = 10;
module.exports.jwt = {
    secret: 'BgV7G@fqJS2xR*HJ',
    expiresInSeconds: 24 * 60 * 60
};