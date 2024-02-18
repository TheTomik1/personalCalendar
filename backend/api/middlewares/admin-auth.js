const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' });

const getUserInformation = require('../functions/getUserInformation');

const secretKey = process.env.JWT_SECRET;

const adminAuth = async(req, res, next) => {
    const token = req.cookies.auth;

    if (!token) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    jwt.verify(token, secretKey,async(err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        const userInformation = await getUserInformation(decoded.id);
        if (userInformation.isAdmin !== 1) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        req.user = decoded;

        next();
    });
};

module.exports = adminAuth;
