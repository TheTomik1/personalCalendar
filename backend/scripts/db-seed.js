const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function openDatabase() {
    return await open({
        filename: 'api/personalCalendar.db',
        driver: sqlite3.Database,
    });
}

async function seed() {
    try {
        const db = await openDatabase();
        await db.exec(`
            CREATE TABLE IF NOT EXISTS users
            (
                id  INTEGER PRIMARY KEY,
                username  VARCHAR(255) UNIQUE,
                email  VARCHAR(255),
                password  VARCHAR(255) UNIQUE,
                created_at  TIMESTAMP  DEFAULT (strftime('%s', 'now', 'localtime') + 3600) REFERENCES users (created_at),
                isBanned  TINYINT(1) DEFAULT 0,
                isAdmin  TINYINT(1) DEFAULT 0
            );
        `);

        await db.exec(`
            CREATE TABLE IF NOT EXISTS profilePictures
            (
                id  INT PRIMARY KEY,
                userId INT,
                image  VARCHAR(255)
            );
        `);

        await db.exec(`
            CREATE TABLE IF NOT EXISTS calendars
            (
                id  INTEGER PRIMARY KEY,
                guid TEXT,
                ownerId  INT,
                created_at  TIMESTAMP  DEFAULT (strftime('%s', 'now', 'localtime') + 3600) REFERENCES calendars (created_at)
            );
        `);

        await db.close();
        console.log('Database seeded.');
    } catch (e) {
        console.log(`Error seeding database: ${e}`);
    }
}

seed();