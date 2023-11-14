const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const openDatabase = require('../api/functions/openDatabaseConnection');

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
                profilePicture  TEXT,
                isBanned  TINYINT(1) DEFAULT 0,
                isAdmin  TINYINT(1) DEFAULT 0
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

        await db.exec(`
            CREATE TABLE IF NOT EXISTS calendar_events 
            (
                id INTEGER NOT NULL PRIMARY KEY,
                calendar_id INTEGER NOT NULL,
                datetime_start INTEGER DEFAULT CURRENT_TIMESTAMP NOT NULL,
                datetime_end INTEGER DEFAULT CURRENT_TIMESTAMP NOT NULL,
                type TEXT NOT NULL,
                name TEXT NOT NULL,
                description TEXT,
                details TEXT,
                location TEXT,
                FOREIGN KEY (calendar_id) REFERENCES calendars(calendar_id)                                          
            );
        `);

        await db.close();
        console.log('Database seeded.');
    } catch (e) {
        console.log(`Error seeding database: ${e}`);
    }
}

seed();