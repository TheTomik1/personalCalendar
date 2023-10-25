const router = require('express').Router();
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const bcrypt = require('bcrypt');

async function openDatabase() {
  return await open({
    filename: 'api/personalCalendar.db',
    driver: sqlite3.Database,
  });
}

router.post("/register", async(req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).send({ message: 'Invalid body.' });
        }

        const db = await openDatabase();
        const findUser = await db.get('SELECT * FROM users WHERE username = ?', username);
        if (findUser) {
            return res.status(400).send({ message: 'User already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const insertedUser = await db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?) RETURNING id', username, email, hashedPassword);
        await db.run("INSERT INTO profilePictures(userId, image) VALUES (?, ?)", insertedUser.lastID, "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png")

        await db.close();
        await res.status(201).send({ message: 'User created.' });
    } catch (e) {
        res.status(500).send({ message: 'Internal server error.' });
    }
});

module.exports = router;
