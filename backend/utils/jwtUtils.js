const morgan = require("morgan");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const token = req.headers["x-access-token"];
  
    if(!token) {
        res.json({ auth: false, message: 'Please enter a token' })
    } else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err) {
                res.json({ auth: false, message: 'Authentication failed' });
            } else {
                req.userId = decoded.id;
                next();
            }
        })
    }
}

module.exports = {
    verifyToken
}