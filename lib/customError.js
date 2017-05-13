"use strict";

module.exports = function (localizated_id,status, err) { 
   
    let info = '';
    let status_error;
    if (err) { 
        
        if (err.error) { 
            info=err.error.message;
        }
        if (err.message) { 
            info = err.message;
        }
        status_error = err.status;
    }
     return {
        success: false,
        error: {
            //Traducir los textos
            message: localizated_id,
            info: info
        },
        status: status_error || status
    };
}