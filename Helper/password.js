
var crypto = require("crypto");

const HashPassword = (password) => {
    const salt = Math.random().toString(36).substr(2, 10);
    var hmac = crypto.createHmac('sha1', salt);
    var hash = hmac.update(password)
    let hashedpass = hash.digest('hex');
    let secret = { salt: salt, hash: hashedpass }
    return secret
};

const verifyHashPassword = async (password, salt) => {
    var hmac = crypto.createHmac('sha1', salt);
    var hash = hmac.update(password)
    let hashedpass = hash.digest('hex');
    let secret = { salt: salt, hash: hashedpass }
    return secret
};
module.exports = { HashPassword, verifyHashPassword }
