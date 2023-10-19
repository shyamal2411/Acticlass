const jwt = require('jsonwebtoken');
const { UserSchema } = require('../database');

function authMiddleware(req, res, next) {
    // Get token from header
    let token = req.header('Authorization');

    // Check if token exists
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    token = token.split('Bearer ')[1];

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // verify if user is active        
        UserSchema.findOne({ email: decoded.data.email }).then((user) => {
            if (!user) {
                return res.status(400).json({ msg: 'User does not exist' });
            } else {
                // Add user from payload                
                req.user = user;
                next();
            }
        });
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}

module.exports = authMiddleware;
