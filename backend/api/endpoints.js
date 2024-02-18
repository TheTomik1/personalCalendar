const router = require('express').Router();
const multer = require('multer');
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const { format } = require('date-fns');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
require('dotenv').config({ path: __dirname + '/.env' });

const authMiddleware = require('./middlewares/auth');
const adminAuthMiddleware = require('./middlewares/admin-auth');

const openDatabase = require('../openDatabaseConnection');
const getUserInformation = require('./functions/getUserInformation');

const secretKey = process.env.JWT_SECRET;

router.use(cors({ origin: 'http://localhost:3000', credentials: true }));

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const uploadPath = path.join(__dirname, 'images');
        callback(null, uploadPath);
    },
    filename: (req, file, callback) => {
        const guid = uuidv4();
        const fileExtension = path.extname(file.originalname);
        const fileName = `${guid}${fileExtension}`;
        callback(null, fileName);
    },
});

const fileFilter = (req, file, callback) => {
    const allowedFileTypes = ['image/png', 'image/jpg', 'image/jpeg'];

    if (allowedFileTypes.includes(file.mimetype)) {
        callback(null, true); // Accept the file
    } else {
        callback(new Error('Invalid file type. Only PNG and JPG are allowed.'), false);
    }
};

const upload = multer({
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB file size limit
    },
    storage,
    fileFilter
});

