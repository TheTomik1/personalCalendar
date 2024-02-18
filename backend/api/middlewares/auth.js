const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' });

const secretKey = process.env.JWT_SECRET;

const userAuth = (req, res, next) => {
    const token = req.cookies.auth;

    if (!token) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    jwt.verify(token, secretKey,(err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Unauthorized' });
        }
        req.user = decoded;

        next();
    });
};

module.exports = userAuth;
