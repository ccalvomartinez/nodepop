"use strict";

function CustomError(message, status, innerError) {
    console.log('message', message);
    Error.call(this, message);
    this.message=message
    if (status && Number.isInteger(status)) {
        this.status = status;
    }
    if (status && status instanceof Error) {
        this.innerError = status
    }
    if (innerError && innerError instanceof Error) {
        this.innerError = innerError;
    }
    if (this.innerError  && this.innerError.status) {
        this.status = this.innerError.status;
    }
    this.toPrettyObject = function () { 
        let pretty = {};
        pretty.success = false;
        pretty.error = {};
        pretty.error.message = this.message;
        if (this.innerError) {
            pretty.info = getInfo(this.innerError);
        }
        return pretty;
    }
}
function getInfo(err) {
    let info = {};
    info.error = {};
    info.error.message = err.message;
    console.log('Inner message', err.message);
    if (err.innerError) { 
        info.error.info = getInfo(err.innerError);
    }
    console.log('info', info);
    return info;
}
CustomError.prototype = new Error('');

module.exports = CustomError;