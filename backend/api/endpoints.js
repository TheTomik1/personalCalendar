const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: __dirname + '/.env' });

const openDatabase = require('./functions/openDatabaseConnection');
const getUserInformation = require('./functions/getUserInformation');

const secretKey = process.env.JWT_SECRET;

router.use(cors({ origin: 'http://localhost:3000', credentials: true }));

router.post("/register", async(req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).send({ message: 'Invalid body.' });
        }

        const db = await openDatabase();
        const findUser = await db.get('SELECT * FROM users WHERE username = ? OR email = ?', username, email);
        if (findUser) {
            return res.status(400).send({ message: 'User already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const insertedUser = await db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?) RETURNING id', username, email, hashedPassword);
        await db.run("INSERT INTO profilePictures(userId, image) VALUES (?, ?)", insertedUser.lastID, "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png")

        await db.run("INSERT INTO calendars(guid, ownerId) VALUES (?, ?)", uuidv4(), insertedUser.lastID);

        await db.close();
        await res.status(201).send({ message: 'User created.' });
    } catch (e) {
        res.status(500).send({ message: 'Internal server error.' });
    }
});

router.post("/login", async(req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({ message: 'Invalid body.' });
        }

        const db = await openDatabase();
        const user = await db.get('SELECT * FROM users WHERE email = ?', email);
        if (!user) {
            return res.status(400).send({ message: 'User does not exist.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).send({ message: 'Invalid password.' });
        }

        const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '7d' });
        await res.cookie('auth', token, { httpOnly: true, maxAge: 604800000 });
        await res.status(200).send({ message: 'User logged in.' });
        await db.close();
    } catch (e) {
        res.status(500).send({ message: 'Internal server error.' });
    }
});

router.post("/logout", async(req, res) => {
    try {
        await res.clearCookie('auth');
        await res.status(200).send({ message: 'Logged out.' });
    } catch (e) {
        res.status(500).send({ message: 'Internal server error.' });
    }
});

router.get("/get-calendar", async(req, res) => {
    try {
        const db = await openDatabase();

        if (!req.cookies.auth) {
            return res.status(401).send({ message: 'Unauthorized.' });
        }

        let verifyAuthToken = jwt.verify(req.cookies.auth, secretKey);
        const calendar = await db.get("SELECT * FROM calendars WHERE ownerId = ?", verifyAuthToken.id);

        res.status(200).send({ calendar });
    } catch (e) {
        res.status(500).send({ message: 'Internal server error.' });
    }
});

module.exports = router;
