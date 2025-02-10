const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;

function generateToken(payload) {
    return jwt.sign(payload, secretKey, { expiresIn: '1h' }); 
}

function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    } catch (err) {
        return null; 
    }
}

module.exports = { generateToken, verifyToken };