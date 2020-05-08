const constants = require('../helpers/constants.js')

module.exports.idIsValid = function(id) {
    if (id.length != constants.MONGO_ID_LENGTH|| !id.match(/^[0-9a-z]+$/)) {
        return false
    }
    return true
}

module.exports.validEmail = function(email) {
    console.log('testing email')
    if (email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
        console.log('email ok')
        return true
    }
    console.log('email not ok')
    return false
}