const constants = require('../helpers/constants.js')

module.exports.idIsValid = function(id) {
    if (id.length != constants.MONGO_ID_LENGTH|| !id.match(/^[0-9a-z]+$/)) {
        return false
    }
    return true
}