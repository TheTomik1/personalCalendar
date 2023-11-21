process.env["DEBUG"] = "db-seed";

const sqlite3 = require('sqlite3');
const debug = require('debug')('db-seed');
const { open } = require('sqlite');

const openDatabase = require('../openDatabaseConnection');

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
                createdAt  TIMESTAMP  DEFAULT (strftime('%s', 'now', 'localtime') + 3600) REFERENCES users (createdAt),
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
                createdAt  TIMESTAMP  DEFAULT (strftime('%s', 'now', 'localtime') + 3600) REFERENCES calendars (createdAt)
            );
        `);

        await db.exec(`
            CREATE TABLE IF NOT EXISTS calendarEvents 
            (
                id INTEGER NOT NULL PRIMARY KEY,
                calendarId INTEGER NOT NULL,
                datetimeStart INTEGER DEFAULT CURRENT_TIMESTAMP NOT NULL,
                datetimeEnd INTEGER DEFAULT CURRENT_TIMESTAMP NOT NULL,
                type TEXT NOT NULL,
                name TEXT NOT NULL,
                description TEXT,
                details TEXT,
                location TEXT,
                FOREIGN KEY (calendarId) REFERENCES calendars(id)                                          
            );
        `);

        await db.close();
        debug('Database seeded.');
    } catch (e) {
        debug(`Error seeding database: ${e}`);
    }
}

seed();