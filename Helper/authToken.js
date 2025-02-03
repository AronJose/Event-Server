// const jwt = require('jsonwebtoken');
// const Session = require('../Model/sessions');
// const secretKey = "secretkey";

// async function verifyToken(req, res, next) {
//     const token = req.header('Authorization');
//     if (!token) {
//         return res.status(401).json({ message: 'Authentication failed.' });
//     }
//     jwt.verify(token, secretKey, (err, decoded) => {
//         if (err) {
//             return res.status(403).json({ message: 'Authentication failed. Invalid token.' });
//         }
//         req.user = decoded;
//     });
//     const sessionData = await sessionValidation(token, req.user._id)
//     console.log(sessionData, "sessionData")
//     if (!sessionData) {
//         res.status(400).json({ error: "invalid session" });
//     } else {
//         next();
//     }
// };

// const sessionValidation = async (token, user_id) => {
//     const sessionToken = await Session.findOne({ token, user_id })
//     console.log(sessionToken, "sessionToken")
//     if (sessionToken) {
//         return (true);
//     } else {
//         return (false);
//     }
// }

// module.exports = verifyToken;

const jwt = require('jsonwebtoken');
const Session = require('../Model/sessions');
const secretKey = "secretkey";

async function verifyToken(req, res, next) {
    try {
        let token = req.header('Authorization');
        if (!token) {
            return res.status(401).json({ message: 'Authentication failed. No token provided.' });
        }

        // Remove "Bearer " prefix if present
        if (token.startsWith('Bearer ')) {
            token = token.slice(7);
        }

        // Verify JWT token
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; // Ensure req.user is set before using it

        // Validate session
        const sessionData = await sessionValidation(token, req.user._id);
        console.log(sessionData, "sessionData");

        if (!sessionData) {
            return res.status(400).json({ error: "Invalid session" });
        }

        next(); // Proceed to the next middleware or controller
    } catch (err) {
        console.error('Token verification error:', err);
        return res.status(403).json({ message: 'Authentication failed. Invalid token.' });
    }
}

const sessionValidation = async (token, user_id) => {
    try {
        const sessionToken = await Session.findOne({ token, user_id });
        console.log(sessionToken, "sessionToken");
        return !!sessionToken; // Returns true if session exists, false otherwise
    } catch (err) {
        console.error('Session validation error:', err);
        return false;
    }
}

module.exports = verifyToken;

