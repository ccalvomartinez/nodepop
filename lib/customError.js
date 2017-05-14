'use strict';

const translate = require('./translate');

function CustomError(message, status, innerError) {
    Error.call(this, message);
    this.message = message;
    if (status && Number.isInteger(status)) {
        this.status = status;
    }
    if (status && status instanceof Error) {
        this.innerError = status;
    }
    if (innerError && innerError instanceof Error) {
        this.innerError = innerError;
    }
    if (this.innerError  && this.innerError.status) {
        this.status = this.innerError.status;
    }
    this.toPrettyObject = function (culture) {
        let pretty = {};
        pretty.success = false;
        pretty.error = {};
        pretty.error.message = translate(this.message, culture);
        if (this.innerError) {
            pretty.info = getInfo(this.innerError, culture);
        }
        return pretty;
    };
}
function getInfo(err, culture) {
    let info = {};
    info.error = {};
    info.error.message = translate(err.message, culture);
    if (err.innerError) { 
        info.error.info = getInfo(err.innerError);
    }
    return info;
}
CustomError.prototype = new Error('');

module.exports = CustomError;