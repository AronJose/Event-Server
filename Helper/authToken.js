

const jwt = require('jsonwebtoken');
const Session = require('../Model/sessions');
const secretKey = "secretkey";

async function verifyToken(req, res, next) {
    let token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Authentication failed. No token provided.' });
    }

    // Extract Bearer token
    if (token.startsWith('Bearer ')) {
        token = token.slice(7);
        console.log(token, "token");
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;

        // Validate session
        const sessionData = await sessionValidation(token, req.user._id);
        if (!sessionData) {
            return res.status(400).json({ error: "Invalid session" });
        }

        next();
    } catch (err) {
        return res.status(403).json({ message: 'Authentication failed. Invalid token.' });
    }
}

const sessionValidation = async (token, user_id) => {
    const sessionToken = await Session.findOne({ token, user_id });
    return !!sessionToken; // Returns true if session exists, false otherwise
};

module.exports = verifyToken;


