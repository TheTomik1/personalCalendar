process.env["DEBUG"] = "db-seed";

const fs = require('fs');
const debug = require('debug')('db-seed');
const { open } = require('sqlite');

const openDatabase = require('../openDatabaseConnection');

// TODO: Overwork this script to create the database and tables

async function seed() {
    await fs.createWriteStream('personalCalendar.db');

    try {
        const db = await openDatabase();
        await db.exec(`
            CREATE TABLE IF NOT EXISTS users
            (
                id  INTEGER PRIMARY KEY,
                username  VARCHAR(255) UNIQUE,
                email  VARCHAR(255) UNIQUE,
                password  VARCHAR(255),
                fullname  VARCHAR(255),
                createdAt  TIMESTAMP  DEFAULT (strftime('%s', 'now', 'localtime') + 3600) REFERENCES users (createdAt),
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
                location TEXT,
                color TEXT,
                FOREIGN KEY (calendarId) REFERENCES calendars(id)                                          
            );
        `);

        await db.exec(`
            CREATE TABLE IF NOT EXISTS profilePictures (
                id INTEGER NOT NULL PRIMARY KEY,
                userId INTEGER NOT NULL UNIQUE,
                imageName TEXT NOT NULL,
                FOREIGN KEY (userId) REFERENCES users(id)
            );
        `);

        await db.exec(`
            CREATE TABLE ntfyTopics
            (
                id INTEGER NOT NULL PRIMARY KEY,
                userId INTEGER NOT NULL UNIQUE,
                topic VARCHAR(255) NOT NULL,
                FOREIGN KEY (userId) REFERENCES users(id)
            );
        `);

        await db.close();
        debug('Database created.');
    } catch (e) {
        debug(`Error seeding database: ${e}`);
    }
}

seed();