router.post("/register", async(req, res) => {
    try {
        const { userName, fullName, email, password } = req.body;
        if (!userName || !fullName || !email || !password) {
            return res.status(400).send({ message: 'Invalid body.' });
        }

        const db = await openDatabase();
        const findUser = await db.get('SELECT * FROM users WHERE username = ? OR email = ?', userName, email);
        if (findUser) {
            return res.status(400).send({ message: 'User already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const insertedUser = await db.run('INSERT INTO users (username, fullname, email, password) VALUES (?, ?, ?, ?) RETURNING id', userName, fullName, email, hashedPassword);

        await db.run("INSERT INTO calendars(userId) VALUES (?)", insertedUser.lastID);

        await res.status(201).send({ message: 'User created.' });
        await db.close();
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

        if (user.isBanned) {
            return res.status(400).send({ message: 'This account is banned. See guides to learn more about ban appeal.' });
        }

        const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '7d' });
        await res.cookie('auth', token, { maxAge: 7 * 24 * 60 * 60 * 1000 , httpOnly: true });
        await res.status(201).send({ message: 'User logged in.' });
        await db.close();
    } catch (e) {
        await res.status(500).send({ message: 'Internal server error.' });
    }
});

router.post("/logout", authMiddleware, async(req, res) => {
    try {
        await res.clearCookie('auth');
        await res.status(201).send({ message: 'Logged out.' });
    } catch (e) {
        await res.status(500).send({ message: 'Internal server error.' });
    }
});

router.get("/me", authMiddleware, async(req, res) => {
    const userInformation = await getUserInformation(req.user.id);

    await res.status(200).send({ userInformation });
});

router.get("/me-profile-picture", authMiddleware, async(req, res) => {
    const userInformation = await getUserInformation(req.user.id);

    if (userInformation === null || !userInformation["imageName"]) {
        return res.status(404).send({ message: 'No profile picture found.' }); // No profile picture found.
    }

    const imagePath = path.join(__dirname, 'images', userInformation["imageName"]);

    return res.status(200).sendFile(imagePath);
});

router.post("/edit-user", authMiddleware, async(req, res) => {
    try {
        const db = await openDatabase();

        let { userName, fullName, newEmail, newPassword } = req.body;

        await db.run("UPDATE users SET username = ?, fullname = ? WHERE id = ?", userName, fullName, req.user.id);

        if (newEmail !== "") {
            await db.run("UPDATE users SET email = ? WHERE id = ?", newEmail, req.user.id);
        }
        if (newPassword !== "") {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await db.run("UPDATE users SET password = ? WHERE id = ?", hashedPassword, req.user.id);
        }

        await res.status(201).send({ message: 'User edited.' });
        await db.close();
    } catch (e) {
        if (e.code === "SQLITE_CONSTRAINT") {
            return res.status(400).send({ message: 'Such username or email already exists.' });
        }
        await res.status(500).send({ message: 'Internal server error.' });
    }
});

router.post("/delete-user", authMiddleware, async(req, res) => {
    try {
        const db = await openDatabase();

        await db.run("DELETE FROM users WHERE id = ?", req.user.id);
        await db.run("DELETE FROM calendars WHERE userId = ?", req.user.id);
        await db.run("DELETE FROM calendarEvents WHERE calendarId = ?", req.user.id);
        await db.run("DELETE FROM profilePictures WHERE userId = ?", req.user.id);
        await res.clearCookie('auth');

        await res.status(201).send({ message: 'User deleted.' });
        await db.close();
    } catch (e) {
        await res.status(500).send({ message: 'Internal server error.' });
    }
});

router.get("/get-calendar", authMiddleware, async(req, res) => {
    try {
        const db = await openDatabase();

        const calendars = await db.get("SELECT * FROM calendars WHERE ownerId = ?", req.user.id);

        await res.status(200).send({ calendars });
        await db.close();
    } catch (e) {
        await res.status(500).send({ message: 'Internal server error.' });
    }
});

router.post("/add-edit-event", authMiddleware, async(req, res) => {
    try {
        const db = await openDatabase();
        const userCalendar = await db.get("SELECT * FROM calendars WHERE userId = ?", req.user.id);  // Get the user's calendar.

        const currentDateTime = format(new Date(), "yyyy-MM-dd HH:mm");

        const { id, eventType, title, description, location, reminderOption, datetimeStart, datetimeEnd, color, action } = req.body;

        if (!eventType || !reminderOption || !datetimeStart || !datetimeEnd || !color || !action) {
            return res.status(400).send({ message: 'Invalid body.' });
        }

        if (['event', 'task', 'meeting'].indexOf(eventType.toLowerCase()) === -1) {
            return res.status(400).send({ message: 'Invalid event type.' });
        }

        if (datetimeStart.split(" ")[0] !== datetimeEnd.split(" ")[0]) {
            return res.status(400).send({ message: 'Event must be within the same day.' });
        }

        if (datetimeStart < currentDateTime) {
            return res.status(400).send({ message: 'Start date cannot be before current date.' });
        }

        if (datetimeStart > datetimeEnd) {
            return res.status(400).send({ message: 'Start date cannot be after end date.' });
        }

        if (action === "add") {
            await db.run("INSERT INTO calendarEvents(calendarId, eventType, title, description, location, reminderOption, reminderSent, datetimeStart, datetimeEnd, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", userCalendar.id, eventType, title, description, location, reminderOption, 0, datetimeStart, datetimeEnd, color);
            await res.status(201).send({ message: 'Event added.' });
        } else if (action === "edit") {
            await db.run("UPDATE calendarEvents SET eventType = ?, title = ?, description = ?, location = ?, reminderOption = ?, datetimeStart = ?, datetimeEnd = ?, color = ? WHERE id = ?", eventType, title, description, location, reminderOption, datetimeStart, datetimeEnd, color, id);
            await res.status(201).send({ message: 'Event edited.' });
        } else {
            await res.status(400).send({ message: 'Invalid action.' });
        }

        await db.close();
    } catch (e) {
        await res.status(500).send({ message: 'Internal server error.' });
    }
});

router.get("/get-events", authMiddleware, async(req, res) => {
    try {
        const db = await openDatabase();

        const events = await db.all(`SELECT ce.* FROM calendarEvents ce LEFT JOIN calendars c ON ce.calendarId = c.id WHERE c.userId = ? ORDER BY ce.datetimeStart`, req.user.id);

        await res.status(200).send({ events });
        await db.close();
    } catch (e) {
        res.status(500).send({ message: 'Internal server error.' });
    }
});

router.post("/delete-event", authMiddleware, async(req, res) => {
    try {
        const db = await openDatabase();

        const { id } = req.body;

        if (!id) {
            return res.status(400).send({ message: 'Invalid body.' });
        }

        await db.run("DELETE FROM calendarEvents WHERE id = ?", id);

        await res.status(201).send({ message: 'Event deleted.' });
        await db.close();
    } catch (e) {
        await res.status(500).send({ message: 'Internal server error.' });
    }
});

router.post("/upload-profile-picture", authMiddleware, async(req, res) => {
    try {
        upload.single('image')(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).send({ message: "Image size too large." });
                }
            } else if (err) {
                if (err.message === 'Invalid file type. Only PNG and JPG are allowed.') {
                    return res.status(400).send({ message: "Invalid file type. Only PNG and JPG file types are allowed." });
                }
                return res.status(500).send({ message: "An unknown error occurred." });
            }

            if (!req.file) {
                return res.status(400).send({ message: "No file uploaded." });
            }

            const db = await openDatabase();

            const existingImage = await db.get("SELECT * FROM profilePictures WHERE userId = ?", req.user.id);

            if (existingImage !== undefined) {
                const oldImagePath = path.join(__dirname, 'images', existingImage["imageName"]);
                fs.unlinkSync(oldImagePath); // Delete old image.
            }

            await db.run("INSERT OR REPLACE INTO profilePictures(userid, imageName) VALUES (?, ?)", req.user.id, req.file.filename);

            await res.status(201).send({ status: "Successfully uploaded or replaced user image." });
            await db.close();
        });
    } catch (e) {
        res.status(500).send({ message: 'Internal server error.' });
    }
});

