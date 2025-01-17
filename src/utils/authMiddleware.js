const jwt = require('jsonwebtoken');
const rolePermissions = require('./rolesPermissions');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// Authenticate the JWT token
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
        console.log('Decoded:', decoded);
        req.user = decoded; // Attach user info to the request
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};
// Authorize based on roles and permissions
const authorize = (action) => (req, res, next) => {
    const userRole = req.user.role;

    // Restrict "Intern" role to "view" action only
    if (userRole === 'Intern' && action !== 'view') {
        return res.status(403).json({ message: 'Access denied. Interns are only allowed to view tasks.' });
    }

    if (!rolePermissions[userRole] || !rolePermissions[userRole].includes(action)) {
        return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }

    next();
};

// Authorize based on roles
// const authorize = (roles) => (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//         return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
//     }
//     next();
// };

module.exports = { authenticate, authorize };
