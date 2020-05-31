const constants = require('../helpers/constants.js')
const jwt = require('jsonwebtoken');

module.exports.idIsValid = function(id) {
    if (id.length != constants.MONGO_ID_LENGTH|| !id.match(/^[0-9a-z]+$/)) {
        return false
    }
    return true
}

module.exports.validEmail = function(email) {
    if (email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
        return true
    }
    return false
}

module.exports.getRedirectFromToken = function(token) {
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (Date.parse(decoded.expiration) <= new Date()) {
            throw 'Token expired'
        } else {
            console.log('Valid token: ' + decoded.email)
            return { 'redirect': decoded.redirect }
        }
    } catch (e) {
        console.log(e)
        return { 'error': constants.BAD_TOKEN }
    }
}

module.exports.verifyToken = function(token) {
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (Date.parse(decoded.expiration) <= new Date()) {
            throw 'Token expired'
        } else {
            console.log('Valid token: ' + decoded.email)
            return decoded.email
        }
    } catch (e) {
        console.log(e)
        return('invalid')
    }
}

module.exports.sameDomain = function(email,website) {
    domain = website.substring(website.indexOf(".") + 1);
    //handle case of domain that ends with slash
    if (domain.slice(-1) == '/') {
        domain = domain.substring(0, domain.length - 1);
    }

    var idx = email.indexOf('@' + domain);

    console.log(idx)
    if (idx > -1) {
        console.log("Authorizing " + email + " for website " + website)
        return true
    } else {
        return false
    }
}