router.post("/modify-ntfy-topic", authMiddleware, async(req, res) => {
    try {
        const db = await openDatabase();

        let { ntfyTopic } = req.body;

        if (!ntfyTopic) {
            ntfyTopic = ""; // If nothing is provided, set it to an empty string.
        }

        await db.run("INSERT OR REPLACE INTO ntfyTopics(userId, topic) VALUES (?, ?)", req.user.id, ntfyTopic);

        await res.status(201).send({ message: 'Topic added.' });
        await db.close();
    } catch (e) {
        await res.status(500).send({ message: 'Internal server error.' });
    }
});

router.post("/admin/login", async(req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).send({ message: 'Invalid body.' });
        }

        if (username !== 'admin') {
            return res.status(400).send({ message: 'Invalid username.' });
        }

        const db = await openDatabase();

        const adminUser = await db.get('SELECT * FROM users WHERE username = ?', username);
        if (!adminUser) {
            return res.status(400).send({ message: 'Admin user does not exist.' });
        }

        const adminPasswordMatch = await bcrypt.compare(password, adminUser.password);

        if (!adminPasswordMatch) {
            return res.status(400).send({ message: 'Invalid password.' });
        }

        const token = jwt.sign({ id: 1 }, secretKey, { expiresIn: '1d' });
        await res.cookie('auth', token, { maxAge: 1 * 24 * 60 * 60 * 1000 , httpOnly: true });
        await res.status(201).send({ message: 'Admin logged in.' });
        await db.close();
    } catch (e) {
        await res.status(500).send({ message: 'Internal server error.' });
    }
});

router.get("/admin/get-users", adminAuthMiddleware, async(req, res) => {
    try {
        const db = await openDatabase();

        const users = await db.all("SELECT * FROM users WHERE username != 'admin'");

        await res.status(200).send({ users });
        await db.close();
    } catch (e) {
        await res.status(500).send({ message: 'Internal server error.' });
    }
});

router.post("/admin/edit-user", adminAuthMiddleware, async(req, res) => {
    try {
        const db = await openDatabase();

        const { id } = req.body;
        const { userName, email, fullName, isBanned } = req.body.data;

        if (userName !== undefined) {
            await db.run("UPDATE users SET username = ? WHERE id = ?", userName, id);
        }
        if (email !== undefined) {
            await db.run("UPDATE users SET email = ? WHERE id = ?", email, id);
        }
        if (fullName !== undefined) {
            await db.run("UPDATE users SET fullname = ? WHERE id = ?", fullName, id);
        }
        if (isBanned !== undefined) {
            await db.run("UPDATE users SET isBanned = ? WHERE id = ?", isBanned, id);
        }

        await res.status(201).send({ message: 'User edited.' });
        await db.close();
    } catch (e) {
        await res.status(500).send({ message: 'Internal server error.' });
    }
});

router.post("/admin/delete-user", adminAuthMiddleware, async(req, res) => {
    try {
        const db = await openDatabase();

        const { id } = req.body;

        await db.run("DELETE FROM users WHERE id = ?", id);
        await db.run("DELETE FROM calendars WHERE userId = ?", id);
        await db.run("DELETE FROM calendarEvents WHERE calendarId = ?", id);
        await db.run("DELETE FROM profilePictures WHERE userId = ?", id);

        await res.status(201).send({ message: 'User deleted.' });
        await db.close();
    } catch (e) {
        await res.status(500).send({ message: 'Internal server error.' });
    }
});


module.exports = router;
