const jwt = require('jsonwebtoken');
const Session = require('../Model/sessions');
const secretKey = "secretkey";

async function verifyToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Authentication failed.' });
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Authentication failed. Invalid token.' });
        }
        req.user = decoded;
    });
    const sessionData = await sessionValidation(token, req.user._id)
    console.log(sessionData, "sessionData")
    if (!sessionData) {
        res.status(400).json({ error: "invalid session" });
    } else {
        next();
    }
};

const sessionValidation = async (token, user_id) => {
    const sessionToken = await Session.findOne({ token, user_id })
    console.log(sessionToken, "sessionToken")
    if (sessionToken) {
        return (true);
    } else {
        return (false);
    }
}

module.exports = verifyToken;
