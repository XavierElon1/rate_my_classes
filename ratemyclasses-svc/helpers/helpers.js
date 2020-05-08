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

module.exports.verifyToken = function(token) {
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (Date.parse(decoded.expiration) <= new Date()) {
            throw 'Token expired'
        } else {
            console.log('Access granted: ' + decoded.email)
            return decoded.email
        }
    } catch (e) {
        console.log(e)
        return(e)
    }
}