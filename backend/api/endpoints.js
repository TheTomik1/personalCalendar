const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: __dirname + '/.env' });

const openDatabase = require('../openDatabaseConnection');
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
        const insertedUser = await db.run('INSERT INTO users (username, email, password, profilePicture) VALUES (?, ?, ?, ?) RETURNING id', username, email, hashedPassword, "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");

        await db.run("INSERT INTO calendars(guid, ownerId) VALUES (?, ?)", uuidv4(), insertedUser.lastID);

        await db.close();
        await res.status(201).send({ message: 'User created.' });
    } catch (e) {
        await res.status(500).send({ message: 'Internal server error.' });
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
        await res.status(201).send({ message: 'User logged in.' });
        await db.close();
    } catch (e) {
        await res.status(500).send({ message: 'Internal server error.' });
    }
});

router.post("/logout", async(req, res) => {
    try {
        await res.clearCookie('auth');
        await res.status(201).send({ message: 'Logged out.' });
    } catch (e) {
        await res.status(500).send({ message: 'Internal server error.' });
    }
});

router.get("/current-user", async(req, res) => {
    if (req.cookies.auth) {
        const userInformation = await getUserInformation(jwt.verify(req.cookies.auth, secretKey).id);

        await res.status(200).send({ userInformation });
    } else {
        await res.status(401).send({ message: 'Unauthorized' });
    }
});

router.get("/get-calendar", async(req, res) => {
    try {
        const db = await openDatabase();

        if (!req.cookies.auth) {
            return res.status(401).send({ message: 'Unauthorized.' });
        }

        let verifyAuthToken = jwt.verify(req.cookies.auth, secretKey);
        const calendars = await db.get("SELECT * FROM calendars WHERE ownerId = ?", verifyAuthToken.id);

        await res.status(200).send({ calendars });
    } catch (e) {
        await res.status(500).send({ message: 'Internal server error.' });
    }
});

router.post("/add-event", async(req, res) => {
    try {
        const db = await openDatabase();

        if (!req.cookies.auth) {
            return res.status(401).send({ message: 'Unauthorized.' });
        }

        let verifyAuthToken = jwt.verify(req.cookies.auth, secretKey);
        const calendar = await db.get("SELECT * FROM calendars WHERE ownerId = ?", verifyAuthToken.id);

        const currentDateTime = new Date().toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');
        let { title, description, type, color, location, start, end } = req.body;

        if (!title || !type || !start || !end || !color) {
            return res.status(400).send({ message: 'Invalid body.' });
        }

        if (!title) {
            title = "Add title.";
        }
        if (!description) {
            description = "Add description.";
        }
        if (!location) {
            location = "Add location.";
        }

        if (['event', 'reminder', 'task', 'meeting'].indexOf(type.toLowerCase()) === -1) {
            return res.status(400).send({ message: 'Invalid event type.' });
        }

        if (start.split(" ")[0] !== end.split(" ")[0]) {
            return res.status(400).send({ message: 'Event must be within the same day.' });
        }

        if (start < currentDateTime.split(" ")[0]) {
            return res.status(400).send({ message: 'Start date cannot be before current date.' });
        }

        if (start > end) {
            return res.status(400).send({ message: 'Start date cannot be after end date.' });
        }

        await db.run("INSERT INTO calendarEvents(calendarId, datetimeStart, datetimeEnd, type, name, description, color, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", calendar.id, start, end, type, title, description, color, location);

        await res.status(201).send({ message: 'Event added.' });
    } catch (e) {
        await res.status(500).send({ message: 'Internal server error.' });
    }
});

router.post("/edit-event", async(req, res) => {
    try {
        const db = await openDatabase();

        if (!req.cookies.auth) {
            return res.status(401).send({ message: 'Unauthorized.' });
        }

        let { id, title, description, type, color, location, start, end } = req.body;

        if (!title) {
            title = "Add title.";
        }
        if (!description) {
            description = "Add description.";
        }
        if (!location) {
            location = "Add location.";
        }

        if (!id || !title || !type || !start || !end || !color) {
            return res.status(400).send({ message: 'Invalid body.' });
        }

        if (['event', 'reminder', 'task', 'meeting'].indexOf(type.toLowerCase()) === -1) {
            return res.status(400).send({ message: 'Invalid event type.' });
        }

        if (start.split(" ")[0] !== end.split(" ")[0]) {
            return res.status(400).send({ message: 'Event must be within the same day.' });
        }

        if (start > end) {
            return res.status(400).send({ message: 'Start date cannot be after end date.' });
        }

        await db.run("UPDATE calendarEvents SET datetimeStart = ?, datetimeEnd = ?, type = ?, name = ?, description = ?, color = ?, location = ? WHERE id = ?", start, end, type, title, description, color, location, id);

        await res.status(201).send({ message: 'Event edited.' });
    } catch (e) {
        await res.status(500).send({ message: 'Internal server error.' });
    }
});

router.get("/get-events", async(req, res) => {
    try {
        const db = await openDatabase();

        if (!req.cookies.auth) {
            return res.status(401).send({ message: 'Unauthorized.' });
        }

        let verifyAuthToken = jwt.verify(req.cookies.auth, secretKey);
        const events = await db.all("SELECT * FROM calendarEvents WHERE calendarId = ? ORDER BY datetimeStart", verifyAuthToken.id);

        res.status(200).send({ events });
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: 'Internal server error.' });
    }
});

router.post("/delete-event", async(req, res) => {
    try {
        const db = await openDatabase();

        if (!req.cookies.auth) {
            return res.status(401).send({ message: 'Unauthorized.' });
        }

        let verifyAuthToken = jwt.verify(req.cookies.auth, secretKey);
        const calendar = await db.get("SELECT * FROM calendars WHERE ownerId = ?", verifyAuthToken.id);

        const { id } = req.body;

        if (!id) {
            return res.status(400).send({ message: 'Invalid body.' });
        }

        await db.run("DELETE FROM calendarEvents WHERE id = ?", id);

        await res.status(201).send({ message: 'Event deleted.' });
    } catch (e) {
        await res.status(500).send({ message: 'Internal server error.' });
    }
});

module.exports = router;
