const jwt = require('jsonwebtoken');

require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; //expecting bearer <token>

    if(!token) {
        return res.status(401).json({message:'Access denied, no token provided'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token'});
    }
};

module.exports = authenticateToken;