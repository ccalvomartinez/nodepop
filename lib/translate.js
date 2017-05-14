'use strict';

const Localize = require('localize');

const traducciones = require('./translations.json');
const myLoc = new Localize(traducciones);

module.exports = function translate(text, culture) {
    try {
        if (!culture) {
            culture = 'en';
        }
        myLoc.setLocale(culture);
        return myLoc.translate(text);
    } catch (err) {
        return text;
    }
};

//console.log(module.exports('Password not valid', 'es'));
